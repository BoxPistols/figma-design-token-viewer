# Development Guide

開発者向けの詳細なガイドです。このプラグインの構造、開発方法、デバッグ方法などを説明します。

## 📐 アーキテクチャ

### プロジェクト構造

```
figma-design-token-viewer/
├── code.ts                 # Figmaプラグインのメインロジック（バックエンド）
├── src/
│   ├── App.tsx            # React UIコンポーネント（フロントエンド）
│   ├── types.ts           # TypeScript型定義
│   ├── main.tsx           # Reactエントリーポイント
│   └── vite-env.d.ts      # Vite環境変数の型定義
├── manifest.json          # Figmaプラグインのマニフェストファイル
├── example-tokens.json    # サンプルトークンファイル
└── README.md              # プロジェクト概要
```

### 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite 5
- **スタイリング**: Tailwind CSS
- **アイコン**: Lucide React
- **実行環境**: Figma Plugin API

## 🔄 データフロー

```
JSON File (User)
    ↓
UI (React) - handleFileUpload()
    ↓
Plugin Bridge (postMessage)
    ↓
code.ts - handleImportedTokens()
    ↓
processToken() → Figma API
    ↓
Figma Styles/Variables Created
```

## 🧩 主要コンポーネント

### 1. code.ts (Plugin Backend)

Figma Plugin APIと直接やり取りするバックエンドコード。

#### 主要関数

##### `handleImportedTokens(tokens: TokenSet)`
- トークンセット全体を処理するエントリーポイント
- 再帰的にトークングループを処理

##### `processToken(name: string, token: DesignToken)`
- 個別のトークンを処理
- トークンタイプに応じて適切な関数に振り分け

##### `tryLoadFont(family: string, weight?: string | number)`
- フォント読み込みを複数のスタイル名で試行
- フォールバック機能を実装

##### `getOrCreateVariableCollection(name: string)`
- Variable Collectionの取得または作成
- **パフォーマンス最適化**: モジュールレベルでキャッシュ

#### キャッシング戦略

```typescript
// モジュールレベルでのキャッシュ
let designTokenCollection: VariableCollection | null = null;

async function getOrCreateVariableCollection(name: string) {
  // キャッシュが有効かチェック
  if (designTokenCollection &&
      !designTokenCollection.removed &&
      designTokenCollection.name === name) {
    return designTokenCollection;
  }

  // 新規取得/作成
  const collections = figma.variables.getLocalVariableCollections();
  let collection = collections.find(c => c.name === name);

  if (!collection) {
    collection = figma.variables.createVariableCollection(name);
  }

  // キャッシュに保存
  designTokenCollection = collection;
  return collection;
}
```

### 2. App.tsx (UI Component)

React UIコンポーネント。ユーザーインターフェースを提供。

#### 主要機能

##### トークンのフラット化
```typescript
function flattenTokens(tokens: TokenSet, parentPath: string[] = []): FlattenedToken[]
```
- ネストされたトークン構造を1次元配列に変換
- パス情報を保持（例: `['colors', 'primary']`）

##### トークン表示の最適化
```typescript
function getTokenBadgeClasses(tokenType: string): string
```
- トークンタイプごとのバッジスタイルをマップから取得
- 長い三項演算子チェーンを回避し、可読性向上

## 🔧 開発環境セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- Figma Desktop App（テスト用）

### セットアップ手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/BoxPistols/figma-design-token-viewer.git
cd figma-design-token-viewer

# 2. 依存関係をインストール
npm install

# 3. 開発モードで起動（ホットリロード有効）
npm run dev
```

### ビルドとテスト

```bash
# プロダクションビルド
npm run build

# TypeScript型チェック
npx tsc --noEmit

# ビルド成果物の確認
ls -la dist/
```

## 🐛 デバッグ方法

### Figmaでのデバッグ

1. **開発者コンソールを開く**
   - Figma Desktop App で `Command + Option + I` (Mac) または `Ctrl + Shift + I` (Windows)

2. **console.log の活用**
   ```typescript
   console.log('Token processing:', name, token);
   ```

3. **エラーハンドリング**
   ```typescript
   try {
     await processToken(name, token);
   } catch (error) {
     console.error(`Error processing token ${name}:`, error);
     figma.notify('Error occurred', { error: true });
   }
   ```

### UIデバッグ

React DevToolsは利用できないため、以下の方法を使用：

```typescript
// ステート変更をコンソールに出力
useEffect(() => {
  console.log('Current tokens:', tokens);
}, [tokens]);
```

## 📝 コーディング規約

### TypeScript

- 厳格な型付けを使用
- `any` 型は避ける
- 型アサーションは最小限に

```typescript
// ✅ Good
const token = value as DesignToken;
const fontSize = parseFloat(value.fontSize.toString());

