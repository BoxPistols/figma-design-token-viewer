import { TokenSet } from './types';

/**
 * Design Token Patterns following MUI7 and Material Design 2 specifications
 * Each pattern is a complete, independent token set
 */

// Material Design 2 Default Pattern
export const materialDesign2Pattern: TokenSet = {
  // ===== COLOR TOKENS =====
  colors: {
    primary: {
      main: {
        $type: 'color',
        $value: '#1976D2',
        $description: 'Primary main color (MD2 Blue 700)'
      },
      light: {
        $type: 'color',
        $value: '#42A5F5',
        $description: 'Primary light color (MD2 Blue 400)'
      },
      dark: {
        $type: 'color',
        $value: '#1565C0',
        $description: 'Primary dark color (MD2 Blue 800)'
      },
      contrastText: {
        $type: 'color',
        $value: '#FFFFFF',
        $description: 'Text color on primary background'
      }
    },
    secondary: {
      main: {
        $type: 'color',
        $value: '#DC004E',
        $description: 'Secondary main color (MD2 Pink A400)'
      },
      light: {
        $type: 'color',
        $value: '#F50057',
        $description: 'Secondary light color (MD2 Pink A200)'
      },
      dark: {
        $type: 'color',
        $value: '#C51162',
        $description: 'Secondary dark color (MD2 Pink A700)'
      },
      contrastText: {
        $type: 'color',
        $value: '#FFFFFF',
        $description: 'Text color on secondary background'
      }
    },
    error: {
      main: {
        $type: 'color',
        $value: '#D32F2F',
        $description: 'Error main color (MD2 Red 700)'
      },
      light: {
        $type: 'color',
        $value: '#EF5350',
        $description: 'Error light color (MD2 Red 400)'
      },
      dark: {
        $type: 'color',
        $value: '#C62828',
        $description: 'Error dark color (MD2 Red 800)'
      },
      contrastText: {
        $type: 'color',
        $value: '#FFFFFF'
      }
    },
    warning: {
      main: {
        $type: 'color',
        $value: '#ED6C02',
        $description: 'Warning main color (MD2 Orange 700)'
      },
      light: {
        $type: 'color',
        $value: '#FF9800',
        $description: 'Warning light color (MD2 Orange 500)'
      },
      dark: {
        $type: 'color',
        $value: '#E65100',
        $description: 'Warning dark color (MD2 Orange 900)'
      },
      contrastText: {
        $type: 'color',
        $value: '#FFFFFF'
      }
    },
    info: {
      main: {
        $type: 'color',
        $value: '#0288D1',
        $description: 'Info main color (MD2 Light Blue 700)'
      },
      light: {
        $type: 'color',
        $value: '#03A9F4',
        $description: 'Info light color (MD2 Light Blue 500)'
      },
      dark: {
        $type: 'color',
        $value: '#01579B',
        $description: 'Info dark color (MD2 Light Blue 900)'
      },
      contrastText: {
        $type: 'color',
        $value: '#FFFFFF'
      }
    },
    success: {
      main: {
        $type: 'color',
        $value: '#2E7D32',
        $description: 'Success main color (MD2 Green 700)'
      },
      light: {
        $type: 'color',
        $value: '#4CAF50',
        $description: 'Success light color (MD2 Green 500)'
      },
      dark: {
        $type: 'color',
        $value: '#1B5E20',
        $description: 'Success dark color (MD2 Green 900)'
      },
      contrastText: {
        $type: 'color',
        $value: '#FFFFFF'
      }
    },
    background: {
      light: {
        default: {
          $type: 'color',
          $value: '#FFFFFF',
          $description: 'Light mode default background'
        },
        paper: {
          $type: 'color',
          $value: '#FFFFFF',
          $description: 'Light mode paper background'
        }
      },
      dark: {
        default: {
          $type: 'color',
          $value: '#121212',
          $description: 'Dark mode default background'
        },
        paper: {
          $type: 'color',
          $value: '#1E1E1E',
          $description: 'Dark mode paper background'
        }
      }
    },
    text: {
      light: {
        primary: {
          $type: 'color',
          $value: 'rgba(0, 0, 0, 0.87)',
          $description: 'Light mode primary text'
        },
        secondary: {
          $type: 'color',
          $value: 'rgba(0, 0, 0, 0.6)',
          $description: 'Light mode secondary text'
        },
        disabled: {
          $type: 'color',
          $value: 'rgba(0, 0, 0, 0.38)',
          $description: 'Light mode disabled text'
        }
      },
      dark: {
        primary: {
          $type: 'color',
          $value: '#FFFFFF',
          $description: 'Dark mode primary text'
        },
        secondary: {
          $type: 'color',
          $value: 'rgba(255, 255, 255, 0.7)',
          $description: 'Dark mode secondary text'
        },
        disabled: {
          $type: 'color',
          $value: 'rgba(255, 255, 255, 0.5)',
          $description: 'Dark mode disabled text'
        }
      }
    },
    divider: {
      light: {
        $type: 'color',
        $value: 'rgba(0, 0, 0, 0.12)',
        $description: 'Light mode divider'
      },
      dark: {
        $type: 'color',
        $value: 'rgba(255, 255, 255, 0.12)',
        $description: 'Dark mode divider'
      }
    },
    action: {
      light: {
        active: {
          $type: 'color',
          $value: 'rgba(0, 0, 0, 0.54)'
        },
        hover: {
          $type: 'color',
          $value: 'rgba(0, 0, 0, 0.04)'
        },
        selected: {
          $type: 'color',
          $value: 'rgba(0, 0, 0, 0.08)'
        },
        disabled: {
          $type: 'color',
          $value: 'rgba(0, 0, 0, 0.26)'
        },
        disabledBackground: {
          $type: 'color',
          $value: 'rgba(0, 0, 0, 0.12)'
        }
      },
      dark: {
        active: {
          $type: 'color',
          $value: '#FFFFFF'
        },
        hover: {
          $type: 'color',
          $value: 'rgba(255, 255, 255, 0.08)'
        },
        selected: {
          $type: 'color',
          $value: 'rgba(255, 255, 255, 0.16)'
        },
        disabled: {
          $type: 'color',
          $value: 'rgba(255, 255, 255, 0.3)'
        },
        disabledBackground: {
          $type: 'color',
          $value: 'rgba(255, 255, 255, 0.12)'
        }
      }
    }
  }
};

