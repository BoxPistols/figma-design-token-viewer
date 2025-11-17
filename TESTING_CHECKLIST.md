# Figma API接続テストチェックリスト

このチェックリストは、Figma Desktop App内で実際のAPI接続を検証するためのものです。

## 📋 事前準備

- [ ] Figma Desktop Appがインストールされている
- [ ] プラグインがビルドされている（`npm run build`）
- [ ] `manifest.json`からプラグインがインポートされている

## 🎨 1. Color Token テスト（Paint Styles API）

### API使用箇所
- `figma.createPaintStyle()` (code.ts:149)
- `figma.getLocalPaintStyles()` (code.ts:145)

### テスト手順
1. [ ] `example-tokens.json`をインポート
2. [ ] Figmaの左パネルで「Local styles」を開く
3. [ ] 以下のPaint Stylesが作成されているか確認：
   - `colors/brand/primary` (#3B82F6)
   - `colors/brand/secondary` (#8B5CF6)
   - `colors/semantic/success` (#10B981)
4. [ ] 長方形を作成し、トークンをクリックして適用
5. [ ] Fill colorが正しく適用されるか確認

### 期待される結果
- ✅ Paint Stylesが正しく作成される
- ✅ HEX値がRGBに正しく変換される（r/255, g/255, b/255）
- ✅ 既存スタイルの再インポートで更新される（重複作成されない）

### エラーケース
- [ ] 無効なHEX値（例: "#GGGGGG"）で警告が表示される
- [ ] console.warnメッセージが出力される

---

## 📝 2. Typography Token テスト（Text Styles API）

### API使用箇所
- `figma.createTextStyle()` (code.ts:181)
- `figma.getLocalTextStyles()` (code.ts:177)
- `figma.loadFontAsync()` (code.ts:255)

### テスト手順
1. [ ] テキストレイヤーを作成
2. [ ] Typographyトークンをインポート
3. [ ] 左パネルで「Local text styles」を開く
4. [ ] 以下のText Stylesが作成されているか確認：
   - `typography/heading/h1` (Inter Bold 32px)
   - `typography/body/regular` (Inter Regular 16px)
5. [ ] トークンをクリックして適用
6. [ ] フォントファミリー、サイズ、ウェイトが正しく設定されるか確認

### フォント読み込みテスト
- [ ] 存在するフォント（Inter）が正しく読み込まれる
- [ ] 複数のウェイト名（Bold, SemiBold, Medium）が試行される (code.ts:228-250)
- [ ] 存在しないフォントの場合、Interにフォールバックする (code.ts:195-197)

### 期待される結果
- ✅ Text Stylesが正しく作成される
- ✅ lineHeight、letterSpacingが正しく適用される（PIXELS/PERCENT unit）
- ✅ fontWeightマッピングが機能する（400→Regular, 700→Bold）

### エラーケース
- [ ] fontFamilyまたはfontSizeが欠けている場合、警告が表示される
- [ ] 存在しないフォントでフォールバックが動作する

---

## 📏 3. Spacing/Size/BorderRadius Token テスト（Variables API）

### API使用箇所
- `figma.variables.createVariable()` (code.ts:289)
- `figma.variables.getLocalVariableCollections()` (code.ts:308)
- `figma.variables.createVariableCollection()` (code.ts:312)

### テスト手順
1. [ ] Spacing/Size/BorderRadiusトークンをインポート
2. [ ] 左パネルで「Local variables」を開く
3. [ ] 「Design Tokens」コレクションが作成されているか確認
4. [ ] 以下の変数が作成されているか確認：
   - `spacing/medium` (16)
   - `sizes/icon/medium` (24)
   - `borderRadius/medium` (8)

### 変数の適用テスト
**Spacing:**
- [ ] Auto Layoutフレームを作成
- [ ] Spacingトークンをクリック
- [ ] paddingLeft, paddingRight, paddingTop, paddingBottomが設定される (code.ts:443-447)

**Size:**
- [ ] 長方形を作成
- [ ] Sizeトークンをクリック
- [ ] Width/Heightが設定される (code.ts:451-453)

**BorderRadius:**
- [ ] 長方形を作成
- [ ] BorderRadiusトークンをクリック
- [ ] cornerRadiusが設定される (code.ts:484-486)

### キャッシング検証
- [ ] 複数のトークンをインポート
- [ ] `designTokenCollection`キャッシュが機能している (code.ts:3-4, 304-306)
- [ ] 既存変数の再インポートで更新される（重複作成されない） (code.ts:277-287)

### 期待される結果
- ✅ Variable Collectionが作成される
- ✅ 変数がFLOAT型で作成される
- ✅ descriptionフィールドにtoken typeが設定される
- ✅ 既存変数が正しく更新される

### エラーケース
- [ ] 無効な数値（NaN）で警告が表示される (code.ts:271-273)
- [ ] 負の数で警告が表示される

---

## 🌫️ 4. Opacity Token テスト（Direct Property Access）

### API使用箇所
- Direct property access: `node.opacity` (code.ts:468)

### テスト手順
1. [ ] 任意のレイヤーを作成
2. [ ] Opacityトークンをインポート
3. [ ] レイヤーを選択してOpacityトークンをクリック
4. [ ] レイヤーのopacityプロパティが変更されるか確認

### 検証ポイント
- [ ] opacity値が0-1の範囲で適用される
- [ ] 範囲外の値（-0.5, 1.5）でエラーが表示される (code.ts:460-463)
- [ ] EffectStyleは作成されない（意図的） (code.ts:295-300)

### 期待される結果
- ✅ 直接opacityプロパティに適用される
- ✅ 0-1の範囲外でエラーメッセージが表示される

---

## 📦 5. バッチ処理とパフォーマンステスト

### API使用箇所
- `Promise.allSettled()` (code.ts:43, 85)

### テスト手順
1. [ ] 大量のトークン（50+）をインポート
2. [ ] 通知メッセージで進捗が表示されるか確認
3. [ ] 「Importing X tokens...」が表示される (code.ts:39)
4. [ ] 「Successfully imported X tokens」または「X errors」が表示される (code.ts:66-72)

### 並列処理検証
- [ ] 複数トークンが同時に処理される（順次処理より速い）
- [ ] 一部のトークンでエラーが発生しても他のトークンが処理される
- [ ] エラーカウントが正確に集計される (code.ts:54-63)

### 期待される結果
- ✅ 進捗通知が表示される
- ✅ 結果サマリーが表示される（成功数、エラー数）
- ✅ 並列処理でパフォーマンスが向上する

---

## 🔄 6. localStorage統合テスト

### テスト手順
1. [ ] プラグインを開く
2. [ ] デフォルトトークンが表示される
3. [ ] 新しいJSONファイルをインポート
4. [ ] プラグインを閉じる
5. [ ] プラグインを再度開く
6. [ ] 前回インポートしたトークンが復元される

### リセット機能テスト
- [ ] 「Reset to Default」ボタンをクリック
- [ ] 確認ダイアログが表示される
- [ ] 「Reset」をクリック
- [ ] デフォルトトークンに戻る

### 期待される結果
- ✅ localStorageに自動保存される
- ✅ プラグイン再起動時に復元される
- ✅ リセット機能が動作する

---

## 🐛 7. エラーハンドリングテスト

### テスト手順

**無効なJSON:**
- [ ] 壊れたJSONファイルをインポート
- [ ] エラーメッセージが表示される

**レイヤー未選択:**
- [ ] レイヤーを選択せずにトークンをクリック
- [ ] 「Please select at least one layer」が表示される (code.ts:322)

**互換性のないレイヤー:**
- [ ] テキスト以外のレイヤーにTypographyトークンを適用
- [ ] 適切にスキップされる

### 期待される結果
- ✅ すべてのエラーが適切にハンドリングされる
- ✅ ユーザーフレンドリーなエラーメッセージが表示される
- ✅ コンソールに詳細なエラーログが出力される

---

## 📊 テスト結果サマリー

### テスト実施日: __________

| カテゴリ | テスト項目数 | 成功 | 失敗 | 備考 |
|---------|------------|------|------|------|
| Color Tokens | | | | |
| Typography Tokens | | | | |
| Variables (Spacing/Size/BorderRadius) | | | | |
| Opacity Tokens | | | | |
| Batch Processing | | | | |
| localStorage | | | | |
| Error Handling | | | | |

### 検出された問題

1.
2.
3.

### 総合評価

- [ ] すべてのAPI接続が正常に動作
- [ ] 一部の機能で問題あり（詳細は上記に記載）
- [ ] 重大な問題あり、修正が必要

---

## 🔍 デバッグ方法

### 開発者コンソールを開く
- Mac: `Command + Option + I`
- Windows: `Ctrl + Shift + I`

### 確認すべきログ
- `console.log` - 処理の進捗
- `console.warn` - 警告（無効な値など）
- `console.error` - エラー詳細

### Figma APIドキュメント
- [Plugin API Overview](https://www.figma.com/plugin-docs/)
- [Variables API](https://www.figma.com/plugin-docs/api/variables/)
- [Styles API](https://www.figma.com/plugin-docs/api/PaintStyle/)