// ❌ Bad
const token = value as any;
const fontSize = value.fontSize;
```

### エラーハンドリング

```typescript
// すべての非同期関数でtry-catchを使用
async function processToken(name: string, token: DesignToken) {
  try {
    // 処理...
  } catch (error) {
    console.error(`Error processing token ${name}:`, error);
    // ユーザーへの通知
  }
}
```

### コメント

```typescript
// ✅ Good: なぜそうするのかを説明
// Do not create an EffectStyle for opacity as there is no corresponding
// effect type in Figma. Applying opacity is handled directly on the node's
// opacity property.

// ❌ Bad: 何をしているかだけを説明
// Create opacity token
```

## 🧪 テスト戦略

### 手動テスト

1. **基本的なトークンインポート**
   ```bash
   # example-tokens.json を使用
   # すべてのトークンタイプが正しく作成されることを確認
   ```

2. **エッジケース**
   - 存在しないフォント
   - 無効なHEXカラー
   - 重複したトークン名
   - 空のトークンセット

3. **パフォーマンステスト**
   - 大量のトークン（100+）をインポート
   - キャッシングが機能していることを確認

### テストチェックリスト

- [ ] すべてのトークンタイプが正しく作成される
- [ ] 既存のトークンを再インポートしてもエラーが発生しない
- [ ] トークンをレイヤーに適用できる
- [ ] フォントが見つからない場合、フォールバックが機能する
- [ ] ビルドエラーがない
- [ ] TypeScript型エラーがない

## 🚀 リリースプロセス

### 1. バージョン更新

```bash
# manifest.json のバージョンを更新
# package.json のバージョンを更新
```

### 2. ビルド

```bash
npm run build
npx tsc --noEmit  # 型チェック
```

### 3. テスト

- [ ] Figmaでプラグインをロード
- [ ] すべての機能をテスト
- [ ] エラーがないことを確認

### 4. コミット

```bash
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
```

## 🔍 トラブルシューティング

### よくある問題

#### 1. フォントが読み込めない

**原因**: フォント名またはスタイル名が正しくない

**解決策**:
- `tryLoadFont()` 関数が複数のスタイル名を試行
- Figmaにフォントがインストールされているか確認

#### 2. 変数が重複作成される

**原因**: キャッシュが機能していない

**解決策**:
- `designTokenCollection` キャッシュが正しく設定されているか確認
- 既存変数チェックロジックを確認

#### 3. ビルドエラー

**原因**: 依存関係の問題

**解決策**:
```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 🤝 コントリビューション

### プルリクエストの手順

1. **Forkしてクローン**
2. **機能ブランチを作成**
   ```bash
   git checkout -b feature/my-feature
   ```
3. **変更を実装**
4. **テスト**
5. **コミット**
   ```bash
   git commit -m "Add: new feature description"
   ```
6. **プッシュ**
   ```bash
   git push origin feature/my-feature
   ```
7. **Pull Requestを作成**

### コミットメッセージ規約

```
<Type>: <Description>

Types:
- Add: 新機能追加
- Fix: バグ修正
- Refactor: リファクタリング
- Docs: ドキュメント更新
- Test: テスト追加/修正
```

## 📚 参考リソース

- [Figma Plugin API Documentation](https://www.figma.com/plugin-docs/)
- [Figma Variables API](https://www.figma.com/plugin-docs/api/variables/)
- [W3C Design Tokens Format](https://design-tokens.github.io/community-group/format/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 今後の改善案

- [ ] ユニットテストの追加（Jest）
- [ ] E2Eテストの追加
- [ ] CI/CDパイプラインの構築
- [ ] トークンのエクスポート機能（Figma → JSON）
- [ ] グラデーション、シャドウのサポート
- [ ] トークンのバージョン管理
- [ ] トークンのプレビュー機能強化