// Typography tokens following MUI7 standards
export const typographyTokens: TokenSet = {
  typography: {
    h1: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '96',
        fontWeight: '300',
        lineHeight: '112',
        letterSpacing: '-1.5'
      },
      $description: 'MUI h1 heading'
    },
    h2: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '60',
        fontWeight: '300',
        lineHeight: '72',
        letterSpacing: '-0.5'
      },
      $description: 'MUI h2 heading'
    },
    h3: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '48',
        fontWeight: '400',
        lineHeight: '56',
        letterSpacing: '0'
      },
      $description: 'MUI h3 heading'
    },
    h4: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '34',
        fontWeight: '400',
        lineHeight: '42',
        letterSpacing: '0.25'
      },
      $description: 'MUI h4 heading'
    },
    h5: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '24',
        fontWeight: '400',
        lineHeight: '32',
        letterSpacing: '0'
      },
      $description: 'MUI h5 heading'
    },
    h6: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '20',
        fontWeight: '500',
        lineHeight: '32',
        letterSpacing: '0.15'
      },
      $description: 'MUI h6 heading'
    },
    subtitle1: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '16',
        fontWeight: '400',
        lineHeight: '28',
        letterSpacing: '0.15'
      },
      $description: 'MUI subtitle1'
    },
    subtitle2: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '14',
        fontWeight: '500',
        lineHeight: '22',
        letterSpacing: '0.1'
      },
      $description: 'MUI subtitle2'
    },
    body1: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '16',
        fontWeight: '400',
        lineHeight: '24',
        letterSpacing: '0.5'
      },
      $description: 'MUI body1'
    },
    body2: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '14',
        fontWeight: '400',
        lineHeight: '20',
        letterSpacing: '0.25'
      },
      $description: 'MUI body2'
    },
    button: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '14',
        fontWeight: '500',
        lineHeight: '24',
        letterSpacing: '1.25',
        textTransform: 'uppercase'
      },
      $description: 'MUI button text'
    },
    caption: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '12',
        fontWeight: '400',
        lineHeight: '20',
        letterSpacing: '0.4'
      },
      $description: 'MUI caption'
    },
    overline: {
      $type: 'typography',
      $value: {
        fontFamily: 'Roboto',
        fontSize: '12',
        fontWeight: '400',
        lineHeight: '32',
        letterSpacing: '1',
        textTransform: 'uppercase'
      },
      $description: 'MUI overline'
    }
  }
};

