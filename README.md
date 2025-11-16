# Figma Design Token Viewer

A comprehensive Figma plugin for managing and applying design tokens with full Figma API compatibility.

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/BoxPistols/figma-design-token-viewer)

## 📚 Documentation

- **[👤 User Guide](USER_GUIDE.md)** - 使い方、トークンの作成方法、FAQ、トラブルシューティング
- **[👨‍💻 Development Guide](DEVELOPMENT.md)** - アーキテクチャ、開発環境、コーディング規約

## ✨ Features

### Full Figma API Compatibility

This plugin now supports **all major design token types** with complete Figma API integration:

- ✅ **Color** - Paint Styles with HEX to RGB conversion
- ✅ **Typography** - Text Styles with font family, size, weight, line height, letter spacing
- ✅ **Spacing** - Variables API for layout spacing
- ✅ **Size** - Variables API for dimensions
- ✅ **Opacity** - Direct layer opacity application
- ✅ **Border Radius** - Variables API for corner radius

### Modern Figma APIs

- **Variables API** - Utilizes Figma's modern Variables API for spacing, size, and border radius tokens
- **Text Styles** - Full typography support with font loading and fallbacks
- **Paint Styles** - Color management with style creation
- **Direct Property Access** - Opacity applied directly to layer properties for maximum compatibility

## 🚀 Quick Start

### For Users

1. Download the plugin (see [Installation](#📦-installation))
2. Open Figma and run the plugin
3. Click "Choose JSON file" and select `example-tokens.json`
4. Tokens are automatically created in Figma!
5. Select a layer and click any token to apply it

👉 **Detailed instructions**: See [User Guide](USER_GUIDE.md)

### For Developers

```bash
git clone https://github.com/BoxPistols/figma-design-token-viewer.git
cd figma-design-token-viewer
npm install
npm run build
```

👉 **Development setup**: See [Development Guide](DEVELOPMENT.md)

## 📦 Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build`
4. Load the plugin in Figma: Plugins → Development → Import plugin from manifest

## 🚀 Usage

### Basic Workflow

1. **Import** - Open the plugin and select a JSON file
2. **Browse** - View all imported tokens in the UI
3. **Apply** - Select a layer and click a token to apply it
4. **Search** - Use the search bar to find specific tokens

For detailed usage instructions, see the [User Guide](USER_GUIDE.md).

## 📝 Token Format

The plugin supports the W3C Design Tokens format. Quick example:

```json
{
  "colors": {
    "primary": {
      "$type": "color",
      "$value": "#3B82F6",
      "$description": "Primary brand color"
    }
  },
  "typography": {
    "heading": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Inter",
        "fontSize": "24",
        "fontWeight": "700",
        "lineHeight": "32"
      }
    }
  },
  "spacing": {
    "medium": {
      "$type": "spacing",
      "$value": "16"
    }
  }
}
```

See `example-tokens.json` for a complete example with all token types.

👉 **Full token documentation**: See [User Guide - デザイントークンの作成](USER_GUIDE.md#デザイントークンの作成)

## 🎨 Supported Token Types

| Type | Format | Creates | Applies To |
|------|--------|---------|------------|
| **Color** | HEX string | Paint Style | Fill property |
| **Typography** | Font object | Text Style | Text layers |
| **Spacing** | Number (px) | Variable | Auto Layout padding |
| **Size** | Number (px) | Variable | Layer dimensions |
| **Opacity** | 0-1 | Direct property | Layer opacity |
| **Border Radius** | Number (px) | Variable | Corner radius |

👉 **Detailed specifications**: See [User Guide - トークンタイプ別の例](USER_GUIDE.md#トークンタイプ別の例)

## 🛠️ Development

```bash
npm install          # Install dependencies
npm run dev          # Development with watch mode
npm run build        # Production build
npx tsc --noEmit     # Type checking
```

👉 **Full development guide**: See [Development Guide](DEVELOPMENT.md)

## 📚 Technical Details

### Figma API Usage

- `figma.createPaintStyle()` - Color tokens
- `figma.createTextStyle()` - Typography tokens
- `figma.variables.createVariable()` - Spacing, size, border radius
- `figma.loadFontAsync()` - Font loading with fallbacks
- Direct property access - Opacity tokens

### Performance Optimizations

- Variable Collection caching for faster imports
- Duplicate variable detection and updates
- Multiple font weight name fallbacks

👉 **Architecture details**: See [Development Guide - アーキテクチャ](DEVELOPMENT.md#📐-アーキテクチャ)

## 🤝 Contributing

Contributions are welcome! See [Development Guide - コントリビューション](DEVELOPMENT.md#🤝-コントリビューション) for details.

## 📞 Support

- **Bug Reports**: [GitHub Issues](https://github.com/BoxPistols/figma-design-token-viewer/issues)
- **Questions**: [GitHub Discussions](https://github.com/BoxPistols/figma-design-token-viewer/discussions)
- **User Guide**: [USER_GUIDE.md](USER_GUIDE.md)
- **Dev Guide**: [DEVELOPMENT.md](DEVELOPMENT.md)

## 📄 License

MIT