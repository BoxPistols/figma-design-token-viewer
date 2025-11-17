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

## 📚 参考リソース & 学習ガイド

### Figma Plugin API - 公式ドキュメント

**必読ドキュメント:**

1. **[Plugin API Overview](https://www.figma.com/plugin-docs/)** ⭐ 最初にここから
   - プラグイン開発の基本概念
   - 環境セットアップ
   - 基本的なプラグイン構造

2. **[Plugin API Reference](https://www.figma.com/plugin-docs/api/api-reference/)** 📖 完全なAPI仕様
   - 全てのAPIメソッドの詳細
   - パラメータと戻り値
   - 使用例

3. **[Plugin Quickstart](https://www.figma.com/plugin-docs/setup/)** 🚀 5分で始める
   - 最初のプラグイン作成
   - "Hello World"チュートリアル
   - マニフェストファイルの設定

### このプロジェクトで使用しているAPI

**Styles API (Color & Typography):**
- [PaintStyle API](https://www.figma.com/plugin-docs/api/PaintStyle/) - `figma.createPaintStyle()`
  - カラートークンの実装方法
  - RGB変換の仕組み
  - スタイルの更新方法

- [TextStyle API](https://www.figma.com/plugin-docs/api/TextStyle/) - `figma.createTextStyle()`
  - タイポグラフィトークンの実装
  - フォントプロパティの設定
  - スタイルの一括適用

**Variables API (Spacing, Size, BorderRadius):**
- [Variables API Guide](https://www.figma.com/plugin-docs/api/variables/) - Modern design tokens
  - 変数の作成と管理
  - 変数コレクションの使い方
  - モードとバリエーション
  - このプロジェクトのcode.ts:277-320で実装例を確認

**Font Loading:**
- [loadFontAsync](https://www.figma.com/plugin-docs/api/figma/#loadfontasync) - フォント読み込み
  - 非同期フォント読み込み
  - フォールバック戦略
  - code.ts:228-250の実装を参照

**Node Manipulation:**
- [Nodes API](https://www.figma.com/plugin-docs/api/nodes/) - レイヤー操作
  - ノードツリーの理解
  - プロパティの取得と設定
  - 選択したレイヤーの操作

### 段階的学習パス

**🎯 初心者向け（1-2週間）:**

```
Week 1: 基礎
├── Day 1: Quickstart Guideを完了
├── Day 2: 簡単なプラグインを作成（例: 選択したレイヤーの情報表示）
├── Day 3-4: Plugin API Referenceを読む
└── Day 5: カラーピッカープラグインを作成

Week 2: このプロジェクト理解
├── Day 1: README.mdとDEVELOPMENT.mdを熟読
├── Day 2: code.tsのコメントを追加しながら読む
├── Day 3: App.tsxのUI構造を理解
├── Day 4: tokenPatterns.tsでMUI/MD2構造を学ぶ
└── Day 5: 実際にFigmaで動かしてみる
```

**🚀 中級者向け（2-4週間）:**

```
Week 1-2: Variables API マスター
├── Variables API公式ドキュメント精読
├── 独自の変数コレクション作成プラグイン開発
├── バインディングの理解
└── このプロジェクトのVariables実装を改善

Week 3-4: パフォーマンス最適化
├── 大量トークンの処理速度改善
├── キャッシング戦略の実装
├── Promise.allSettledの活用
└── エラーハンドリングの強化
```

**💎 上級者向け（1ヶ月以上）:**

```
Advanced Topics:
├── 複雑なトークン変換ロジック
├── Figma → JSON エクスポート機能
├── グラデーション、シャドウトークン対応
├── トークンのバージョン管理システム
├── プラグイン公開とメンテナンス
└── コミュニティへの貢献
```

### 実践的コード例

**このプロジェクトから学べる重要なパターン:**

**1. モジュールレベルキャッシング (code.ts:3-4)**
```typescript
// グローバルキャッシュでAPIコールを削減
let designTokenCollection: VariableCollection | null = null;

// 初回のみ作成、以降は再利用
if (!designTokenCollection) {
  const collections = figma.variables.getLocalVariableCollections();
  designTokenCollection = collections.find(c => c.name === COLLECTION_NAME)
    || figma.variables.createVariableCollection(COLLECTION_NAME);
}
```

**2. エラーハンドリングとフォールバック (code.ts:228-250)**
```typescript
// 複数の候補を試すフォールバック戦略
async function tryLoadFont(family: string, weight: number): Promise<boolean> {
  const candidates = [
    weightMap[weight] || 'Regular',
    `${weight}`,
    'Regular'
  ];

  for (const style of candidates) {
    try {
      await figma.loadFontAsync({ family, style });
      return true; // 成功したらすぐreturn
    } catch {
      continue; // 失敗したら次を試す
    }
  }
  return false; // 全て失敗
}
```

**3. 並列処理でパフォーマンス向上 (code.ts:43-72)**
```typescript
// Promise.allSettledで並列処理 + エラー分離
const results = await Promise.allSettled(
  Object.entries(tokens).map(([key, value]) =>
    processToken(key, value)
  )
);

// 結果を集計
const summary = results.reduce((acc, result) => {
  if (result.status === 'fulfilled') {
    acc.success += result.value.success;
  } else {
    acc.errors += 1;
  }
  return acc;
}, { success: 0, errors: 0 });
```

**4. 既存リソースの更新vs新規作成 (code.ts:145-163)**
```typescript
// 重複作成を防ぐパターン
const existingStyles = figma.getLocalPaintStyles();
const existingStyle = existingStyles.find(s => s.name === name);

if (existingStyle) {
  // 既存の場合は更新
  existingStyle.paints = [{ type: 'SOLID', color: rgb }];
} else {
  // 新規の場合は作成
  const paintStyle = figma.createPaintStyle();
  paintStyle.name = name;
  paintStyle.paints = [{ type: 'SOLID', color: rgb }];
}
```

### デバッグテクニック

**開発者コンソールの活用:**

```typescript
// 1. 詳細なログ出力
console.log('Token processing started:', {
  tokenCount: Object.keys(tokens).length,
  timestamp: Date.now()
});

// 2. 警告レベルの使い分け
console.warn('Skipping invalid token:', tokenPath);
console.error('Critical error:', error);

// 3. オブジェクトの詳細表示
console.table(flattenedTokens);
console.dir(variableCollection, { depth: 3 });
```

**Figmaでのデバッグ:**

```bash
# 開発者コンソールを開く
Mac: Cmd + Option + I
Windows: Ctrl + Shift + I

# プラグインの再読み込み
Cmd + Option + P (Mac)
Ctrl + Alt + P (Windows)
```

### トラブルシューティング

**よくある問題と解決策:**

| 問題 | 原因 | 解決方法 |
|------|------|----------|
| フォントが読み込めない | フォント名が間違っている | tryLoadFont関数のような複数候補を試す実装 |
| スタイルが重複作成される | 既存チェックがない | getLocalPaintStyles()で既存を確認 |
| 変数が作成されない | コレクションが見つからない | キャッシュを確認、必要なら再作成 |
| トークン適用が遅い | 同期処理 | Promise.allSettledで並列化 |
| レイヤーが見つからない | 選択チェックなし | figma.currentPage.selection確認 |

### コミュニティリソース

**さらに学びたい方へ:**

- **[Figma Plugin Samples](https://github.com/figma/plugin-samples)** - 公式サンプル集
- **[Figma Developers Discord](https://discord.gg/figma)** - 質問・議論の場
- **[Awesome Figma Plugins](https://github.com/thomas-lowry/figma-plugins-on-github)** - オープンソースプラグイン集
- **[Figma Community Plugins](https://www.figma.com/community/explore?tab=plugins)** - プラグイン探索

### その他の技術リソース

- **[W3C Design Tokens Format](https://design-tokens.github.io/community-group/format/)** - トークン標準仕様
- **[React Documentation](https://react.dev/)** - React公式ドキュメント
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript学習
- **[Vite Guide](https://vitejs.dev/guide/)** - ビルドツール
- **[Tailwind CSS](https://tailwindcss.com/docs)** - スタイリング

## 💡 今後の改善案

- [ ] ユニットテストの追加（Jest）
- [ ] E2Eテストの追加
- [ ] CI/CDパイプラインの構築
- [ ] トークンのエクスポート機能（Figma → JSON）
- [ ] グラデーション、シャドウのサポート
- [ ] トークンのバージョン管理
- [ ] トークンのプレビュー機能強化
