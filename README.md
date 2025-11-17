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

## 📖 Learning Figma Plugin API

### Official Resources

**📘 Essential Documentation:**
- [Plugin API Overview](https://www.figma.com/plugin-docs/) - Start here for official documentation
- [Plugin API Reference](https://www.figma.com/plugin-docs/api/api-reference/) - Complete API reference
- [Plugin Quickstart Guide](https://www.figma.com/plugin-docs/setup/) - Build your first plugin in 5 minutes

**🎨 API Guides Used in This Plugin:**
- [Styles API](https://www.figma.com/plugin-docs/api/PaintStyle/) - `createPaintStyle()`, `createTextStyle()`
- [Variables API](https://www.figma.com/plugin-docs/api/variables/) - `createVariable()`, `createVariableCollection()`
- [Font Loading](https://www.figma.com/plugin-docs/api/figma/#loadfontasync) - `loadFontAsync()`
- [Nodes & Properties](https://www.figma.com/plugin-docs/api/nodes/) - Layer manipulation

### Interactive Tutorials

**🚀 Step-by-Step Learning:**

1. **[Figma Plugin Quickstart](https://www.figma.com/plugin-docs/setup/)**
   - Set up your development environment
   - Create your first "Hello World" plugin
   - Understand the plugin structure

2. **[Working with Nodes](https://www.figma.com/plugin-docs/working-with-nodes/)**
   - Learn how to access and modify layers
   - Understand the node tree structure
   - Practice with selections

3. **[Creating Styles](https://www.figma.com/plugin-docs/creating-styles/)**
   - Create Paint Styles (colors)
   - Create Text Styles (typography)
   - Manage style updates

4. **[Variables Deep Dive](https://www.figma.com/plugin-docs/api/variables/)**
   - Modern approach for design tokens
   - Create variable collections
   - Bind variables to properties

### Hands-On Learning Path

**📝 Recommended Learning Order:**

```
Week 1: Basics
├── Day 1-2: Complete Quickstart Guide
├── Day 3-4: Explore Plugin API Reference
└── Day 5-7: Build a simple plugin (color picker, etc.)

Week 2: This Project
├── Day 1-2: Read code.ts - understand token processing
├── Day 3-4: Study tokenPatterns.ts - see MUI/MD2 structure
├── Day 5-6: Examine App.tsx - learn UI integration
└── Day 7: Build a feature or fix a bug

Week 3: Advanced
├── Variables API mastery
├── Performance optimization
└── Complex token transformations
```

### Code Examples from This Plugin

**Example 1: Creating a Paint Style (Color Token)**
```typescript
// From code.ts:145-163
const existingStyles = figma.getLocalPaintStyles();
const existingStyle = existingStyles.find(s => s.name === name);

if (existingStyle) {
  existingStyle.paints = [{ type: 'SOLID', color: rgb }];
} else {
  const paintStyle = figma.createPaintStyle();
  paintStyle.name = name;
  paintStyle.paints = [{ type: 'SOLID', color: rgb }];
}
```

**Example 2: Creating a Variable (Spacing Token)**
```typescript
// From code.ts:277-291
const existingVariable = collection.variables.find(v => v.name === name);

if (existingVariable) {
  existingVariable.setValueForMode(modeId, value);
} else {
  const variable = figma.variables.createVariable(name, collection, 'FLOAT');
  variable.setValueForMode(modeId, value);
  variable.description = `Design token: ${tokenType}`;
}
```

**Example 3: Font Loading with Fallback**
```typescript
// From code.ts:228-250
async function tryLoadFont(family: string, weight: number): Promise<boolean> {
  const styleNames = [
    weightMap[weight] || 'Regular',
    `${weight}`,
    'Regular'
  ];

  for (const style of styleNames) {
    try {
      await figma.loadFontAsync({ family, style });
      return true;
    } catch (e) {
      continue;
    }
  }
  return false;
}
```

### Community Resources

**💡 Additional Learning:**
- [Figma Plugin Community](https://www.figma.com/community/explore?tab=plugins) - Explore open-source plugins
- [Figma Developers Discord](https://discord.gg/figma) - Ask questions, get help
- [Figma Plugin Samples](https://github.com/figma/plugin-samples) - Official example plugins
- [Awesome Figma Plugins](https://github.com/thomas-lowry/figma-plugins-on-github) - Curated list of open-source plugins

### Debugging Tips

**🐛 Essential Tools:**
```javascript
// 1. Console logging in plugin code (code.ts)
console.log('Token value:', token.$value);
console.warn('Invalid color format:', value);
console.error('Font loading failed:', error);

// 2. Open Developer Console in Figma
// Mac: Cmd + Option + I
// Windows: Ctrl + Shift + I

// 3. Check plugin messages
figma.notify('Processing 50 tokens...');
```

### Testing Your Plugin

**✅ Verification Checklist:**

Use our comprehensive testing guide: [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)

Quick test flow:
1. Load plugin in Figma Desktop App
2. Import `example-tokens.json`
3. Check Local Styles panel (Paint & Text Styles)
4. Check Local Variables panel
5. Select layers and apply tokens
6. Verify values in properties panel

### Next Steps

After understanding the basics:
1. ✅ Fork this repository
2. ✅ Read [DEVELOPMENT.md](DEVELOPMENT.md) for architecture details
3. ✅ Study [code.ts](/code.ts) to see real API usage
4. ✅ Experiment with [tokenPatterns.ts](/src/tokenPatterns.ts) to create your own design system
5. ✅ Build new features or improvements

## 🤝 Contributing

Contributions are welcome! See [Development Guide - コントリビューション](DEVELOPMENT.md#🤝-コントリビューション) for details.

## 📞 Support

- **Bug Reports**: [GitHub Issues](https://github.com/BoxPistols/figma-design-token-viewer/issues)
- **Questions**: [GitHub Discussions](https://github.com/BoxPistols/figma-design-token-viewer/discussions)
- **User Guide**: [USER_GUIDE.md](USER_GUIDE.md)
- **Dev Guide**: [DEVELOPMENT.md](DEVELOPMENT.md)

## 📄 License

MIT