import { expect, test } from '@playwright/test';
import { silentWav, baselineResult, baselineSession } from './fixtures.js';

test.beforeEach(async ({ page }) => {
  await page.route('**/results/manifest.json', route => route.fulfill({ json: [baselineSession] }));
  await page.route('**/results/e2e-baseline.json', route => route.fulfill({ json: { ...baselineResult, duration: 30, beats: [0, 0.5, 1, 1.5, 2] } }));
  await page.route('**/results/*/library', route => route.fulfill({ json: { tags: [], lastOpenedAt: new Date().toISOString() } }));
  await page.route('**/audio/e2e-baseline.mp3', route => route.fulfill({ contentType: 'audio/wav', body: silentWav(30) }));
  await page.route('**/stems/e2e-baseline/*', route => route.fulfill({ contentType: 'audio/wav', body: silentWav(30) }));
  await page.route('**/video/**', route => route.abort());
  await page.route('**/library/folders', route => route.fulfill({ json: [] }));
  await page.addInitScript(() => {
    window.__media = { stems: {}, original: null, reject: [] };
    const NativeAudio = window.Audio;
    const created = [];
    Object.defineProperty(window.__media, 'stems', { get: () => Object.fromEntries(created.filter(media => media.dataset.stem).map(media => [media.dataset.stem, media])) });
    const nativeFetch = window.fetch;
    window.fetch = (input, ...args) => {
      const name = (input instanceof Request ? input.url : String(input)).match(/\/stems\/[^/]+\/(\w+)\.(?:wav|mp3)/)?.[1];
      if (window.__media.reject.includes(name)) return Promise.resolve(new Response('', { status: 503 }));
      return nativeFetch(input, ...args);
    };
    window.Audio = function (...args) {
      const media = new NativeAudio(...args);
      created.push(media);
      const name = String(args[0]).match(/\/stems\/[^/]+\/(\w+)\.(?:wav|mp3)/)?.[1];
      if (name) window.__media.stems[name] = media;
      return media;
    };
    window.Audio.prototype = NativeAudio.prototype;
    window.__clickPeaks = [];
    const clickAnalysers = [];
    const connect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (target, ...args) {
      const result = connect.call(this, target, ...args);
      if (this instanceof ChannelSplitterNode && args[0] === this.numberOfOutputs - 1) {
        const analyser = this.context.createAnalyser(); analyser.fftSize = 1024;
        const zero = this.context.createGain(); zero.gain.value = 0;
        connect.call(target, analyser); connect.call(analyser, zero); connect.call(zero, this.context.destination);
        clickAnalysers.push(analyser);
      }
      return result;
    };
    let lastClick = -1;
    const samples = new Float32Array(1024);
    setInterval(() => {
      for (const analyser of clickAnalysers) {
        analyser.getFloatTimeDomainData(samples);
        if (samples.some(value => Math.abs(value) > 0.01) && analyser.context.currentTime - lastClick > 0.25) {
          lastClick = analyser.context.currentTime;
          window.__clickPeaks.push({ contextTime: lastClick, position: window.__media.original?.currentTime ?? 0 });
        }
      }
    }, 10);
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      if (this.tagName === 'AUDIO' && !this.dataset.stem) window.__media.original = this;
      const name = this.dataset.stem;
      if (name) window.__media.stems[name] = this;
      if (window.__media.reject.includes(name)) return Promise.reject(new Error('simulated unavailable stem'));
      return nativePlay.apply(this, args);
    };
  });
});

const start = async page => {
  await page.goto('/');
  await expect(page.locator('#btn-play')).toBeEnabled();
  await page.locator('#btn-play').click();
  await expect.poll(() => page.evaluate(() => Object.keys(window.__media.stems).length)).toBe(4);
};
const originalVolume = page => page.evaluate(() => window.__media.original?.volume);

