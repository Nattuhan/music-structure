# macOSアプリの署名とApple公証

Mac配布版をDeveloper ID署名・Apple公証済みにする場合は、[MornNotary](https://github.com/matsufriends/MornNotary)へアプリを提出します。通常のローカルビルドは提出前のアドホック署名のままです。MornNotaryの証明書はコピーせず、同リポジトリのGitHub Actions内だけで利用します。成果物の署名名義は同サービスの運用者です。

アプリの公証、このMacへのインストール、GitHub Releaseの一般公開は別の操作です。一般公開とR2同期は、ユーザーが依頼した場合だけ行います。

## 提出前の確認

- `docs/desktop-release.md`とリリーススキルに従ってビルド・テストする。
- `codesign --verify --deep --strict PracticeLab.app`で提出元の整合性を確認する。
- 配布物に利用者の音源、設定、認証情報、処理履歴を含めない。
- `CFBundleShortVersionString`と提出名を一致させ、元ZIPのSHA-256を記録する。

## 大きいZIPの扱い

PracticeLabはGitHubの単一ファイル上限100 MiBを超えるため、MornNotaryの分割ZIP対応が必要です。共有mainを直接変更せず、提出用ブランチに変更とアプリをまとめます。

```bash
ditto -c -k --keepParent PracticeLab.app PracticeLab-full.zip
zip -s 80m PracticeLab-full.zip --out incoming/PracticeLab-1.2.2-arm64.zip
```

生成された`.z01`、`.z02`などと、最後の`.zip`をすべて提出します。分割ファイルごとのSHA-256台帳も添付し、runnerでは検証後に`zip -s 0`で単一ZIPへ戻してから展開します。提出前にローカルでも再結合・展開し、アプリの署名検証が通ることを確認します。

## PracticeLabに必要な署名設定

すべてのMach-Oを内側からDeveloper IDで署名し、Hardened Runtimeと安全なタイムスタンプを付けます。

- Electron本体とHelper実行ファイル: `com.apple.security.cs.allow-jit`。V8の実行に必要です。
- 同梱バックエンド: `com.apple.security.cs.disable-library-validation`。利用者データ領域の追加楽譜抽出パックを読み込むために必要です。
- それ以外のバイナリ: 上記の例外を一律に付けません。

最後に外側のアプリへ署名する際、内側の権限を保持します。`notarytool`の結果が`Accepted`となり、`stapler staple`と`stapler validate`が成功した成果物だけを使います。

## 受け取りと検証

Actionsの署名済みArtifactをダウンロードし、`ditto`で展開します。次のコマンドでDeveloper ID、Hardened Runtime、公証票、Gatekeeper、同梱ランタイムを検証します。

```bash
.venv/bin/python scripts/verify_notarized_macos.py /path/to/PracticeLab.app --version 1.2.2 --runtime
```

公証済みアプリをDMGに格納した場合も、同じ検証スクリプトにDMGを渡せます。DMG内のアプリに公証票があることを確認し、DMG自体の公証を済ませたという表現とは区別します。

公開版でこのMacの更新を依頼されている場合は、Release公開後にDeveloper ID署名済みの旧版からアプリ内更新を実行します。新版の検出、ダウンロード、「再起動して更新」、再起動後の版番号・署名・バックエンド・利用者データ保持まで確認します。通常の公開版更新でDMGを手動取得して`/Applications`を入れ替えません。

ローカルビルドの動作確認では、従来どおり既存アプリを終了し、検証済みのローカルアプリをステージング先へコピーしてから入れ替えます。未署名またはアドホック署名の版から署名済み公開版へ初めて移る場合も、自動更新とは別の初回導入として扱います。

## GitHub Releaseへの一般公開

タグをpushする前に、検証済みDMG、公証済みアプリを含む`PracticeLab-X.Y.Z-arm64.zip`、`latest-mac.yml`を同じバージョンのdraft Releaseへ置きます。更新用ZIPはMornNotaryから受け取ったZIPを改名して利用でき、署名後の実ファイルから更新情報を生成します。

```bash
node scripts/macos_update_metadata.cjs write PracticeLab-1.2.2-arm64.zip 1.2.2 latest-mac.yml
node scripts/macos_update_metadata.cjs verify PracticeLab-1.2.2-arm64.zip 1.2.2 latest-mac.yml
.venv/bin/python scripts/verify_notarized_macos.py PracticeLab-1.2.2-arm64.zip --version 1.2.2 --runtime
```

CIはZIPの署名・公証と更新情報のハッシュ・サイズも検証します。アプリはDeveloper ID署名を確認したMac配布版で自動更新を有効にします。今後も同じ署名名義で公開してください。未署名版は手動更新を維持します。

`PracticeLab-Notarized-Mac-X.Y.Z.sha256`にはDMGのSHA-256だけを1行で保存して添付します。

タグのCIはWindows版と追加機能をビルドし、Mac側ではdraftから受け取ったDMGのハッシュ、公証、実行環境を再検証します。公証済みの入力がない場合は失敗し、ローカルビルド用のアドホック署名DMGを代わりに公開しません。Windows、Mac、公開処理のすべてが成功してから公開完了とします。

参考: [Electronの公証要件](https://github.com/electron/notarize)、[Appleの公証手順](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution)。

## GitHub側で配布物を準備する場合

ローカル回線で大きい配布物を再送したくない場合は、`stage-notarized-mac.yml`を使用できます。成功したMornNotary runのArtifactに対する短時間だけ有効なダウンロードURLを、`MORNNOTARY_ARTIFACT_URL`という一時的なActions Secretに保存し、署名済みバージョンを指定して実行します。URLは対象アプリのArtifactだけを取得できるもので、アカウントのトークンや署名用の秘密鍵は渡しません。実行が終わったら一時Secretを削除します。

この処理は署名・公証・起動を再検証し、DMGと更新情報を作って既存draftへ添付するだけです。一般公開は通常のタグ付きリリースワークフローで行います。
