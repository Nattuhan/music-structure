# Repository Instructions

- Cloudflare/R2への配信、同期、UI・静的ビューア変更では、リポジトリ内の `$practice-lab-r2-sync` スキルを使用する。
- PracticeLabのデスクトップリリース作成、GitHub Release公開、公開DMGからのMac更新では、リポジトリ内の `$practice-lab-release` スキルを使用する。
- Cloudflare/R2への同期は、ユーザーが明示的に依頼した場合だけ実行する。UI変更、アプリ更新、パート音源の生成・再生成だけを理由に、自動で同期を追加しない。
- When Cloudflare/R2 publication is explicitly requested, follow the incremental sync skill and run:
  - `.venv\Scripts\python.exe scripts\export_static.py`
  - `.venv\Scripts\python.exe scripts\sync_r2.py`
- Treat `warning: R2 CORS was not updated: AccessDenied` as non-blocking when uploads complete; it means the token lacks CORS-write permission, not that asset upload failed.
- Do not commit generated runtime assets under `public/audio/`, `public/video/`, `public/results/`, `public/score/`, or `public/stems/`.
