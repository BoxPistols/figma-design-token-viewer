import React, { useState, useEffect } from 'react';
import { Palette, Import, Search, Sun, Moon, Type, Box, RotateCcw } from 'lucide-react';
import type { TokenSet, DesignToken, FlattenedToken, TypographyValue } from './types';
import { defaultTokens } from './defaultTokens';

// localStorage keys
const STORAGE_KEYS = {
  TOKENS: 'figma-design-tokens',
  DARK_MODE: 'figma-design-tokens-dark-mode'
};

// Save tokens to localStorage
const saveTokensToStorage = (tokens: TokenSet) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  } catch (error) {
    console.error('Failed to save tokens to localStorage:', error);
  }
};

// Load tokens from localStorage
const loadTokensFromStorage = (): TokenSet | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TOKENS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load tokens from localStorage:', error);
    return null;
  }
};

// Save dark mode preference
const saveDarkModeToStorage = (isDark: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDark));
  } catch (error) {
    console.error('Failed to save dark mode to localStorage:', error);
  }
};

// Load dark mode preference
const loadDarkModeFromStorage = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return stored ? JSON.parse(stored) : true; // Default to dark mode
  } catch (error) {
    console.error('Failed to load dark mode from localStorage:', error);
    return true;
  }
};

function getTokenBadgeClasses(tokenType: string): string {
  const classMap: Record<string, string> = {
    color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    typography: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    spacing: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    size: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    opacity: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
    borderRadius: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  };
  return classMap[tokenType] || 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300';
}

function flattenTokens(tokens: TokenSet, parentPath: string[] = []): FlattenedToken[] {
  return Object.entries(tokens).reduce<FlattenedToken[]>((acc, [key, value]) => {
    if ('$type' in value && '$value' in value) {
      acc.push({
        path: [...parentPath, key],
        type: value.$type,
        value: value.$value,
        description: value.$description
      });
    } else {
      acc.push(...flattenTokens(value as TokenSet, [...parentPath, key]));
    }
    return acc;
  }, []);
}

function App() {
  // Initialize state from localStorage or defaults
  const [isDarkMode, setIsDarkMode] = useState(() => loadDarkModeFromStorage());
  const [tokens, setTokens] = useState<TokenSet>(() => {
    const stored = loadTokensFromStorage();
    return stored || defaultTokens;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<FlattenedToken | null>(null);

  // Save tokens to localStorage whenever they change
  useEffect(() => {
    saveTokensToStorage(tokens);
  }, [tokens]);

  // Save dark mode preference whenever it changes
  useEffect(() => {
    saveDarkModeToStorage(isDarkMode);
  }, [isDarkMode]);

  const flatTokens = flattenTokens(tokens);
  const filteredTokens = searchQuery
    ? flatTokens.filter(token => 
        token.path.join('.').toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flatTokens;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const tokens = JSON.parse(e.target?.result as string);
          setTokens(tokens);
          parent.postMessage({ pluginMessage: { type: 'import-tokens', tokens } }, '*');
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(tokens, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-tokens.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default tokens? This will overwrite your current tokens.')) {
      setTokens(defaultTokens);
      localStorage.removeItem(STORAGE_KEYS.TOKENS);
    }
  };

  const handleApplyToken = (token: FlattenedToken) => {
    parent.postMessage({
      pluginMessage: {
        type: 'apply-token',
        token: {
          type: token.type,
          value: token.value,
          path: token.path
        }
      }
    }, '*');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Palette className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Design Tokens Manager
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {flatTokens.length} token{flatTokens.length !== 1 ? 's' : ''} loaded
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Reset to default tokens"
            >
              <RotateCcw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-200" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Import Tokens
            </h2>
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
                  <Import className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">Choose JSON file</span>
                </div>
              </label>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Export
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Search Tokens
              </h2>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredTokens.map((token, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedToken(token);
                  handleApplyToken(token);
                }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
              >
                {token.type === 'color' && (
                  <div
                    className="w-full h-20 rounded-md mb-2"
                    style={{ backgroundColor: token.value as string }}
                  />
                )}
                {token.type === 'typography' && (
                  <div className="w-full h-20 flex items-center justify-center mb-2 border border-gray-300 dark:border-gray-600 rounded-md">
                    <Type className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {(token.type === 'spacing' || token.type === 'size') && (
                  <div className="w-full h-20 flex items-center justify-center mb-2 border border-gray-300 dark:border-gray-600 rounded-md">
                    <Box className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {token.type === 'opacity' && (
                  <div className="w-full h-20 mb-2 bg-gradient-to-r from-white to-black rounded-md flex items-center justify-center">
                    <div
                      className="w-full h-full bg-blue-500 rounded-md"
                      style={{ opacity: token.value as number }}
                    />
                  </div>
                )}
                {token.type === 'borderRadius' && (
                  <div className="w-full h-20 flex items-center justify-center mb-2">
                    <div
                      className="w-16 h-16 bg-blue-500"
                      style={{ borderRadius: `${token.value}px` }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-1 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${getTokenBadgeClasses(token.type)}`}>
                    {token.type}
                  </span>
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {token.path.join('.')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {typeof token.value === 'object'
                    ? `${(token.value as TypographyValue).fontFamily} ${(token.value as TypographyValue).fontSize}`
                    : token.value.toString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;