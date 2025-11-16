# ユーザーガイド

Figma Design Token Viewerの使い方を分かりやすく説明します。

## 📖 目次

- [プラグインとは？](#プラグインとは)
- [インストール方法](#インストール方法)
- [基本的な使い方](#基本的な使い方)
- [デザイントークンの作成](#デザイントークンの作成)
- [よくある質問（FAQ）](#よくある質問faq)
- [トラブルシューティング](#トラブルシューティング)

## プラグインとは？

このプラグインは、**デザイントークン**（色、フォント、サイズなどのデザイン定義）をJSONファイルからFigmaに簡単にインポートできるツールです。

### できること

✅ JSONファイルから一括でデザイントークンをインポート
✅ 6種類のトークンタイプをサポート（Color, Typography, Spacing, Size, Opacity, Border Radius）
✅ Figmaのスタイルと変数を自動作成
✅ レイヤーへのトークン適用がワンクリック
✅ ダークモード対応のUI

## インストール方法

### 方法1: Figma Community から（公開後）

1. [Figma Community](https://www.figma.com/community)を開く
2. 「Design Token Viewer」を検索
3. 「Install」ボタンをクリック
4. Figmaを再起動

### 方法2: 開発版をインストール（今すぐ使用）

#### ステップ1: ファイルをダウンロード

```bash
# GitHubからダウンロード
git clone https://github.com/BoxPistols/figma-design-token-viewer.git
cd figma-design-token-viewer

# 依存関係をインストール
npm install

# ビルド
npm run build
```

#### ステップ2: Figmaでプラグインを読み込む

1. Figma Desktop Appを開く
2. メニューから `Plugins` → `Development` → `Import plugin from manifest...` を選択
3. ダウンロードしたフォルダ内の `manifest.json` を選択
4. プラグインが開発版として追加されます

## 基本的な使い方

### 1. プラグインを起動する

1. Figmaでファイルを開く
2. メニューから `Plugins` → `Design Token Viewer` を選択
3. プラグインウィンドウが表示されます

![Plugin UI](https://via.placeholder.com/800x600?text=Plugin+UI)

### 2. トークンをインポートする

#### 方法A: サンプルファイルを使用

1. プラグインフォルダ内の `example-tokens.json` をダウンロード
2. プラグインの「Choose JSON file」ボタンをクリック
3. `example-tokens.json` を選択
4. トークンが自動的にFigmaに追加されます

#### 方法B: 自分のトークンファイルを使用

1. JSONファイルを準備（[デザイントークンの作成](#デザイントークンの作成)を参照）
2. プラグインの「Choose JSON file」ボタンをクリック
3. 作成したJSONファイルを選択

### 3. トークンを適用する

1. Figmaでレイヤーを選択（複数選択可）
2. プラグイン内でトークンをクリック
3. 選択したレイヤーにトークンが適用されます

**対応するレイヤーの種類:**
- **Color**: すべてのレイヤー（Fill に適用）
- **Typography**: テキストレイヤーのみ
- **Spacing**: Auto Layout フレームのみ（Padding に適用）
- **Size**: すべてのレイヤー（Width/Height に適用）
- **Opacity**: すべてのレイヤー
- **Border Radius**: 角丸をサポートするレイヤー

### 4. トークンを検索する

1. プラグインの検索ボックスにキーワードを入力
2. トークン名または値で絞り込み
3. マッチしたトークンのみが表示されます

### 5. ダークモード切り替え

プラグイン右上の太陽/月アイコンをクリックして、ライトモード/ダークモードを切り替えられます。

## デザイントークンの作成

### トークンファイルの基本構造

JSONファイルで以下の形式を使用します：

```json
{
  "グループ名": {
    "トークン名": {
      "$type": "トークンタイプ",
      "$value": "値",
      "$description": "説明（オプション）"
    }
  }
}
```

### トークンタイプ別の例

#### 1. Color（カラー）

```json
{
  "colors": {
    "primary": {
      "$type": "color",
      "$value": "#3B82F6",
      "$description": "メインブランドカラー"
    },
    "secondary": {
      "$type": "color",
      "$value": "#8B5CF6"
    }
  }
}
```

**使用例:**
- ボタンの背景色
- テキストカラー
- ボーダーカラー

#### 2. Typography（タイポグラフィ）

```json
{
  "typography": {
    "heading": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Inter",
        "fontSize": "24",
        "fontWeight": "700",
        "lineHeight": "32",
        "letterSpacing": "-0.5"
      }
    },
    "body": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Inter",
        "fontSize": "16",
        "fontWeight": "400",
        "lineHeight": "24"
      }
    }
  }
}
```

**プロパティ:**
- `fontFamily` (必須): フォント名
- `fontSize` (必須): フォントサイズ（px）
- `fontWeight` (オプション): 100-900 または "Bold"、"Medium" など
- `lineHeight` (オプション): 行間（px または %）
- `letterSpacing` (オプション): 字間（px または %）

**使用例:**
- 見出しスタイル
- 本文テキスト
- キャプション

#### 3. Spacing（スペーシング）

```json
{
  "spacing": {
    "xs": {
      "$type": "spacing",
      "$value": "8"
    },
    "sm": {
      "$type": "spacing",
      "$value": "12"
    },
    "md": {
      "$type": "spacing",
      "$value": "16"
    },
    "lg": {
      "$type": "spacing",
      "$value": "24"
    }
  }
}
```

**使用例:**
- Auto Layoutのパディング
- 要素間の余白

#### 4. Size（サイズ）

```json
{
  "sizes": {
    "icon": {
      "small": {
        "$type": "size",
        "$value": "16"
      },
      "medium": {
        "$type": "size",
        "$value": "24"
      },
      "large": {
        "$type": "size",
        "$value": "32"
      }
    }
  }
}
```

**使用例:**
- アイコンサイズ
- ボタンサイズ
- コンテナ幅

#### 5. Opacity（透明度）

```json
{
  "opacity": {
    "disabled": {
      "$type": "opacity",
      "$value": 0.5
    },
    "hover": {
      "$type": "opacity",
      "$value": 0.8
    }
  }
}
```

**値:** 0（透明）〜 1（不透明）

**使用例:**
- 無効化状態
- ホバー効果
- オーバーレイ背景

#### 6. Border Radius（角丸）

```json
{
  "borderRadius": {
    "small": {
      "$type": "borderRadius",
      "$value": "4"
    },
    "medium": {
      "$type": "borderRadius",
      "$value": "8"
    },
    "large": {
      "$type": "borderRadius",
      "$value": "16"
    }
  }
}
```

**使用例:**
- ボタンの角丸
- カードの角丸
- 画像の角丸

### ネストされたトークン

トークンは階層的に整理できます：

```json
{
  "colors": {
    "brand": {
      "primary": {
        "$type": "color",
        "$value": "#3B82F6"
      },
      "secondary": {
        "$type": "color",
        "$value": "#8B5CF6"
      }
    },
    "semantic": {
      "success": {
        "$type": "color",
        "$value": "#10B981"
      },
      "error": {
        "$type": "color",
        "$value": "#EF4444"
      }
    }
  }
}
```

プラグイン内では `colors.brand.primary` のように表示されます。

## よくある質問（FAQ）

### Q1: トークンが見つかりません

**A:** 検索機能を使用してください。トークン名または値で検索できます。

### Q2: フォントが適用されません

**A:** 以下を確認してください：
1. Figmaにフォントがインストールされているか
2. フォント名が正確か（大文字小文字も含む）
3. フォントウェイト名が正しいか（例: "Bold"、"SemiBold" など）

プラグインは自動的に複数のフォントウェイト名を試行し、見つからない場合は「Inter Regular」にフォールバックします。

### Q3: 既存のトークンを更新できますか？

**A:** はい。同じ名前のトークンを再度インポートすると、値が更新されます。

### Q4: トークンを削除するには？

**A:** Figmaのアセットパネルから手動で削除してください：
- **Styles**: 左パネルの「Local styles」から
- **Variables**: 左パネルの「Local variables」から

### Q5: 対応しているトークン形式は？

**A:** W3C Design Tokens Community Group の形式に準拠しています。`$type` と `$value` を使用する形式です。

### Q6: Figma Variablesとは何ですか？

**A:** Figmaの新しい機能で、数値（サイズ、スペーシングなど）を変数として管理できます。このプラグインでは、Spacing、Size、Border RadiusトークンをVariablesとして作成します。

### Q7: トークンをエクスポートできますか？

**A:** 現在、エクスポート機能は開発中です。近日中に追加予定です。

## トラブルシューティング

### 問題: プラグインが起動しない

**原因と解決策:**

1. **Figmaが最新版か確認**
   - メニューから `Help` → `Check for Updates...`

2. **プラグインを再インストール**
   - `Plugins` → `Manage plugins...` → プラグインを削除
   - 再度インストール

3. **Figmaを再起動**

### 問題: JSONファイルが読み込めない

**原因と解決策:**

1. **JSONの形式を確認**
   - [JSONLint](https://jsonlint.com/) で検証
   - 正しい構造か確認（`$type` と `$value` が必須）

2. **ファイルサイズを確認**
   - 大きすぎるファイル（1MB以上）は処理に時間がかかる場合があります

3. **エンコーディングを確認**
   - UTF-8で保存されているか確認

### 問題: トークンが適用されない

**原因と解決策:**

1. **レイヤーを選択しているか確認**
   - 少なくとも1つのレイヤーを選択する必要があります

2. **レイヤータイプを確認**
   - Typographyトークンはテキストレイヤーのみ
   - Spacingトークンは Auto Layout フレームのみ

3. **Figmaコンソールでエラーを確認**
   - `Command + Option + I` (Mac) / `Ctrl + Shift + I` (Windows)
   - エラーメッセージがないか確認

### 問題: パフォーマンスが遅い

**原因と解決策:**

1. **トークン数を減らす**
   - 必要なトークンだけをインポート

2. **Figmaを再起動**
   - メモリをリフレッシュ

3. **他のプラグインを無効化**
   - 競合を避けるため

### 問題: スタイルが重複して作成される

**原因:** 以前のバージョンのプラグインを使用していた

**解決策:**
1. 最新版にアップデート
2. 既存の重複スタイルを手動で削除
3. トークンを再インポート

## 📞 サポート

### バグ報告

バグを見つけた場合は、以下の情報と共に[GitHubのIssue](https://github.com/BoxPistols/figma-design-token-viewer/issues)に報告してください：

- Figmaのバージョン
- OSのバージョン
- 再現手順
- エラーメッセージ（あれば）
- スクリーンショット（あれば）

### 機能リクエスト

新しい機能のリクエストも[GitHubのIssue](https://github.com/BoxPistols/figma-design-token-viewer/issues)で受け付けています。

### コミュニティ

- [GitHub Discussions](https://github.com/BoxPistols/figma-design-token-viewer/discussions) - 質問や議論
- [Twitter](https://twitter.com/BoxPistols) - 最新情報

## 🎓 チュートリアル

### チュートリアル1: 初めてのトークンインポート

1. `example-tokens.json` をダウンロード
2. Figmaで新しいファイルを作成
3. プラグインを起動
4. 「Choose JSON file」をクリック
5. `example-tokens.json` を選択
6. 左パネルで「Local styles」と「Local variables」を確認
7. トークンが作成されていることを確認

### チュートリアル2: カラートークンを使ってボタンを作る

1. Figmaで長方形を作成
2. プラグインを起動
3. `colors.brand.primary` トークンをクリック
4. ボタンの背景色が設定されます
5. テキストレイヤーを追加
6. `colors.neutral.white` トークンをクリック
7. テキストカラーが設定されます

### チュートリアル3: タイポグラフィトークンを使う

1. テキストレイヤーを作成
2. プラグインを起動
3. `typography.heading.h1` トークンをクリック
4. フォント、サイズ、ウェイト、行間が一括で設定されます

## 🎨 ベストプラクティス

### トークンの命名規則

```
<カテゴリ>.<サブカテゴリ>.<用途>
```

**例:**
- `colors.brand.primary`
- `typography.heading.h1`
- `spacing.layout.md`

### トークンの整理

```json
{
  "colors": { ... },      // カラー系
  "typography": { ... },  // タイポグラフィ系
  "spacing": { ... },     // スペーシング系
  "sizes": { ... },       // サイズ系
  "opacity": { ... },     // 透明度系
  "borderRadius": { ... } // 角丸系
}
```

### 説明（description）の活用

```json
{
  "colors": {
    "primary": {
      "$type": "color",
      "$value": "#3B82F6",
      "$description": "ボタン、リンク、重要な要素に使用"
    }
  }
}
```

## 📝 まとめ

このプラグインを使えば：

✅ デザイントークンを一元管理
✅ デザイナーと開発者のコミュニケーション向上
✅ デザインの一貫性を保ちやすい
✅ デザインシステムの構築が簡単

ご不明な点がございましたら、お気軽にお問い合わせください！
