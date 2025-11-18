import { TokenSet, DesignToken, FlattenedToken, TypographyValue } from './src/types';

// Cache for the variable collection to improve performance when importing many tokens
let designTokenCollection: VariableCollection | null = null;

figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-tokens') {
    await handleImportedTokens(msg.tokens);
  } else if (msg.type === 'apply-token') {
    await applyToken(msg.token);
  } else if (msg.type === 'export-tokens') {
    await handleExportTokens();
  } else if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};

async function handleExportTokens() {
  try {
    const tokens: TokenSet = {};

    // Export Paint Styles (Colors)
    const paintStyles = figma.getLocalPaintStyles();
    if (paintStyles.length > 0) {
      tokens.colors = {};
      for (const style of paintStyles) {
        const pathParts = style.name.split('/');
        let current: any = tokens.colors;

        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {};
          }
          current = current[pathParts[i]];
        }

        const lastName = pathParts[pathParts.length - 1];
        const paint = style.paints[0];

        if (paint && paint.type === 'SOLID') {
          const r = Math.round(paint.color.r * 255);
          const g = Math.round(paint.color.g * 255);
          const b = Math.round(paint.color.b * 255);
          const a = paint.opacity ?? 1;

          current[lastName] = {
            $type: 'color',
            $value: a < 1
              ? `rgba(${r}, ${g}, ${b}, ${a})`
              : `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase(),
            $description: style.description || undefined
          };
        }
      }
    }

    // Export Text Styles (Typography)
    const textStyles = figma.getLocalTextStyles();
    if (textStyles.length > 0) {
      tokens.typography = {};
      for (const style of textStyles) {
        const pathParts = style.name.split('/');
        let current: any = tokens.typography;

        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {};
          }
          current = current[pathParts[i]];
        }

        const lastName = pathParts[pathParts.length - 1];
        const fontName = style.fontName as FontName;

        current[lastName] = {
          $type: 'typography',
          $value: {
            fontFamily: fontName.family,
            fontSize: style.fontSize.toString(),
            fontWeight: getFontWeightFromStyle(fontName.style),
            lineHeight: typeof style.lineHeight === 'object' && 'value' in style.lineHeight
              ? style.lineHeight.value.toString()
              : undefined,
            letterSpacing: typeof style.letterSpacing === 'object' && 'value' in style.letterSpacing
              ? style.letterSpacing.value.toString()
              : undefined
          },
          $description: style.description || undefined
        };
      }
    }

    // Export Variables (Spacing, Size, BorderRadius)
    const collections = figma.variables.getLocalVariableCollections();
    for (const collection of collections) {
      for (const variableId of collection.variableIds) {
        const variable = figma.variables.getVariableById(variableId);
        if (!variable) continue;

        const pathParts = variable.name.split('/');
        const tokenType = variable.description || 'spacing';

        if (!tokens[tokenType]) {
          tokens[tokenType] = {};
        }

        let current: any = tokens[tokenType];
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {};
          }
          current = current[pathParts[i]];
        }

        const lastName = pathParts[pathParts.length - 1];
        const value = variable.valuesByMode[collection.modes[0].modeId];

        current[lastName] = {
          $type: tokenType,
          $value: typeof value === 'number' ? value.toString() : value,
          $description: variable.description || undefined
        };
      }
    }

    // Send tokens back to UI
    figma.ui.postMessage({
      type: 'exported-tokens',
      tokens
    });

    figma.notify(`Exported ${Object.keys(tokens).length} token type(s)`, { timeout: 3000 });
  } catch (error) {
    console.error('Error exporting tokens:', error);
    figma.notify('Error exporting tokens', { error: true });
  }
}

function getFontWeightFromStyle(style: string): string {
  const weightMap: Record<string, string> = {
    'Thin': '100',
    'Hairline': '100',
    'ExtraLight': '200',
    'Extra Light': '200',
    'UltraLight': '200',
    'Ultra Light': '200',
    'Light': '300',
    'Regular': '400',
    'Normal': '400',
    'Medium': '500',
    'SemiBold': '600',
    'Semi Bold': '600',
    'DemiBold': '600',
    'Demi Bold': '600',
    'Bold': '700',
    'ExtraBold': '800',
    'Extra Bold': '800',
    'UltraBold': '800',
    'Ultra Bold': '800',
    'Black': '900',
    'Heavy': '900'
  };

  return weightMap[style] || '400';
}

async function handleImportedTokens(tokens: TokenSet) {
  let successCount = 0;
  let errorCount = 0;
  let totalCount = 0;

  // Count total tokens
  const countTokens = (obj: TokenSet): number => {
    let count = 0;
    for (const [key, value] of Object.entries(obj)) {
      if ('$type' in value && '$value' in value) {
        count++;
      } else {
        count += countTokens(value as TokenSet);
      }
    }
    return count;
  };

  totalCount = countTokens(tokens);

  // Show initial progress notification
  figma.notify(`Importing ${totalCount} token${totalCount !== 1 ? 's' : ''}...`, { timeout: 2000 });

  try {
    // Process tokens in parallel using Promise.allSettled for better performance
    const results = await Promise.allSettled(
      Object.entries(tokens).map(async ([key, value]) => {
        if ('$type' in value && '$value' in value) {
          await processToken(key, value as DesignToken);
          return { success: 1, errors: 0 };
        } else {
          return await processTokenGroup(key, value as TokenSet);
        }
      })
    );

    // Aggregate results
    for (const result of results) {
      if (result.status === 'fulfilled') {
        successCount += result.value.success;
        errorCount += result.value.errors;
      } else {
        console.error('Token processing failed:', result.reason);
        errorCount++;
      }
    }

    // Show summary notification
    if (errorCount === 0) {
      figma.notify(`✓ Successfully imported ${successCount} token${successCount !== 1 ? 's' : ''}`, { timeout: 3000 });
    } else {
      figma.notify(`Imported ${successCount} token${successCount !== 1 ? 's' : ''}, ${errorCount} error${errorCount !== 1 ? 's' : ''}`, {
        error: true,
        timeout: 5000
      });
    }
  } catch (error) {
    console.error('Error importing tokens:', error);
    figma.notify('Error importing tokens', { error: true });
  }
}

async function processTokenGroup(prefix: string, group: TokenSet): Promise<{ success: number; errors: number }> {
  let successCount = 0;
  let errorCount = 0;

  // Process tokens in parallel within the group
  const results = await Promise.allSettled(
    Object.entries(group).map(async ([key, value]) => {
      const fullKey = `${prefix}/${key}`;
      if ('$type' in value && '$value' in value) {
        await processToken(fullKey, value as DesignToken);
        return { success: 1, errors: 0 };
      } else {
        return await processTokenGroup(fullKey, value as TokenSet);
      }
    })
  );

  // Aggregate results
  for (const result of results) {
    if (result.status === 'fulfilled') {
      successCount += result.value.success;
      errorCount += result.value.errors;
    } else {
      console.error('Token group processing failed:', result.reason);
      errorCount++;
    }
  }

  return { success: successCount, errors: errorCount };
}

async function processToken(name: string, token: DesignToken) {
  try {
    switch (token.$type) {
      case 'color':
        await processColorToken(name, token.$value as string);
        break;

      case 'typography':
        await processTypographyToken(name, token.$value as TypographyValue);
        break;

      case 'spacing':
      case 'size':
        await processNumericVariable(name, token.$type, token.$value as string | number);
        break;

      case 'opacity':
        await processOpacityToken(name, token.$value as number);
        break;

      case 'borderRadius':
        await processNumericVariable(name, token.$type, token.$value as string | number);
        break;

      default:
        console.warn(`Unsupported token type: ${token.$type}`);
    }
  } catch (error) {
    console.error(`Error processing token ${name}:`, error);
  }
}

async function processColorToken(name: string, value: string) {
  // Check if a paint style with this name already exists
  const existingStyles = figma.getLocalPaintStyles();
  let style = existingStyles.find(s => s.name === name);

  if (!style) {
    style = figma.createPaintStyle();
    style.name = name;
  }

  const color = parseColor(value);
  if (!color) {
    console.warn(`Invalid color value for ${name}: ${value}`);
    return;
  }

  style.paints = [{
    type: 'SOLID',
    color: {
      r: color.r,
      g: color.g,
      b: color.b
    },
    opacity: color.a
  }];
}

async function processTypographyToken(name: string, value: TypographyValue) {
  // Validate required fields
  if (!value.fontFamily || !value.fontSize) {
    console.warn(`Invalid typography token ${name}: missing fontFamily or fontSize`);
    return;
  }

  // Check if a text style with this name already exists
  const existingStyles = figma.getLocalTextStyles();
  let style = existingStyles.find(s => s.name === name);

  if (!style) {
    style = figma.createTextStyle();
    style.name = name;
  }

  // Font family and size
  if (value.fontFamily && value.fontSize) {
    const fontSize = parseFloat(value.fontSize.toString());
    const fontLoaded = await tryLoadFont(value.fontFamily, value.fontWeight);

    if (fontLoaded) {
      style.fontName = fontLoaded;
      style.fontSize = fontSize;
    } else {
      // Fallback to default font
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
      style.fontName = { family: 'Inter', style: 'Regular' };
      style.fontSize = fontSize;
    }
  }

  // Line height
  if (value.lineHeight) {
    const lineHeight = parseFloat(value.lineHeight.toString());
    if (value.lineHeight.toString().includes('%')) {
      style.lineHeight = { value: lineHeight, unit: 'PERCENT' };
    } else {
      style.lineHeight = { value: lineHeight, unit: 'PIXELS' };
    }
  }

  // Letter spacing
  if (value.letterSpacing) {
    const letterSpacing = parseFloat(value.letterSpacing.toString());
    if (value.letterSpacing.toString().includes('%')) {
      style.letterSpacing = { value: letterSpacing, unit: 'PERCENT' };
    } else {
      style.letterSpacing = { value: letterSpacing, unit: 'PIXELS' };
    }
  }

  // Text transform (handled differently in Figma, stored as plugin data)
  if (value.textTransform) {
    style.setPluginData('textTransform', value.textTransform);
  }
}

async function tryLoadFont(family: string, weight?: string | number): Promise<{ family: string; style: string } | null> {
  const weightMap: Record<string, string[]> = {
    '100': ['Thin', 'Hairline'],
    '200': ['ExtraLight', 'Extra Light', 'UltraLight', 'Ultra Light'],
    '300': ['Light'],
    '400': ['Regular', 'Normal'],
    '500': ['Medium'],
    '600': ['SemiBold', 'Semi Bold', 'DemiBold', 'Demi Bold'],
    '700': ['Bold'],
    '800': ['ExtraBold', 'Extra Bold', 'UltraBold', 'Ultra Bold'],
    '900': ['Black', 'Heavy'],
  };

  // Get list of styles to try
  let stylesToTry: string[] = ['Regular'];

  if (weight) {
    const numericWeight = typeof weight === 'number' ? weight.toString() : parseInt(weight.toString()).toString();
    if (weightMap[numericWeight]) {
      stylesToTry = weightMap[numericWeight];
    } else if (typeof weight === 'string') {
      stylesToTry = [weight];
    }
  }

  // Try each style
  for (const style of stylesToTry) {
    try {
      await figma.loadFontAsync({ family, style });
      return { family, style };
    } catch (error) {
      // Try next style
      continue;
    }
  }

  return null;
}

async function processNumericVariable(name: string, type: string, value: string | number) {
  const collection = await getOrCreateVariableCollection('Design Tokens');
  const numericValue = parseFloat(value.toString());

  // Validate numeric value
  if (isNaN(numericValue)) {
    console.warn(`Invalid numeric value for ${name}: ${value}`);
    return;
  }

  // Check if variable already exists
  const existingVariableId = collection.variableIds.find((varId: string) => {
    const existingVar = figma.variables.getVariableById(varId);
    return existingVar?.name === name;
  });

  if (existingVariableId) {
    const existingVar = figma.variables.getVariableById(existingVariableId);
    if (existingVar) {
      existingVar.setValueForMode(collection.modes[0].modeId, numericValue);
      existingVar.description = type;
    }
  } else {
    const newVariable = figma.variables.createVariable(name, collection, 'FLOAT');
    newVariable.setValueForMode(collection.modes[0].modeId, numericValue);
    newVariable.description = type;
  }
}

async function processOpacityToken(name: string, value: number) {
  // Do not create an EffectStyle for opacity as there is no corresponding
  // effect type in Figma. Applying opacity is handled directly on the node's
  // opacity property. Creating an empty style here would be misleading for users.
  // The opacity value is applied directly in applyOpacityToken().
}

async function getOrCreateVariableCollection(name: string) {
  // Use cached collection if it exists and hasn't been removed
  // Note: Check if collection still exists by trying to access its properties
  if (designTokenCollection && designTokenCollection.name === name) {
    try {
      // Try to access a property to ensure it hasn't been deleted
      const _ = designTokenCollection.modes;
      return designTokenCollection;
    } catch (e) {
      // Collection has been removed, need to recreate
      designTokenCollection = null;
    }
  }

  const collections = figma.variables.getLocalVariableCollections();
  let collection = collections.find(c => c.name === name);

  if (!collection) {
    collection = figma.variables.createVariableCollection(name);
  }

  // Cache the collection for subsequent calls
  designTokenCollection = collection;
  return collection;
}

async function applyToken(token: FlattenedToken) {
  if (!figma.currentPage.selection.length) {
    figma.notify('Please select at least one layer');
    return;
  }

  try {
    switch (token.type) {
      case 'color':
        await applyColorToken(token.value as string);
        break;

      case 'typography':
        await applyTypographyToken(token.value as TypographyValue);
        break;

      case 'spacing':
      case 'size':
        await applyNumericToken(token.value as string | number, token.type);
        break;

      case 'opacity':
        await applyOpacityToken(token.value as number);
        break;

      case 'borderRadius':
        await applyBorderRadiusToken(token.value as string | number);
        break;

      default:
        figma.notify(`Token type ${token.type} cannot be directly applied`, { error: true });
        return;
    }

    figma.notify(`Applied ${token.path.join('.')} to ${figma.currentPage.selection.length} layer(s)`);
  } catch (error) {
    console.error('Error applying token:', error);
    figma.notify('Error applying token', { error: true });
  }
}

async function applyColorToken(value: string) {
  const color = parseColor(value);
  if (!color) {
    console.warn(`Invalid color value: ${value}`);
    figma.notify(`Invalid color value: ${value}`, { error: true });
    return;
  }

  for (const node of figma.currentPage.selection) {
    if ('fills' in node) {
      node.fills = [{
        type: 'SOLID',
        color: {
          r: color.r,
          g: color.g,
          b: color.b
        },
        opacity: color.a
      }];
    }
  }
}

async function applyTypographyToken(value: TypographyValue) {
  // Validate required fields
  if (!value.fontFamily || !value.fontSize) {
    console.warn('Invalid typography token: missing fontFamily or fontSize');
    figma.notify('Invalid typography token', { error: true });
    return;
  }

  for (const node of figma.currentPage.selection) {
    if (node.type === 'TEXT') {
      const fontSize = parseFloat(value.fontSize.toString());
      const fontLoaded = await tryLoadFont(value.fontFamily, value.fontWeight);

      if (fontLoaded) {
        node.fontName = fontLoaded;
        node.fontSize = fontSize;

        // Line height
        if (value.lineHeight) {
          const lineHeight = parseFloat(value.lineHeight.toString());
          if (value.lineHeight.toString().includes('%')) {
            node.lineHeight = { value: lineHeight, unit: 'PERCENT' };
          } else {
            node.lineHeight = { value: lineHeight, unit: 'PIXELS' };
          }
        }

        // Letter spacing
        if (value.letterSpacing) {
          const letterSpacing = parseFloat(value.letterSpacing.toString());
          if (value.letterSpacing.toString().includes('%')) {
            node.letterSpacing = { value: letterSpacing, unit: 'PERCENT' };
          } else {
            node.letterSpacing = { value: letterSpacing, unit: 'PIXELS' };
          }
        }
      } else {
        console.error(`Failed to load font ${value.fontFamily}`);
        // Fallback to default font
        await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        node.fontName = { family: 'Inter', style: 'Regular' };
        node.fontSize = fontSize;
      }
    }
  }
}

async function applyNumericToken(value: string | number, type: string) {
  const numericValue = parseFloat(value.toString());

  // Validate numeric value
  if (isNaN(numericValue) || numericValue < 0) {
    console.warn(`Invalid ${type} value: ${value}. Must be a non-negative number.`);
    figma.notify(`Invalid ${type} value.`, { error: true });
    return;
  }

  for (const node of figma.currentPage.selection) {
    if (type === 'spacing') {
      // Apply as padding/spacing in Auto Layout
      if ('paddingLeft' in node) {
        node.paddingLeft = numericValue;
        node.paddingRight = numericValue;
        node.paddingTop = numericValue;
        node.paddingBottom = numericValue;
      }
    } else if (type === 'size') {
      // Apply as width/height
      if ('resize' in node) {
        node.resize(numericValue, numericValue);
      }
    }
  }
}

async function applyOpacityToken(value: number) {
  // Validate opacity value (0-1)
  if (value < 0 || value > 1) {
    console.warn(`Invalid opacity value: ${value}. Must be between 0 and 1.`);
    figma.notify(`Invalid opacity value. Must be between 0 and 1.`, { error: true });
    return;
  }

  for (const node of figma.currentPage.selection) {
    if ('opacity' in node) {
      node.opacity = value;
    }
  }
}

async function applyBorderRadiusToken(value: string | number) {
  const numericValue = parseFloat(value.toString());

  // Validate numeric value
  if (isNaN(numericValue) || numericValue < 0) {
    console.warn(`Invalid border radius value: ${value}. Must be a non-negative number.`);
    figma.notify(`Invalid border radius value.`, { error: true });
    return;
  }

  for (const node of figma.currentPage.selection) {
    if ('cornerRadius' in node && typeof node.cornerRadius !== 'symbol') {
      // Set all corner radii to the same value
      if ('topLeftRadius' in node) {
        node.topLeftRadius = numericValue;
        node.topRightRadius = numericValue;
        node.bottomLeftRadius = numericValue;
        node.bottomRightRadius = numericValue;
      }
    }
  }
}

/**
 * Parse color string (HEX or RGBA) to normalized RGB values (0-1) with alpha
 */
function parseColor(value: string): { r: number; g: number; b: number; a: number } | null {
  // Try HEX format first
  const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value.trim());
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16) / 255,
      g: parseInt(hexMatch[2], 16) / 255,
      b: parseInt(hexMatch[3], 16) / 255,
      a: 1
    };
  }

  // Try RGBA format
  const rgbaMatch = /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i.exec(value.trim());
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]) / 255,
      g: parseInt(rgbaMatch[2]) / 255,
      b: parseInt(rgbaMatch[3]) / 255,
      a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
    };
  }

  return null;
}

/**
 * @deprecated Use parseColor instead
 */
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}