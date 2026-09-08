# Repository Instructions

- 不具合修正では [不具合修正の原則](docs/engineering-principles.md) を読み、従う。曲ごとのハードコードは禁止する。曲名・曲ID・固定時刻による例外や専用補正データで解析不具合を回避せず、音源と解析結果に基づく共通処理で修正する。原因未確認の推測による変更を入れない。

- Cloudflare/R2への配信、同期、UI・静的ビューア変更では、リポジトリ内の `$practice-lab-r2-sync` スキルを使用する。
- PracticeLabのバージョン変更、デスクトップリリース作成、GitHub Release公開、ローカルアプリ更新、自動更新の検証では、リポジトリ内の `$practice-lab-release` スキルを使用する。ローカルの動作確認用更新だけではバージョンを上げない。
- Cloudflare/R2への同期は、ユーザーが明示的に依頼した場合だけ実行する。UI変更、アプリ更新、パート音源の生成・再生成だけを理由に、自動で同期を追加しない。
- When Cloudflare/R2 publication is explicitly requested, follow the incremental sync skill and run:
  - `.venv\Scripts\python.exe scripts\export_static.py`
  - `.venv\Scripts\python.exe scripts\sync_r2.py`
- Treat `warning: R2 CORS was not updated: AccessDenied` as non-blocking when uploads complete; it means the token lacks CORS-write permission, not that asset upload failed.
- Do not commit generated runtime assets under `public/audio/`, `public/video/`, `public/results/`, `public/score/`, or `public/stems/`.
