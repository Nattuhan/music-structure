# PracticeLab v1.2.1

全画面での練習操作と、処理一覧の取り回しを改善したメンテナンスリリースです。

## ダウンロード

- **Windows 10/11**: `PracticeLab-Setup-1.2.1.exe`
- **macOS（Apple Silicon）**: `PracticeLab-1.2.1-arm64.dmg`

Windows CPU解析、Mac解析、楽譜抽出は、アプリの「設定 → 追加機能」から必要な場合だけ追加できます。追加パックをReleaseページから手動で展開する必要はありません。

## v1.2.1の変更

### 全画面での練習

- PCの動画をダブルクリックすると、練習画面全体を全画面表示するように変更
- 通常画面と全画面の操作列を「再生・音量・BPM／速度」の1行へ整理
- BPM操作を「半分・2倍・元に戻す・保存・裏拍」の明確な表記へ変更
- 波形へ時刻とループ情報を統合し、不要な小節数の独立表示を削除
- タッチ端末では従来どおり、動画のダブルタップで前後へ移動
- Escキーで全画面表示を終了

### 処理一覧

- 右下の処理一覧を「−」で小さな件数バッジへ最小化可能
- 上向き矢印で一覧を再表示
- 最小化しても処理を継続し、処理履歴や結果を保持
- 最小化状態を次回起動時にも復元

## 配布される追加パック

- `PracticeLab-Windows-CPU-1.2.1.zip`
- `PracticeLab-Analysis-macOS-arm64-1.2.1.zip`
- `PracticeLab-Score-Windows-1.2.1.zip`
- `PracticeLab-Score-macOS-arm64-1.2.1.zip`
- `PracticeLab-SHA256SUMS.txt`

追加パックはアプリがSHA-256を検証してから展開します。

## 未署名版について

このリリースは費用のかかるWindowsコード署名証明書とApple Developer IDを使用していません。WindowsではSmartScreen、MacではGatekeeperの確認が表示される場合があります。詳しい起動方法はリポジトリの`UNSIGNED_DISTRIBUTION.md`を参照してください。