for (const rejected of [['vocals'], ['vocals', 'drums', 'bass', 'other']]) {
  test(`${rejected.length}パートの失敗を表示し元音源へ戻り、再試行できる`, async ({ page }) => {
    let blocked = true;
    await page.route('**/stems/e2e-baseline/*', route => {
      const name = route.request().url().match(/\/(\w+)\.(?:wav|mp3)/)?.[1];
      return blocked && rejected.includes(name) ? route.fulfill({ status: 503, body: '' })
        : route.fulfill({ contentType: 'audio/wav', body: silentWav(30) });
    });
    await start(page);
    await expect(page.locator('#stem-status')).toContainText('再生できません');
    await expect.poll(() => originalVolume(page)).toBeGreaterThan(0);
    expect(await page.evaluate(() => Object.values(window.__media.stems).every(media => media.muted && media.paused))).toBe(true);
    blocked = false;
    await page.locator('#btn-retry-stems').click();
    await expect(page.locator('#stem-status')).toContainText('自動同期');
    await expect.poll(() => originalVolume(page)).toBe(0);
    expect(await page.evaluate(() => Object.values(window.__media.stems).every(media => !media.muted && !media.paused))).toBe(true);
  });
}

test('全パートミュート後の音量変更と再生再開でも元音源を鳴らさない', async ({ page }) => {
  await start(page);
  await expect(page.locator('#stem-status')).toContainText('自動同期');
  for (const name of ['vocals', 'drums', 'bass', 'other']) await page.locator(`#stem-${name}-enabled`).click();
  await page.locator('#vol-music').fill('80');
  await expect(page.locator('#stem-status')).toContainText('全パートをミュート');
  await expect.poll(() => originalVolume(page)).toBe(0);
  await page.locator('#btn-play').click();
  await page.locator('#btn-play').click();
  await expect.poll(() => originalVolume(page)).toBe(0);
  expect(await page.evaluate(() => Object.values(window.__media.stems).every(media => media.paused && media.muted))).toBe(true);
});

test('パートと元音源の読み込み復帰時に同期し直す', async ({ page }) => {
  await start(page);
  await expect(page.locator('#stem-status')).toContainText('自動同期');
  for (const target of ['drums', 'original']) {
    await expect.poll(() => page.evaluate(() => Object.values(window.__media.stems).every(media => !media.seeking))).toBe(true);
    await page.evaluate(target => {
      const media = target === 'original' ? window.__media.original : window.__media.stems[target];
      window.__readyDescriptors ??= new Map();
      window.__readyDescriptors.set(media, Object.getOwnPropertyDescriptor(media, 'readyState'));
      Object.defineProperty(media, 'readyState', { configurable: true, get: () => 2 });
      media.dispatchEvent(new Event('waiting'));
    }, target);
    await expect(page.locator('#stem-status')).toContainText('読み込み待ち');
    expect(await page.evaluate(() => Object.values(window.__media.stems).every(media => media.paused && media.muted))).toBe(true);
    await page.evaluate(target => {
      const media = target === 'original' ? window.__media.original : window.__media.stems[target];
      const descriptor = window.__readyDescriptors.get(media);
      if (descriptor) Object.defineProperty(media, 'readyState', descriptor);
      else delete media.readyState;
      media.dispatchEvent(new Event(target === 'original' ? 'playing' : 'canplay'));
    }, target);
    await expect(page.locator('#stem-status')).toContainText('自動同期');
    await expect.poll(() => page.evaluate(() => Math.max(...Object.values(window.__media.stems).map(media => Math.abs(media.currentTime - window.__media.original.currentTime))))).toBeLessThan(0.15);
  }
});

