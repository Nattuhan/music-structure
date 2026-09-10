# PracticeLab 開発者ガイド

この文書は、ソースからの起動、テスト、内部構成、配布を行う開発者向けです。通常利用は[README](../README.md)と[利用者ガイド](user-guide.md)を参照してください。

不具合の調査・実装では、[不具合修正の原則](engineering-principles.md)に従ってください。曲専用の例外や固定値で症状を回避せず、原因に基づく共通処理で修正します。

## サポート環境

| 環境 | 解析方式 |
|---|---|
| Windows 10/11 + NVIDIA | WSL2経由のCUDA |
| Windows 10/11、NVIDIAなし | WindowsネイティブCPU |
| Apple Silicon Mac | ネイティブCPU。対応処理ではMPS |

WindowsはPython 3.10、MacはPython 3.11を使用します。Node.jsとFFmpegも必要です。

## リポジトリ構成

- `frontend/src/`: ブラウザUIのソース。`stem-transport.js`がパート再生状態、`metronome.js`がクリック予約を管理
- `public/`: 配布するHTML、生成済みJavaScript、CSS
- `practice_lab/`: FastAPIバックエンドとアプリケーション処理
- `desktop/`: Electronデスクトップアプリ
- `scripts/`: セットアップ、ビルド、静的書き出し、同期
- `requirements/`: 実行・解析・ビルド・テスト依存
- `tests/`: Python、Node、画面テスト
- `data/`: 端末内の正本データと作業領域。Git管理外

生成された音声・動画・解析結果・楽譜・stemsはGitへコミットしません。

## セットアップ

Windowsではリポジトリ直下の`setup.bat`を実行します。NVIDIAを使用する場合は、アプリ内のNVIDIAセットアップからWSL2解析環境を準備します。

Apple Silicon Macでは`Setup PracticeLab.command`を実行します。詳細は[portable-setup.md](portable-setup.md)を参照してください。

## ソースから起動

Windows:

```powershell
.\start.bat
```

Mac:

```bash
bash scripts/start_macos.sh
```

手動起動:

```bash
python -m uvicorn main:app --reload
```

## フロントエンドのビルドとテスト

```bash
npm ci
npm run build
npm run test:unit
npx playwright install chromium
npm run test:e2e
python -m pytest -q
```

`frontend/src/app.js`から`public/app.js`を生成します。外部CDNには依存しません。配布前には、バンドル済みバックエンドの解析依存関係も検証します。

## データとジョブ

- 正本の解析結果: `data/results/`
- 解析用音声: `data/audio/`
- 作業ファイル: `data/work/`
- 処理履歴: `data/jobs.json`
- 静的出力: `public/results/`、`public/audio/`、`public/video/`、`public/score/`、`public/stems/`

ジョブ履歴は最大200件を保存します。実行中ジョブは再起動時に中断状態へ変更し、利用者が明示的に再開した場合だけ再投入します。中断ジョブのキャンセルは`DELETE /jobs/{job_id}/cancel-interrupted`で永続化し、`canceled=true`、`resumable=false`として再開用specを破棄します。履歴にはキャンセルとして残りますが、以後の復元対象にはなりません。処理履歴はローカルAPIの`/jobs/history`で提供し、結果本体と再開用specは一覧レスポンスから除外します。

解析ジョブは取得した曲名を`display_title`へ保存し、UIへ内部の動画IDを表示しません。all-in-one-fixの単曲推論は途中の進捗率を返さないため、UIでは30秒ごとの経過時間を表示します。無出力タイムアウトは使わず、解析全体の上限を30分としています。環境変数`ANALYZER_TIMEOUT_SECONDS`で全体上限を変更でき、`ANALYZER_NO_OUTPUT_TIMEOUT_SECONDS`は互換性のため残していますが既定値は無効です。

## 再生同期と診断

クリックに使う拍列は、音源と前後の拍から誤検知の根拠を確認できた区間を共通処理で補正します。本当のテンポ変化を一律に一定拍へ置き換えません。通常再生中のステムへ周期的な強制シークや個別の速度補正は行いません。再生開始、明示的なシーク、ループ境界の変更時と読み込み待ちからの復帰時に全ステムを基準音声の同じ時刻へそろえます。自分で行う同期シークの`waiting`は、読み込み停止として再処理しません。クリックは音源と同じデコーダー内のマーカーチャンネルから固定長で生成し、音色と標準音の音程は出力直前の波形だけを切り替えます。選択変更のために拍時刻や同期経路を作り直しません。表示上の音量は従来の0〜100%を維持し、クリック波形の基準音量を1.2倍にします。スクラブ中は動画の位置だけを更新し、確定時に音声とステムを再開します。

Electronメインプロセスは再生イベントをApplication Support配下の`logs/playback.ndjson`へ保存します。記録対象は許可したイベント名と数値フィールドだけで、音声データ、URL、曲名、認証情報は含めません。ファイルは所有者だけが読める権限で作成し、2 MBを超えると1世代だけローテーションします。静的書き出しとR2同期の対象外です。

パートは選択した全音源の再生成功を確認してから元音源と切り替えます。一部でも失敗した場合は元音源へ戻し、失敗パートと再試行操作を表示します。全パート0%は元音源への切り替え条件にせず、意図的な無音として扱います。非同期の再生結果には世代を持たせ、停止・曲切替後の古い結果を無視します。重複する再生通知も準備中の再生を中断しません。元音源・パート・クリックは共通のAudioContextへ出力します。パートの開始・復帰時には基準音源を短く保持し、全パートのシーク完了を待って再開することで、デコード待ち時間が恒常的なずれになるのを防ぎます。

ライブラリの`PATCH /results/{id}/library`は`opened: true`で`lastOpenedAt`を更新します。再生開始時の練習回数記録は廃止しました。静的閲覧版では閲覧日時を端末内だけに保存します。

## デスクトップ版とR2静的閲覧版の境界

同じ`public/` UIを使用しますが、実行モードで機能を分離します。

- デスクトップ・ローカル版: FastAPIが存在し、解析、編集、履歴、設定、同期APIを使用可能
- R2静的閲覧版: `window.PRACTICE_LAB_CONFIG.mode = "static"`で動作し、解析済みアセットの読み取りだけを許可

静的モードでは解析、再解析、楽譜抽出、処理履歴、設定、削除操作を表示しません。`jobs.json`、ログ、設定、認証情報は静的書き出しとR2同期の対象外です。

詳細は[static-library.md](static-library.md)を参照してください。

## 静的書き出しとR2同期

静的閲覧版を更新する場合だけ実行します。

```bash
python scripts/export_static.py
python scripts/sync_r2.py
```

同期はSHA-256台帳による差分方式です。未変更の音声・動画を再送しません。デスクトップ専用機能だけの変更では、R2への公開は不要です。

R2の設定と端末間同期は[cloudflare-r2.md](cloudflare-r2.md)を参照してください。

## デスクトップアプリのビルド

Windows:

```powershell
npm run build
npm run desktop:prepare
npm run desktop:backend
npm run desktop:dist -- --publish=never
```

Apple Silicon Mac:

```bash
npm run build
npm run desktop:prepare:mac
npm run desktop:backend:mac
npm run desktop:dist:mac -- --publish=never
```

正式配布の流れ、署名、自動更新は[desktop-release.md](desktop-release.md)を参照してください。

## 関連ドキュメント

- [デスクトップリリース](desktop-release.md)
- [R2同期](cloudflare-r2.md)
- [静的閲覧版](static-library.md)
- [別PCへのセットアップ](portable-setup.md)
- [補助スクリプト](../scripts/README.md)