// Spacing tokens following MUI 8px base
export const spacingTokens: TokenSet = {
  spacing: {
    xs: {
      $type: 'spacing',
      $value: '4',
      $description: '0.5 * 8px'
    },
    sm: {
      $type: 'spacing',
      $value: '8',
      $description: '1 * 8px'
    },
    md: {
      $type: 'spacing',
      $value: '16',
      $description: '2 * 8px'
    },
    lg: {
      $type: 'spacing',
      $value: '24',
      $description: '3 * 8px'
    },
    xl: {
      $type: 'spacing',
      $value: '32',
      $description: '4 * 8px'
    },
    xxl: {
      $type: 'spacing',
      $value: '40',
      $description: '5 * 8px'
    },
    xxxl: {
      $type: 'spacing',
      $value: '48',
      $description: '6 * 8px'
    }
  }
};

// Size tokens
export const sizeTokens: TokenSet = {
  sizes: {
    icon: {
      small: {
        $type: 'size',
        $value: '20',
        $description: 'Small icon size'
      },
      medium: {
        $type: 'size',
        $value: '24',
        $description: 'Medium icon size (default)'
      },
      large: {
        $type: 'size',
        $value: '35',
        $description: 'Large icon size'
      }
    },
    button: {
      small: {
        $type: 'size',
        $value: '30.75',
        $description: 'Small button height'
      },
      medium: {
        $type: 'size',
        $value: '36.5',
        $description: 'Medium button height (default)'
      },
      large: {
        $type: 'size',
        $value: '42.25',
        $description: 'Large button height'
      }
    }
  }
};

// Opacity tokens
export const opacityTokens: TokenSet = {
  opacity: {
    disabled: {
      $type: 'opacity',
      $value: 0.38,
      $description: 'Disabled state opacity'
    },
    hover: {
      $type: 'opacity',
      $value: 0.04,
      $description: 'Hover overlay opacity'
    },
    selected: {
      $type: 'opacity',
      $value: 0.08,
      $description: 'Selected overlay opacity'
    },
    focus: {
      $type: 'opacity',
      $value: 0.12,
      $description: 'Focus overlay opacity'
    },
    activated: {
      $type: 'opacity',
      $value: 0.12,
      $description: 'Activated overlay opacity'
    }
  }
};

// Border radius tokens
export const borderRadiusTokens: TokenSet = {
  borderRadius: {
    small: {
      $type: 'borderRadius',
      $value: '4',
      $description: 'Small border radius'
    },
    medium: {
      $type: 'borderRadius',
      $value: '4',
      $description: 'Medium border radius (default)'
    },
    large: {
      $type: 'borderRadius',
      $value: '8',
      $description: 'Large border radius'
    },
    round: {
      $type: 'borderRadius',
      $value: '50',
      $description: 'Round border radius (percentage)'
    }
  }
};

// Combined default pattern (MUI7 + MD2)
export const defaultPattern: TokenSet = {
  ...materialDesign2Pattern,
  ...typographyTokens,
  ...spacingTokens,
  ...sizeTokens,
  ...opacityTokens,
  ...borderRadiusTokens
};