test('再生せず曲を開くだけで最後に開いた日時を保存し、練習状態を表示しない', async ({ page }) => {
  const updates = [];
  await page.route('**/results/*/library', route => {
    updates.push(route.request().postDataJSON());
    return route.fulfill({ json: { tags: [], lastOpenedAt: '2026-09-08T12:00:00Z' } });
  });
  await page.goto('/');
  await expect.poll(() => updates.length).toBe(1);
  expect(updates[0]).toEqual({ opened: true });
  await expect(page.locator('#session-filter')).toHaveCount(0);
  await expect(page.locator('#session-sort')).toHaveValue('recent');
  await expect(page.locator('.si-meta')).not.toContainText('練習');
  expect(await page.evaluate(() => window.__media.original)).toBeNull();
  await page.locator('#session-sort').selectOption('title');
  await page.reload();
  await expect(page.locator('#session-sort')).toHaveValue('title');
});

test('画面描画が停止してもクリック音が続き、停止時には止まる', async ({ page }) => {
  await start(page);
  await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
  await page.locator('#btn-metro').click();
  await expect.poll(() => page.evaluate(() => window.__clickPeaks.length)).toBeGreaterThanOrEqual(3);
  await page.locator('#btn-play').click();
  await page.waitForTimeout(100);
  const count = await page.evaluate(() => window.__clickPeaks.length);
  await page.waitForTimeout(650);
  expect(await page.evaluate(() => window.__clickPeaks.length)).toBe(count);
});

for (const sectionLoop of [false, true]) {
test(`0.75倍速の${sectionLoop ? '区間' : '全曲'}ループで毎周クリック音が続く`, async ({ page }) => {
  const beats = [0.2, 0.6, 1, 1.4, 1.8];
  await page.route('**/results/e2e-baseline.json', route => route.fulfill({ json: {
    ...baselineResult, duration: 2, beats, assets: {},
    sections: [{ ...baselineResult.sections[0], start_time: 0.15, end_time: 1.9 }],
  } }));
  await page.route('**/audio/e2e-baseline.mp3', route => route.fulfill({ contentType: 'audio/wav', body: silentWav(2) }));
  await page.addInitScript(() => {
    window.__wraps = 0;
  });
  await page.goto('/');
  await expect(page.locator('#btn-play')).toBeEnabled();
  await page.locator('#playback-rate').fill('0.75');
  await page.locator('#btn-loop').click();
  if (sectionLoop) {
    await page.getByRole('button', { name: '曲構成', exact: true }).click();
    await page.locator('.sec-row').first().click();
  }
  await page.locator('#btn-metro').click();
  if (!sectionLoop) await page.locator('#btn-play').click();
  await page.evaluate(() => {
    let previous = 0;
    window.__media.original.addEventListener('timeupdate', () => {
      const current = window.__media.original.currentTime;
      if (current < previous - 0.5) window.__wraps++;
      previous = current;
    });
  });
  await expect.poll(() => page.evaluate(() => window.__wraps), { timeout: 22000 }).toBeGreaterThanOrEqual(5);
  await page.locator('#btn-play').click();
  const clicks = await page.evaluate(() => window.__clickPeaks);
  expect(clicks.length).toBeGreaterThanOrEqual(24);
  for (const click of clicks) {
    expect(Math.min(...beats.map(beat => Math.abs(beat - click.position)))).toBeLessThan(0.12);
  }
});

}

test('モバイルではパート操作まで追加音源を読み込まず、準備中のリセットで再生しない', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 900 });
  let loads = 0;
  await page.route('**/stems/e2e-baseline/*', async route => {
    loads++;
    await new Promise(resolve => setTimeout(resolve, 150));
    await route.fulfill({ contentType: 'audio/wav', body: silentWav(30) });
  });
  await page.goto('/');
  await expect(page.locator('#btn-play')).toBeEnabled();
  expect(loads).toBe(0);
  await page.locator('#btn-play').click();
  await page.locator('#stem-drums-enabled').click();
  await expect.poll(() => loads).toBeGreaterThan(0);
  await page.locator('#btn-reset-stem-mix').click();
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => Object.values(window.__media.stems).every(media => media.paused))).toBe(true);
  await expect.poll(() => originalVolume(page)).toBeGreaterThan(0);
});
