import test from 'node:test';
import assert from 'node:assert/strict';
import { alignedWav, clickWave } from '../src/aligned-click.js';

const source = (length = 24000, sampleRate = 8000, stereo = true) => {
  const left = Float32Array.from({ length }, (_, i) => Math.sin(i * 0.03) * 0.4);
  const right = Float32Array.from(left, x => -x);
  return { length, sampleRate, numberOfChannels: stereo ? 2 : 1, getChannelData: n => n ? right : left };
};
for (const sampleRate of [8000, 44100, 48000]) {
  test(`${sampleRate}Hzでステレオを変更せずクリックを別チャンネルへ保持する`, async () => {
    const buffer = source(sampleRate * 2, sampleRate);
    const beats = [0.1, 0.99, 1.5];
    const blob = await alignedWav(buffer, beats, { yieldTask: async () => {} });
    const bytes = await blob.arrayBuffer(), header = new DataView(bytes);
    assert.equal(header.getUint16(20, true), 3);
    assert.equal(header.getUint16(22, true), 3);
    assert.equal(header.getUint32(24, true), sampleRate);
    const samples = new Float32Array(bytes, 44), click = clickWave(sampleRate);
    for (let i = 0; i < buffer.length; i++) {
      assert.equal(samples[i * 3], buffer.getChannelData(0)[i]);
      assert.equal(samples[i * 3 + 1], buffer.getChannelData(1)[i]);
      const beat = beats.find(t => i >= Math.round(t * sampleRate) && i < Math.round(t * sampleRate) + click.length);
      assert.equal(samples[i * 3 + 2], beat === undefined ? 0 : click[i - Math.round(beat * sampleRate)]);
    }
  });
}
test('モノラル、重複拍、不正な拍、末尾、キャンセルを扱う', async () => {
  const buffer = source(16000, 8000, false);
  const blob = await alignedWav(buffer, [NaN, -1, Infinity, 0, 0, 1.99, 3]);
  const samples = new Float32Array(await blob.arrayBuffer(), 44);
  assert.equal(samples[0], samples[1]);
  assert.equal(samples[2], clickWave(8000)[0]);
  const controller = new AbortController();
  await assert.rejects(alignedWav(buffer, [1], { signal: controller.signal, yieldTask: async () => controller.abort() }), { name: 'AbortError' });
});
