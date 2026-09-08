---
name: practice-lab-release
description: Prepare and publish PracticeLab desktop releases, update the local Apple Silicon Mac for testing, or verify automatic updates. Distinguish release versioning from local builds, which preserve the existing version. Use for requested version changes, desktop releases, local app updates, or automatic update verification.
---

# PracticeLab デスクトップリリース

リリース作成やローカルアプリ更新は、ユーザーが明示的に依頼した範囲だけ実行する。タグのpush、GitHub Release公開、`/Applications`のアプリ入れ替えを依頼から推測して勝手に行わない。
同じ会話ですでに依頼・承認された範囲は引き継ぎ、改めて許可を求めない。

## 作業範囲とバージョン

- リリース作成・準備の依頼では、下記の「リリース準備」を適用する。公開は依頼された場合だけ行う。
- 「公開せずローカルで動作確認」「修正後にこのMacのアプリを更新」などの依頼では、「ローカルビルドでこのMacを更新」を適用し、既存のバージョンを維持する。ローカル更新の依頼はバージョン変更の依頼を含まない。
- 「次のパッチバージョンを原則とする」は、リリースに向けてバージョンを上げる際の番号の選び方であり、修正・ビルド・ローカル更新のたびに番号を上げる指示ではない。
- 「1.3.0としてリリース」のように番号が指定された場合は、その番号を使う。パッチ番号の原則より指定を優先し、CI失敗や再試行を理由に別の番号へ変更しない。
- 編集前に、依頼された作業、バージョンを維持するか指定値へ変更するか、公開・インストール・検証の対象を整理する。完了前の差分確認でも、ローカル更新だけの依頼にバージョン変更や新バージョンのリリースノートが混入していないことを確認する。

## リリース準備

1. `docs/desktop-release.md`、`.github/workflows/release-desktop.yml`、現在のタグ・Release・作業ツリーを確認する。
2. リリース用にバージョンを上げる場合は、次のパッチバージョンを原則とし、ユーザー指定があれば従う。`package.json`と`package-lock.json`のバージョン、`RELEASE_NOTES.md`の見出し・配布物名・変更点を揃える。
3. フロント生成物を更新し、少なくとも次を実行する。
   - `npm run build`
   - `npm run test:unit`
   - `.venv/bin/python -m pytest -q`（Windowsでは`.venv\Scripts\python.exe`）
   - `npm run test:e2e`
4. 修正内容の再発を直接検出するテストが妥当なら追加する。既存テストの成功だけで今回の不具合を検証済みとは扱わない。
5. `git diff --check`と`git status --short`を確認する。`public/audio/`、`public/video/`、`public/results/`、`public/score/`、`public/stems/`の生成データをコミットしない。

UI・静的ビューア変更を含む場合は、`practice-lab-r2-sync`スキルも使用する。R2同期は明示的に依頼された場合だけ実行する。依頼された同期を実行できない場合は、全件同期へ切り替えず、未実施であることを最終報告する。

## 公開

1. リリース変更をコミットして`main`へpushする。
2. `docs/macos-notarization.md`に従いMac版の署名・公証を済ませ、検証済みDMG、自動更新用ZIP、`latest-mac.yml`、DMGのSHA-256台帳を対象バージョンのdraft Releaseへ用意する。タグのCIはこれらを入力として必要とする。転送に使った一時Secretは処理後に削除する。
3. 配布物の元になったコミットへ`vX.Y.Z`の注釈付きタグを作成してpushする。既存タグを上書きしない。
4. タグで起動した`release-desktop.yml`の正確なrunを監視する。Windows、Apple Silicon Mac、`release-metadata`の全jobが成功するまで完了扱いにしない。
5. ワークフローは両OSの成果物検証後、Releaseを非draftかつlatestとして公開する。途中のArtifactを正式Releaseとして代用しない。
6. 公開Releaseに少なくとも次があり、バージョンが一致することを確認する。
   - `PracticeLab-Setup-X.Y.Z.exe`
   - `.exe.blockmap`
   - `latest.yml`
   - `PracticeLab-X.Y.Z-arm64.dmg`
   - `PracticeLab-X.Y.Z-arm64.zip`と`latest-mac.yml`

