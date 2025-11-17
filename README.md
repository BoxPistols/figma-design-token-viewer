# Figma Design Token Viewer

A comprehensive Figma plugin for managing and applying design tokens with **MUI7 & Material Design 2** compliance, full Figma API compatibility, and powerful viewing modes.

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/BoxPistols/figma-design-token-viewer)

## 📚 Documentation

- **[👤 User Guide](USER_GUIDE.md)** - 使い方、トークンの作成方法、FAQ、トラブルシューティング
- **[👨‍💻 Development Guide](DEVELOPMENT.md)** - アーキテクチャ、開発環境、コーディング規約
- **[🧪 Testing Checklist](TESTING_CHECKLIST.md)** - Figma環境での動作検証手順

## ✨ Features

### 🎨 MUI7 & Material Design 2 Compliance

Built-in design token patterns following official standards:

- **Material Design 2 (Default)** - Official MD2 color palette with proper light/dark mode variants
- **Modern Minimal** - Clean monochromatic design system
- **Vibrant** - Bold, colorful accent-based palette

All patterns include proper semantic colors (primary, secondary, error, warning, info, success) with main/light/dark/contrastText variants.

### 📊 Three Powerful View Modes

- **Card (Minimum)** - Compact grid view for quick browsing
- **Card (Detailed)** - Expanded cards with full token information and descriptions
- **Table** - Spreadsheet-style view with all metadata

### 🔄 Token Type Separation

Tokens are automatically **grouped by type** for better organization:
- **Colors** - Separated by semantic meaning (primary, secondary, etc.)
- **Typography** - MUI-standard typography scale (h1-h6, body1-2, etc.)
- **Spacing** - 8px-based spacing system
- **Size** - Icon and button size tokens
- **Opacity** - Material Design opacity standards
- **Border Radius** - Consistent corner radius values

### 🌓 Complete Dark/Light Mode Binding

True theme support with proper bindings:
- `colors.background.light` / `colors.background.dark`
- `colors.text.light` / `colors.text.dark`
- `colors.action.light` / `colors.action.dark`
- Automatic theme switching preserves design consistency

### Full Figma API Compatibility

This plugin supports **all major design token types** with complete Figma API integration:

- ✅ **Color** - Paint Styles with HEX/RGBA support
- ✅ **Typography** - Text Styles following MUI typography scale
- ✅ **Spacing** - Variables API for layout spacing (8px base)
- ✅ **Size** - Variables API for dimensions
- ✅ **Opacity** - Direct layer opacity application
- ✅ **Border Radius** - Variables API for corner radius

### 💾 Smart Data Management

- **localStorage CRUD** - All settings auto-saved (tokens, view mode, theme, pattern)
- **Pattern Switching** - Instantly switch between design systems
- **Import/Export** - Full JSON import/export with pattern name
- **Reset** - Quick reset to default pattern
- **Clear** - Complete token deletion

## 🚀 Quick Start

### For Users

1. Download the plugin (see [Installation](#📦-installation))
2. Open Figma and run the plugin
3. **Try the built-in patterns!**
   - Select a pattern: Material Design 2, Modern Minimal, or Vibrant
   - Tokens load automatically
4. **Switch view modes** to find your preferred layout
5. **Import custom tokens** via JSON file
6. Select a layer and click any token to apply it

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