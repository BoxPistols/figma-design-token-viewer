# Figma Design Token Viewer

A comprehensive Figma plugin for managing and applying design tokens with full Figma API compatibility.

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/BoxPistols/figma-design-token-viewer)

## ✨ Features

### Full Figma API Compatibility

This plugin now supports **all major design token types** with complete Figma API integration:

- ✅ **Color** - Paint Styles with HEX to RGB conversion
- ✅ **Typography** - Text Styles with font family, size, weight, line height, letter spacing
- ✅ **Spacing** - Variables API for layout spacing
- ✅ **Size** - Variables API for dimensions
- ✅ **Opacity** - Effect Styles with opacity values
- ✅ **Border Radius** - Variables API for corner radius

### Modern Figma APIs

- **Variables API** - Utilizes Figma's modern Variables API for spacing, size, and border radius tokens
- **Text Styles** - Full typography support with font loading and fallbacks
- **Paint Styles** - Color management with style creation
- **Effect Styles** - Opacity handling through effect styles

## 📦 Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build`
4. Load the plugin in Figma: Plugins → Development → Import plugin from manifest

## 🚀 Usage

### Importing Tokens

1. Open the plugin in Figma
2. Click "Choose JSON file" to upload your design tokens
3. Tokens will be automatically converted to Figma styles and variables

### Applying Tokens

1. Select one or more layers in Figma
2. Click on any token in the plugin UI
3. The token will be applied to your selection based on its type

### Exporting Tokens

Click the "Export" button to download your current tokens as a JSON file.

## 📝 Token Format

The plugin supports the W3C Design Tokens format. Here's a complete example:

```json
{
  "colors": {
    "primary": {
      "$type": "color",
      "$value": "#3B82F6",
      "$description": "Primary brand color"
    },
    "secondary": {
      "$type": "color",
      "$value": "#8B5CF6"
    }
  },
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
  },
  "spacing": {
    "small": {
      "$type": "spacing",
      "$value": "8"
    },
    "medium": {
      "$type": "spacing",
      "$value": "16"
    },
    "large": {
      "$type": "spacing",
      "$value": "24"
    }
  },
  "sizes": {
    "icon": {
      "small": {
        "$type": "size",
        "$value": "16"
      },
      "medium": {
        "$type": "size",
        "$value": "24"
      }
    }
  },
  "opacity": {
    "disabled": {
      "$type": "opacity",
      "$value": 0.5
    },
    "hover": {
      "$type": "opacity",
      "$value": 0.8
    }
  },
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

## 🎨 Token Types

### Color
- Format: HEX color string (e.g., `"#3B82F6"`)
- Creates: Figma Paint Style
- Applies to: Fill property of selected layers

### Typography
- Format: Object with font properties
- Creates: Figma Text Style
- Applies to: Text layers only
- Properties:
  - `fontFamily` (required): Font name
  - `fontSize` (required): Size in pixels
  - `fontWeight` (optional): 100-900 or style name
  - `lineHeight` (optional): Pixels or percentage
  - `letterSpacing` (optional): Pixels or percentage

### Spacing
- Format: Numeric value in pixels
- Creates: Figma Variable (Float)
- Applies to: Auto Layout padding

### Size
- Format: Numeric value in pixels
- Creates: Figma Variable (Float)
- Applies to: Layer dimensions

### Opacity
- Format: Number between 0-1
- Creates: Figma Effect Style
- Applies to: Layer opacity

### Border Radius
- Format: Numeric value in pixels
- Creates: Figma Variable (Float)
- Applies to: Corner radius property

## 🛠️ Development

```bash
# Install dependencies
npm install

# Development mode with watch
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## 📚 API Compatibility

This plugin uses the following Figma Plugin API features:

- `figma.createPaintStyle()` - Color tokens
- `figma.createTextStyle()` - Typography tokens
- `figma.variables.createVariable()` - Spacing, size, border radius
- `figma.variables.createVariableCollection()` - Token organization
- `figma.createEffectStyle()` - Opacity tokens
- `figma.loadFontAsync()` - Font loading for typography

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT