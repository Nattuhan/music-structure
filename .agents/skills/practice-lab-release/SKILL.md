---
name: practice-lab-release
description: Prepare and publish PracticeLab desktop releases, or update the local Apple Silicon Mac for testing. Distinguish release versioning from local builds, which preserve the existing version. Use for requested version changes, desktop releases, or local app updates.
---

# PracticeLab デスクトップリリース

リリース作成やローカルアプリ更新は、ユーザーが明示的に依頼した範囲だけ実行する。タグのpush、GitHub Release公開、`/Applications`のアプリ入れ替えを依頼から推測して勝手に行わない。

## 作業範囲とバージョン

- リリース作成・準備の依頼では、下記の「リリース準備」を適用する。公開は依頼された場合だけ行う。
- 「公開せずローカルで動作確認」「修正後にこのMacのアプリを更新」などの依頼では、「ローカルビルドでこのMacを更新」を適用し、既存のバージョンを維持する。ローカル更新の依頼はバージョン変更の依頼を含まない。
- 「次のパッチバージョンを原則とする」は、リリースに向けてバージョンを上げる際の番号の選び方であり、修正・ビルド・ローカル更新のたびに番号を上げる指示ではない。

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
2. `vX.Y.Z`の注釈付きタグを同じコミットへ作成してpushする。既存タグを上書きしない。
3. タグで起動した`release-desktop.yml`の正確なrunを監視する。Windows、Apple Silicon Mac、`release-metadata`の全jobが成功するまで完了扱いにしない。
4. ワークフローは両OSの成果物検証後、Releaseを非draftかつlatestとして公開する。途中のArtifactを正式Releaseとして代用しない。
5. 公開Releaseに少なくとも次があり、バージョンが一致することを確認する。
   - `PracticeLab-Setup-X.Y.Z.exe`
   - `.exe.blockmap`
   - `latest.yml`
   - `PracticeLab-X.Y.Z-arm64.dmg`

CI失敗時は失敗stepとログを確認し、原因を修正して新しい適切なコミット・タグでやり直す。壊れたReleaseを成功として報告しない。

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

## 完了報告

実行した範囲に応じて、テスト結果とローカル更新・起動確認を簡潔に報告する。公開した場合はReleaseへのリンク、バージョン、CI三jobの結果を、R2同期を依頼された場合はその結果を含める。ローカル確認用の場合は公開していないことを明記する。旧アプリをゴミ箱へ移した場合は復元可能であることも伝える。