// Alternative pattern: Modern minimal
export const modernMinimalPattern: TokenSet = {
  colors: {
    primary: {
      main: {
        $type: 'color',
        $value: '#000000',
        $description: 'Pure black primary'
      },
      light: {
        $type: 'color',
        $value: '#424242'
      },
      dark: {
        $type: 'color',
        $value: '#000000'
      },
      contrastText: {
        $type: 'color',
        $value: '#FFFFFF'
      }
    },
    secondary: {
      main: {
        $type: 'color',
        $value: '#F5F5F5',
        $description: 'Light gray secondary'
      },
      light: {
        $type: 'color',
        $value: '#FAFAFA'
      },
      dark: {
        $type: 'color',
        $value: '#EEEEEE'
      },
      contrastText: {
        $type: 'color',
        $value: '#000000'
      }
    },
    error: {
      main: { $type: 'color', $value: '#000000' },
      light: { $type: 'color', $value: '#424242' },
      dark: { $type: 'color', $value: '#000000' },
      contrastText: { $type: 'color', $value: '#FFFFFF' }
    },
    warning: {
      main: { $type: 'color', $value: '#757575' },
      light: { $type: 'color', $value: '#9E9E9E' },
      dark: { $type: 'color', $value: '#616161' },
      contrastText: { $type: 'color', $value: '#FFFFFF' }
    },
    info: {
      main: { $type: 'color', $value: '#616161' },
      light: { $type: 'color', $value: '#757575' },
      dark: { $type: 'color', $value: '#424242' },
      contrastText: { $type: 'color', $value: '#FFFFFF' }
    },
    success: {
      main: { $type: 'color', $value: '#424242' },
      light: { $type: 'color', $value: '#616161' },
      dark: { $type: 'color', $value: '#212121' },
      contrastText: { $type: 'color', $value: '#FFFFFF' }
    },
    background: {
      light: {
        default: { $type: 'color', $value: '#FFFFFF' },
        paper: { $type: 'color', $value: '#FAFAFA' }
      },
      dark: {
        default: { $type: 'color', $value: '#000000' },
        paper: { $type: 'color', $value: '#121212' }
      }
    },
    text: {
      light: {
        primary: { $type: 'color', $value: '#000000' },
        secondary: { $type: 'color', $value: '#757575' },
        disabled: { $type: 'color', $value: '#BDBDBD' }
      },
      dark: {
        primary: { $type: 'color', $value: '#FFFFFF' },
        secondary: { $type: 'color', $value: '#BDBDBD' },
        disabled: { $type: 'color', $value: '#757575' }
      }
    },
    divider: {
      light: { $type: 'color', $value: '#E0E0E0' },
      dark: { $type: 'color', $value: '#424242' }
    },
    action: {
      light: {
        active: { $type: 'color', $value: '#000000' },
        hover: { $type: 'color', $value: 'rgba(0, 0, 0, 0.04)' },
        selected: { $type: 'color', $value: 'rgba(0, 0, 0, 0.08)' },
        disabled: { $type: 'color', $value: 'rgba(0, 0, 0, 0.26)' },
        disabledBackground: { $type: 'color', $value: 'rgba(0, 0, 0, 0.12)' }
      },
      dark: {
        active: { $type: 'color', $value: '#FFFFFF' },
        hover: { $type: 'color', $value: 'rgba(255, 255, 255, 0.08)' },
        selected: { $type: 'color', $value: 'rgba(255, 255, 255, 0.16)' },
        disabled: { $type: 'color', $value: 'rgba(255, 255, 255, 0.3)' },
        disabledBackground: { $type: 'color', $value: 'rgba(255, 255, 255, 0.12)' }
      }
    }
  },
  ...typographyTokens,
  ...spacingTokens,
  ...sizeTokens,
  ...opacityTokens,
  borderRadius: {
    small: { $type: 'borderRadius', $value: '0' },
    medium: { $type: 'borderRadius', $value: '0' },
    large: { $type: 'borderRadius', $value: '2' },
    round: { $type: 'borderRadius', $value: '0' }
  }
};