CI失敗時は失敗stepとログを確認する。一時的な実行環境の問題なら同じコミットの失敗jobを再実行できる。コードや配布物の修正が必要なら、再検証と再署名の必要性を確認し、既存タグの上書きや未指定のバージョン変更で解決しない。指定済みタグとの整合を保てない場合は、その事実と選択肢をユーザーへ伝える。壊れたReleaseを成功として報告しない。

## ローカルビルドでこのMacを更新

動作確認用のローカル更新が依頼された場合に適用する。公開DMGを使う必要はない。

1. `package.json`と`package-lock.json`のバージョンを維持し、ローカル更新だけを理由に`RELEASE_NOTES.md`へ新しいバージョンの見出しを追加しない。ビルドの識別にはコミットIDや成果物のSHA-256を使う。
2. フロント生成物と必要な同梱資源を更新し、リリース準備の手順3〜5のテスト・確認を実行する。
3. `npm run desktop:dist:mac -- --publish=never`でローカルDMGを作成する。タグ作成・push・GitHub Release公開・R2同期を追加しない。
4. 下記のMac更新手順2〜7に従う。バージョンは既存値との一致を確認し、同じバージョンでも修正が入ったことを同梱ファイルやハッシュで確認する。

## 公開DMGからこのMacを更新

ユーザーがローカル更新も依頼した場合だけ実行する。

1. GitHub Releaseに公開されたDMGを一時ディレクトリへダウンロードする。Actions Artifactやローカルビルドを代用しない。
2. ファイルサイズとSHA-256を記録し、`hdiutil attach -readonly -nobrowse`でDMGを検証・マウントする。
3. DMG内の`CFBundleShortVersionString`がリリースと一致すること、および`codesign --verify --deep --strict`が成功することを確認する。
4. 起動中のPracticeLabを正常終了させる。終了できない場合は既存アプリを入れ替えない。
5. 新しいアプリをステージング先へコピーして検証し、既存`/Applications/PracticeLab.app`を一時バックアップしてから置き換える。曲・解析結果・設定の保存先には触れない。
6. インストール後のバージョンと署名を再確認し、PracticeLabを起動する。アプリ本体と同梱バックエンドが動作していることを確認する。
7. 成功後、旧アプリとDMG一式は`trash`でゴミ箱へ移し、復元可能にする。マウントしたDMGは取り外す。

## 自動更新の検証

自動更新の確認が依頼された場合に実行する。配布ページを開けることや、手動でDMGを入れ替えられることは自動更新の成功ではない。

1. 更新元のバージョンと署名、`desktop/update-policy.cjs`の更新モードを確認する。Macのローカルビルドはアドホック署名のため自動更新対象外。検証には同じDeveloper ID名義の公開済み旧版を使う。
2. 普段のアプリの更新と検証用コピーでの確認を区別する。検証だけなら、公開済み旧版のコピーと専用の`--user-data-dir`で利用者データを分離できる。検証用コピーの成功を`/Applications`の更新済みと報告しない。
3. 公開された更新情報をアプリから取得し、新版の検出、ダウンロード、実際の「再起動して更新」操作による適用を確認する。その後、更新先のバージョン・署名・起動・バックエンドの応答とデータ保持を検証する。単に最新版を起動し直すだけでは更新経路の検証にならない。
4. 更新元と更新先、検証したOS・アプリの場所、各段階の結果を記録する。確認できていないOSや普段のアプリへの適用まで成功したと扱わない。画面ロックなどで必要な操作ができない場合も、独立して進められる準備・検証は続け、残った作業を明記する。

## 完了報告

実行した範囲に応じて、テスト結果とローカル更新・起動確認を簡潔に報告する。公開した場合はReleaseへのリンク、バージョン、CI三jobの結果を、R2同期を依頼された場合はその結果を含める。ローカル確認用の場合は公開していないことを明記する。旧アプリをゴミ箱へ移した場合は復元可能であることも伝える。
