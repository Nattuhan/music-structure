# デスクトップ版のリリース

## 配布物

Windows版はElectronの専用ウィンドウ、PyInstallerで固めたFastAPIバックエンド、
FFmpegをNSISインストーラーへまとめます。Electron自身をYouTube取得処理のNode.jsとしても
利用するため、Node.jsを重複して同梱しません。音源解析とstems分離は初期状態でCPUを選び、
設定の「追加機能」からCPU解析パックを追加します。NVIDIA GPUを使いたい人だけ、解析環境を
NVIDIAへ切り替えてWSL2 CUDAランタイムをセットアップします。

Apple Silicon Mac版は同じUIと軽量FastAPIバックエンドを同梱し、PyTorch、NATTEN、
all-in-one-fix、Demucsを含む解析環境は設定の「追加機能」から必要時に導入します。Intel Macは対象外です。
ローカルビルドには提出前のアドホック署名を施します。一般公開するMacアプリは、
[MornNotaryを使った署名・公証手順](macos-notarization.md)を経由し、検証済みDMGをdraft Releaseへ用意してからタグをpushします。

アプリ本体と利用者データは分離されています。

- アプリ本体: NSISが管理するインストールディレクトリ
- 曲、解析結果、設定: `%LOCALAPPDATA%\PracticeLab`
- Windows CPU解析環境: `%LOCALAPPDATA%\PracticeLab\runtime\windows-cpu`
- Mac解析環境: `~/Library/Application Support/practice-lab/runtime/mac-analysis`
- CUDA解析環境: `%LOCALAPPDATA%\PracticeLab\runtime\wsl\.venv`
- 楽譜抽出環境: 利用者データ内の`runtime/score`

そのため、アプリを更新しても曲、解析結果、CUDA環境は保持されます。

## ローカルビルド

Windowsのリポジトリ直下で実行します。

```powershell
npm install
npm run build
npm run desktop:prepare
npm run desktop:backend
npm run desktop:dist -- --publish=never
```

生成物は`desktop/dist/installer/`に作成されます。`desktop/bin/`、`desktop/build/`、
`desktop/dist/`はGit管理しません。

## GitHub Releases

`.github/workflows/release-desktop.yml`は手動実行時に未公開インストーラーをArtifactとして作成します。
`v1.2.3`形式のタグをpushすると、タグ番号をアプリのバージョンへ設定し、GitHub Releaseへ次を公開します。

- `PracticeLab-Setup-1.2.3.exe`
- `latest.yml`
- Windows差分更新用の`.exe.blockmap`
- `PracticeLab-1.2.3-arm64.dmg`
- `PracticeLab-1.2.3-arm64.zip`と`latest-mac.yml`（署名済みMac版の自動更新用）
- `PracticeLab-Windows-CPU-1.2.3.zip`（アプリから必要時に取得）
- `PracticeLab-Score-Windows-1.2.3.zip`（アプリから必要時に取得）
- `PracticeLab-Score-macOS-arm64-1.2.3.zip`（アプリから必要時に取得）
- `PracticeLab-Analysis-macOS-arm64-1.2.3.zip`（アプリから必要時に取得）
- `PracticeLab-SHA256SUMS.txt`

Windows版は起動後にGitHub Releasesを確認し、新版を取得します。ダウンロード完了後、
画面上の更新ボタンから再起動して適用できます。Developer ID署名済みMac版も同じ手順を標準とし、
公開後の通常更新でDMGを手動ダウンロードして入れ替えません。未署名またはアドホック署名の版から
署名済み公開版へ初めて移る場合だけ、別途DMGで導入します。動作確認用のローカルビルドは、
従来どおりローカルDMGで`/Applications`のアプリを入れ替えます。
Mac更新用ZIPは署名・公証後にハッシュを計算します。署名前の差分情報は使わず、ZIP全体を取得します。

## 署名と公開の方針

Windows版は従来どおり未署名です。Mac版はv1.2.2からMornNotary経由のDeveloper ID署名・Apple公証を使用します。証明書とAppleの認証情報はMornNotary側のSecretsに保持し、PracticeLabのリポジトリへ複製しません。

タグのMac jobはdraft Releaseから公証済みDMGとSHA-256を取得し、Gatekeeperとランタイムの検証を通してから配布Artifactへ格納します。未公証ビルドへのフォールバックはありません。全job成功後、公開処理がWindows版、追加パック、検証済みMac版を一般公開します。

詳細は[署名・公証手順](macos-notarization.md)、利用者向けには[インストール案内](../UNSIGNED_DISTRIBUTION.md)を参照してください。

## Windowsの解析環境

初期値はCPUです。設定の「追加機能」からCPU解析機能を追加すれば、NVIDIA、WSL2、CUDAを
導入しなくても解析できます。GPUで高速化したい場合だけ「解析環境」でNVIDIAを選択します。

### NVIDIA初回セットアップ

アプリ内診断は次をすべて満たした場合のみ準備完了とします。

1. WindowsからNVIDIA GPUを認識できる
2. WSL2とUbuntuを起動できる
3. WSL2から`nvidia-smi`を実行できる
4. WSL側のPythonでPyTorch CUDA、NATTEN、all-in-one-fix、demucsを読み込める

不足時は`setup_desktop_nvidia.ps1`を別ウィンドウで実行します。WSL2自体がない場合だけ
Windowsの管理者確認が表示され、再起動後にセットアップをもう一度実行します。
