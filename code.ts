import { TokenSet, DesignToken, FlattenedToken, TypographyValue } from './src/types';

figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-tokens') {
    await handleImportedTokens(msg.tokens);
  } else if (msg.type === 'apply-token') {
    await applyToken(msg.token);
  } else if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};

async function handleImportedTokens(tokens: TokenSet) {
  try {
    for (const [key, value] of Object.entries(tokens)) {
      if ('$type' in value && '$value' in value) {
        await processToken(key, value as DesignToken);
      } else {
        await processTokenGroup(key, value as TokenSet);
      }
    }
    figma.notify('Tokens imported successfully');
  } catch (error) {
    console.error('Error importing tokens:', error);
    figma.notify('Error importing tokens', { error: true });
  }
}

async function processTokenGroup(prefix: string, group: TokenSet) {
  for (const [key, value] of Object.entries(group)) {
    const fullKey = `${prefix}/${key}`;
    if ('$type' in value && '$value' in value) {
      await processToken(fullKey, value as DesignToken);
    } else {
      await processTokenGroup(fullKey, value as TokenSet);
    }
  }
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
        await processBorderRadiusVariable(name, token.$value as string | number);
        break;

      default:
        console.warn(`Unsupported token type: ${token.$type}`);
    }
  } catch (error) {
    console.error(`Error processing token ${name}:`, error);
  }
}

async function processColorToken(name: string, value: string) {
  const style = figma.createPaintStyle();
  style.name = name;
  const color = hexToRgb(value);
  if (color) {
    style.paints = [{
      type: 'SOLID',
      color: {
        r: color.r / 255,
        g: color.g / 255,
        b: color.b / 255
      }
    }];
  }
}

async function processTypographyToken(name: string, value: TypographyValue) {
  const style = figma.createTextStyle();
  style.name = name;

  // Font family and size
  if (value.fontFamily && value.fontSize) {
    const fontSize = parseFloat(value.fontSize.toString());
    const fontWeight = parseFontWeight(value.fontWeight);

    try {
      await figma.loadFontAsync({ family: value.fontFamily, style: fontWeight });
      style.fontName = { family: value.fontFamily, style: fontWeight };
      style.fontSize = fontSize;
    } catch (error) {
      console.error(`Failed to load font ${value.fontFamily}:`, error);
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

async function processNumericVariable(name: string, type: string, value: string | number) {
  const collection = await getOrCreateVariableCollection('Design Tokens');
  const numericValue = parseFloat(value.toString());

  const variable = figma.variables.createVariable(name, collection, 'FLOAT');
  variable.setValueForMode(collection.modes[0].modeId, numericValue);
  variable.description = type;
}

async function processOpacityToken(name: string, value: number) {
  const style = figma.createEffectStyle();
  style.name = name;
  style.effects = [];
  // Store opacity as plugin data for use when applying
  style.setPluginData('opacity', value.toString());
}

async function processBorderRadiusVariable(name: string, value: string | number) {
  const collection = await getOrCreateVariableCollection('Design Tokens');
  const numericValue = parseFloat(value.toString());

  const variable = figma.variables.createVariable(name, collection, 'FLOAT');
  variable.setValueForMode(collection.modes[0].modeId, numericValue);
  variable.description = 'borderRadius';
}

async function getOrCreateVariableCollection(name: string) {
  const collections = figma.variables.getLocalVariableCollections();
  let collection = collections.find(c => c.name === name);

  if (!collection) {
    collection = figma.variables.createVariableCollection(name);
  }

  return collection;
}

function parseFontWeight(weight?: string | number): string {
  if (!weight) return 'Regular';

  const weightMap: Record<string, string> = {
    '100': 'Thin',
    '200': 'Extra Light',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'Semi Bold',
    '700': 'Bold',
    '800': 'Extra Bold',
    '900': 'Black',
  };

  if (typeof weight === 'number') {
    return weightMap[weight.toString()] || 'Regular';
  }

  const numericWeight = parseInt(weight);
  if (!isNaN(numericWeight)) {
    return weightMap[numericWeight.toString()] || 'Regular';
  }

  // Return as-is if it's already a style name
  return weight;
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
  const color = hexToRgb(value);
  if (!color) return;

  for (const node of figma.currentPage.selection) {
    if ('fills' in node) {
      node.fills = [{
        type: 'SOLID',
        color: {
          r: color.r / 255,
          g: color.g / 255,
          b: color.b / 255
        }
      }];
    }
  }
}

async function applyTypographyToken(value: TypographyValue) {
  for (const node of figma.currentPage.selection) {
    if (node.type === 'TEXT') {
      const fontSize = parseFloat(value.fontSize.toString());
      const fontWeight = parseFontWeight(value.fontWeight);

      try {
        await figma.loadFontAsync({ family: value.fontFamily, style: fontWeight });
        node.fontName = { family: value.fontFamily, style: fontWeight };
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
      } catch (error) {
        console.error(`Failed to apply typography:`, error);
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
  for (const node of figma.currentPage.selection) {
    if ('opacity' in node) {
      node.opacity = value;
    }
  }
}

async function applyBorderRadiusToken(value: string | number) {
  const numericValue = parseFloat(value.toString());

  for (const node of figma.currentPage.selection) {
    if ('cornerRadius' in node && typeof node.cornerRadius !== 'symbol') {
      node.cornerRadius = numericValue;
    }
  }
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}