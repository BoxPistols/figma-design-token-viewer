import { TokenSet } from './types';

// Default design tokens with Dark/Light mode support
export const defaultTokens: TokenSet = {
  colors: {
    light: {
      background: {
        primary: {
          $type: 'color',
          $value: '#FFFFFF',
          $description: 'Light mode primary background'
        },
        secondary: {
          $type: 'color',
          $value: '#F9FAFB',
          $description: 'Light mode secondary background'
        },
        tertiary: {
          $type: 'color',
          $value: '#F3F4F6'
        }
      },
      text: {
        primary: {
          $type: 'color',
          $value: '#111827',
          $description: 'Light mode primary text'
        },
        secondary: {
          $type: 'color',
          $value: '#6B7280',
          $description: 'Light mode secondary text'
        },
        tertiary: {
          $type: 'color',
          $value: '#9CA3AF'
        }
      },
      border: {
        default: {
          $type: 'color',
          $value: '#E5E7EB'
        },
        hover: {
          $type: 'color',
          $value: '#D1D5DB'
        }
      }
    },
    dark: {
      background: {
        primary: {
          $type: 'color',
          $value: '#111827',
          $description: 'Dark mode primary background'
        },
        secondary: {
          $type: 'color',
          $value: '#1F2937',
          $description: 'Dark mode secondary background'
        },
        tertiary: {
          $type: 'color',
          $value: '#374151'
        }
      },
      text: {
        primary: {
          $type: 'color',
          $value: '#F9FAFB',
          $description: 'Dark mode primary text'
        },
        secondary: {
          $type: 'color',
          $value: '#D1D5DB',
          $description: 'Dark mode secondary text'
        },
        tertiary: {
          $type: 'color',
          $value: '#9CA3AF'
        }
      },
      border: {
        default: {
          $type: 'color',
          $value: '#374151'
        },
        hover: {
          $type: 'color',
          $value: '#4B5563'
        }
      }
    },
    brand: {
      primary: {
        $type: 'color',
        $value: '#3B82F6',
        $description: 'Primary brand color'
      },
      secondary: {
        $type: 'color',
        $value: '#8B5CF6',
        $description: 'Secondary brand color'
      },
      accent: {
        $type: 'color',
        $value: '#F59E0B',
        $description: 'Accent color'
      }
    },
    semantic: {
      success: {
        $type: 'color',
        $value: '#10B981',
        $description: 'Success state'
      },
      warning: {
        $type: 'color',
        $value: '#F59E0B',
        $description: 'Warning state'
      },
      error: {
        $type: 'color',
        $value: '#EF4444',
        $description: 'Error state'
      },
      info: {
        $type: 'color',
        $value: '#3B82F6',
        $description: 'Info state'
      }
    }
  },
  typography: {
    display: {
      large: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '48',
          fontWeight: '700',
          lineHeight: '56',
          letterSpacing: '-1'
        },
        $description: 'Large display heading'
      },
      medium: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '36',
          fontWeight: '700',
          lineHeight: '44',
          letterSpacing: '-0.5'
        }
      },
      small: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '30',
          fontWeight: '600',
          lineHeight: '38'
        }
      }
    },
    heading: {
      h1: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '24',
          fontWeight: '700',
          lineHeight: '32'
        }
      },
      h2: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '20',
          fontWeight: '600',
          lineHeight: '28'
        }
      },
      h3: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '18',
          fontWeight: '600',
          lineHeight: '26'
        }
      },
      h4: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '16',
          fontWeight: '600',
          lineHeight: '24'
        }
      }
    },
    body: {
      large: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '18',
          fontWeight: '400',
          lineHeight: '28'
        }
      },
      medium: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '16',
          fontWeight: '400',
          lineHeight: '24'
        }
      },
      small: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '14',
          fontWeight: '400',
          lineHeight: '20'
        }
      }
    },
    label: {
      large: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '14',
          fontWeight: '500',
          lineHeight: '20'
        }
      },
      medium: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '12',
          fontWeight: '500',
          lineHeight: '16'
        }
      },
      small: {
        $type: 'typography',
        $value: {
          fontFamily: 'Inter',
          fontSize: '11',
          fontWeight: '500',
          lineHeight: '16'
        }
      }
    }
  },
  spacing: {
    none: {
      $type: 'spacing',
      $value: '0'
    },
    xxs: {
      $type: 'spacing',
      $value: '4'
    },
    xs: {
      $type: 'spacing',
      $value: '8'
    },
    sm: {
      $type: 'spacing',
      $value: '12'
    },
    md: {
      $type: 'spacing',
      $value: '16'
    },
    lg: {
      $type: 'spacing',
      $value: '24'
    },
    xl: {
      $type: 'spacing',
      $value: '32'
    },
    xxl: {
      $type: 'spacing',
      $value: '48'
    },
    xxxl: {
      $type: 'spacing',
      $value: '64'
    }
  },
  sizes: {
    icon: {
      xs: {
        $type: 'size',
        $value: '12'
      },
      sm: {
        $type: 'size',
        $value: '16'
      },
      md: {
        $type: 'size',
        $value: '24'
      },
      lg: {
        $type: 'size',
        $value: '32'
      },
      xl: {
        $type: 'size',
        $value: '48'
      }
    },
    button: {
      sm: {
        $type: 'size',
        $value: '32'
      },
      md: {
        $type: 'size',
        $value: '40'
      },
      lg: {
        $type: 'size',
        $value: '48'
      }
    }
  },
  opacity: {
    transparent: {
      $type: 'opacity',
      $value: 0,
      $description: 'Fully transparent'
    },
    disabled: {
      $type: 'opacity',
      $value: 0.4,
      $description: 'Disabled state'
    },
    hover: {
      $type: 'opacity',
      $value: 0.8,
      $description: 'Hover state'
    },
    overlay: {
      $type: 'opacity',
      $value: 0.6,
      $description: 'Overlay background'
    },
    full: {
      $type: 'opacity',
      $value: 1,
      $description: 'Fully opaque'
    }
  },
  borderRadius: {
    none: {
      $type: 'borderRadius',
      $value: '0'
    },
    sm: {
      $type: 'borderRadius',
      $value: '4'
    },
    md: {
      $type: 'borderRadius',
      $value: '8'
    },
    lg: {
      $type: 'borderRadius',
      $value: '12'
    },
    xl: {
      $type: 'borderRadius',
      $value: '16'
    },
    xxl: {
      $type: 'borderRadius',
      $value: '24'
    },
    full: {
      $type: 'borderRadius',
      $value: '9999',
      $description: 'Fully rounded (pill shape)'
    }
  }
};
