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
    window.Audio = function (...args) {
      const media = new NativeAudio(...args);
      const name = String(args[0]).match(/\/stems\/[^/]+\/(\w+)\.(?:wav|mp3)/)?.[1];
      if (name) window.__media.stems[name] = media;
      return media;
    };
    window.Audio.prototype = NativeAudio.prototype;
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      if (this.tagName === 'AUDIO' && !this.src.includes('/stems/')) window.__media.original = this;
      const name = this.src.match(/\/stems\/[^/]+\/(\w+)\.(?:wav|mp3)/)?.[1];
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
    await page.addInitScript(names => { window.__media.reject = names; }, rejected);
    await start(page);
    await expect(page.locator('#stem-status')).toContainText('再生できません');
    await expect.poll(() => originalVolume(page)).toBeGreaterThan(0);
    expect(await page.evaluate(() => Object.values(window.__media.stems).every(media => media.muted && media.paused))).toBe(true);
    await page.evaluate(() => { window.__media.reject = []; });
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
      Object.defineProperty(media, 'readyState', { configurable: true, get: () => 2 });
      media.dispatchEvent(new Event('waiting'));
    }, target);
    await expect(page.locator('#stem-status')).toContainText('読み込み待ち');
    expect(await page.evaluate(() => Object.values(window.__media.stems).every(media => media.paused && media.muted))).toBe(true);
    await page.evaluate(target => {
      const media = target === 'original' ? window.__media.original : window.__media.stems[target];
      delete media.readyState;
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

test('画面描画が停止してもクリック予約が続き、停止時には解除する', async ({ page }) => {
  await start(page);
  await page.evaluate(() => {
    window.__clicks = [];
    const start = OscillatorNode.prototype.start;
    OscillatorNode.prototype.start = function (time) {
      window.__clicks.push(time);
      return start.call(this, time);
    };
    // Hidden windows can stop rendering entirely; audio must not depend on it.
    window.requestAnimationFrame = () => 0;
  });
  await page.locator('#btn-metro').click();
  await expect.poll(() => page.evaluate(() => window.__clicks.length)).toBeGreaterThanOrEqual(3);
  await page.locator('#btn-play').click();
  const count = await page.evaluate(() => window.__clicks.length);
  await page.waitForTimeout(650);
  expect(await page.evaluate(() => window.__clicks.length)).toBe(count);
});