// Alternative pattern: Vibrant
export const vibrantPattern: TokenSet = {
  colors: {
    primary: {
      main: { $type: 'color', $value: '#6200EA', $description: 'Deep Purple A700' },
      light: { $type: 'color', $value: '#B388FF' },
      dark: { $type: 'color', $value: '#4527A0' },
      contrastText: { $type: 'color', $value: '#FFFFFF' }
    },
    secondary: {
      main: { $type: 'color', $value: '#00E676', $description: 'Green A400' },
      light: { $type: 'color', $value: '#69F0AE' },
      dark: { $type: 'color', $value: '#00C853' },
      contrastText: { $type: 'color', $value: '#000000' }
    },
    error: {
      main: { $type: 'color', $value: '#FF1744', $description: 'Red A400' },
      light: { $type: 'color', $value: '#FF5252' },
      dark: { $type: 'color', $value: '#D50000' },
      contrastText: { $type: 'color', $value: '#FFFFFF' }
    },
    warning: {
      main: { $type: 'color', $value: '#FFAB00', $description: 'Amber A700' },
      light: { $type: 'color', $value: '#FFD740' },
      dark: { $type: 'color', $value: '#FF8F00' },
      contrastText: { $type: 'color', $value: '#000000' }
    },
    info: {
      main: { $type: 'color', $value: '#00B0FF', $description: 'Light Blue A400' },
      light: { $type: 'color', $value: '#40C4FF' },
      dark: { $type: 'color', $value: '#0091EA' },
      contrastText: { $type: 'color', $value: '#000000' }
    },
    success: {
      main: { $type: 'color', $value: '#00C853', $description: 'Green A700' },
      light: { $type: 'color', $value: '#69F0AE' },
      dark: { $type: 'color', $value: '#00A152' },
      contrastText: { $type: 'color', $value: '#000000' }
    },
    background: {
      light: {
        default: { $type: 'color', $value: '#FAFAFA' },
        paper: { $type: 'color', $value: '#FFFFFF' }
      },
      dark: {
        default: { $type: 'color', $value: '#0A0A0A' },
        paper: { $type: 'color', $value: '#1A1A1A' }
      }
    },
    text: {
      light: {
        primary: { $type: 'color', $value: 'rgba(0, 0, 0, 0.87)' },
        secondary: { $type: 'color', $value: 'rgba(0, 0, 0, 0.6)' },
        disabled: { $type: 'color', $value: 'rgba(0, 0, 0, 0.38)' }
      },
      dark: {
        primary: { $type: 'color', $value: '#FFFFFF' },
        secondary: { $type: 'color', $value: 'rgba(255, 255, 255, 0.7)' },
        disabled: { $type: 'color', $value: 'rgba(255, 255, 255, 0.5)' }
      }
    },
    divider: {
      light: { $type: 'color', $value: 'rgba(0, 0, 0, 0.12)' },
      dark: { $type: 'color', $value: 'rgba(255, 255, 255, 0.12)' }
    },
    action: {
      light: {
        active: { $type: 'color', $value: 'rgba(0, 0, 0, 0.54)' },
        hover: { $type: 'color', $value: 'rgba(0, 0, 0, 0.04)' },
        selected: { $type: 'color', $value: 'rgba(0, 0, 0, 0.08)' },
        disabled: { $type: 'color', $value: 'rgba(0, 0, 0, 0.26)' },
        disabledBackground: { $type: 'color', $value: 'rgba(0, 0, 0, 0.12)' }
      },
      dark: {
        active: { $type: 'color', $value: '#FFFFFF' },
        hover: { $type: 'color', $value: 'rgba(255, 255, 255, 0.08)' },
        selected: { $type: 'color', $value: 'rgba(255, 255, 255, 0.16)' },
        disabled: { $type: 'color', $value: 'rgba(255, 255, 255, 0.3)' },
        disabledBackground: { $type: 'color', $value: 'rgba(255, 255, 255, 0.12)' }
      }
    }
  },
  ...typographyTokens,
  ...spacingTokens,
  ...sizeTokens,
  ...opacityTokens,
  borderRadius: {
    small: { $type: 'borderRadius', $value: '8' },
    medium: { $type: 'borderRadius', $value: '12' },
    large: { $type: 'borderRadius', $value: '16' },
    round: { $type: 'borderRadius', $value: '50' }
  }
};

// Pattern registry for easy access
export const tokenPatterns = {
  'material-design-2': { name: 'Material Design 2 (Default)', tokens: defaultPattern },
  'modern-minimal': { name: 'Modern Minimal', tokens: modernMinimalPattern },
  'vibrant': { name: 'Vibrant', tokens: vibrantPattern }
};

export type PatternKey = keyof typeof tokenPatterns;
