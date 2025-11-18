import React, { useState, useEffect } from 'react';
import {
  Palette, Import, Search, Sun, Moon, Type, Box, RotateCcw,
  Grid3x3, List, Table as TableIcon, Download, Trash2, Layers
} from 'lucide-react';
import type { TokenSet, DesignToken, FlattenedToken, TypographyValue } from './types';
import { tokenPatterns, PatternKey } from './tokenPatterns';

// localStorage keys
const STORAGE_KEYS = {
  TOKENS: 'figma-design-tokens-v2',
  DARK_MODE: 'figma-design-tokens-dark-mode',
  VIEW_MODE: 'figma-design-tokens-view-mode',
  PATTERN: 'figma-design-tokens-pattern'
};

type ViewMode = 'card-minimum' | 'card-detailed' | 'table';

// Save/Load functions
const saveToStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
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

// Group tokens by type
function groupTokensByType(tokens: FlattenedToken[]): Record<string, FlattenedToken[]> {
  return tokens.reduce((acc, token) => {
    if (!acc[token.type]) {
      acc[token.type] = [];
    }
    acc[token.type].push(token);
    return acc;
  }, {} as Record<string, FlattenedToken[]>);
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => loadFromStorage(STORAGE_KEYS.DARK_MODE, true));
  const [viewMode, setViewMode] = useState<ViewMode>(() => loadFromStorage(STORAGE_KEYS.VIEW_MODE, 'card-minimum'));
  const [currentPattern, setCurrentPattern] = useState<PatternKey>(() =>
    loadFromStorage(STORAGE_KEYS.PATTERN, 'material-design-2')
  );
  const [tokens, setTokens] = useState<TokenSet>(() => {
    const stored = loadFromStorage<TokenSet | null>(STORAGE_KEYS.TOKENS, null);
    return stored || tokenPatterns[currentPattern].tokens;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<FlattenedToken | null>(null);

  // Listen for messages from plugin (exported tokens)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg && msg.type === 'exported-tokens') {
        setTokens(msg.tokens);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TOKENS, tokens);
  }, [tokens]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DARK_MODE, isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PATTERN, currentPattern);
  }, [currentPattern]);

  const flatTokens = flattenTokens(tokens);
  const filteredTokens = searchQuery
    ? flatTokens.filter(token =>
        token.path.join('.').toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flatTokens;

  const groupedTokens = groupTokensByType(filteredTokens);

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
    a.download = `design-tokens-${currentPattern}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportFromFigma = () => {
    parent.postMessage({ pluginMessage: { type: 'export-tokens' } }, '*');
  };

  const handleReset = () => {
    if (confirm('Reset to default tokens? This will overwrite your current tokens.')) {
      setTokens(tokenPatterns[currentPattern].tokens);
    }
  };

  const handleClear = () => {
    if (confirm('Delete all tokens? This action cannot be undone.')) {
      setTokens({});
      localStorage.removeItem(STORAGE_KEYS.TOKENS);
    }
  };

  const handleChangePattern = (pattern: PatternKey) => {
    if (confirm(`Switch to ${tokenPatterns[pattern].name}? This will replace your current tokens.`)) {
      setCurrentPattern(pattern);
      setTokens(tokenPatterns[pattern].tokens);
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

  // Render token preview
  const renderTokenPreview = (token: FlattenedToken, showDetails: boolean = false) => {
    if (token.type === 'color') {
      return (
        <div
          className={`w-full ${showDetails ? 'h-24' : 'h-16'} rounded-md`}
          style={{ backgroundColor: token.value as string }}
        />
      );
    }
    if (token.type === 'typography') {
      return (
        <div className="w-full h-16 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md">
          <Type className="w-8 h-8 text-gray-400" />
        </div>
      );
    }
    if (token.type === 'spacing' || token.type === 'size') {
      return (
        <div className="w-full h-16 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md">
          <Box className="w-8 h-8 text-gray-400" />
        </div>
      );
    }
    if (token.type === 'opacity') {
      return (
        <div className="w-full h-16 bg-gradient-to-r from-white to-black rounded-md flex items-center justify-center">
          <div
            className="w-full h-full bg-blue-500 rounded-md"
            style={{ opacity: token.value as number }}
          />
        </div>
      );
    }
    if (token.type === 'borderRadius') {
      return (
        <div className="w-full h-16 flex items-center justify-center">
          <div
            className="w-12 h-12 bg-blue-500"
            style={{ borderRadius: `${token.value}px` }}
          />
        </div>
      );
    }
    return null;
  };

  // Card Minimum View
  const renderCardMinimum = (token: FlattenedToken, index: number) => (
    <div
      key={index}
      onClick={() => {
        setSelectedToken(token);
        handleApplyToken(token);
      }}
      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
    >
      {renderTokenPreview(token)}
      <div className="mt-2">
        <span className={`text-xs px-2 py-0.5 rounded ${getTokenBadgeClasses(token.type)}`}>
          {token.type}
        </span>
      </div>
      <div className="text-sm font-medium mt-1 truncate dark:text-white">
        {token.path[token.path.length - 1]}
      </div>
    </div>
  );

  // Card Detailed View
  const renderCardDetailed = (token: FlattenedToken, index: number) => (
    <div
      key={index}
      onClick={() => {
        setSelectedToken(token);
        handleApplyToken(token);
      }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
    >
      {renderTokenPreview(token, true)}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${getTokenBadgeClasses(token.type)}`}>
            {token.type}
          </span>
        </div>
        <div className="text-sm font-semibold dark:text-white">
          {token.path.join('.')}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {typeof token.value === 'object'
            ? JSON.stringify(token.value, null, 2)
            : token.value.toString()}
        </div>
        {token.description && (
          <div className="text-xs text-gray-500 dark:text-gray-500 italic">
            {token.description}
          </div>
        )}
      </div>
    </div>
  );

  // Table View
  const renderTable = (tokens: FlattenedToken[]) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Preview</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Path</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {tokens.map((token, index) => (
            <tr
              key={index}
              onClick={() => {
                setSelectedToken(token);
                handleApplyToken(token);
              }}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <td className="px-4 py-3">
                {token.type === 'color' && (
                  <div
                    className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: token.value as string }}
                  />
                )}
                {token.type === 'opacity' && (
                  <div className="w-10 h-10 bg-gradient-to-r from-white to-black rounded flex items-center justify-center border border-gray-300 dark:border-gray-600">
                    <div
                      className="w-full h-full bg-blue-500 rounded"
                      style={{ opacity: token.value as number }}
                    />
                  </div>
                )}
                {token.type === 'borderRadius' && (
                  <div className="w-10 h-10 flex items-center justify-center">
                    <div
                      className="w-8 h-8 bg-blue-500"
                      style={{ borderRadius: `${token.value}px` }}
                    />
                  </div>
                )}
                {(token.type === 'typography' || token.type === 'spacing' || token.type === 'size') && (
                  <div className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded">
                    {token.type === 'typography' ? <Type className="w-5 h-5 text-gray-400" /> : <Box className="w-5 h-5 text-gray-400" />}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded ${getTokenBadgeClasses(token.type)}`}>
                  {token.type}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-mono dark:text-gray-300">
                {token.path.join('.')}
              </td>
              <td className="px-4 py-3 text-sm font-mono dark:text-gray-300">
                {typeof token.value === 'object'
                  ? JSON.stringify(token.value)
                  : token.value.toString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {token.description || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Palette className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Design Tokens Manager
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {flatTokens.length} token{flatTokens.length !== 1 ? 's' : ''} · {tokenPatterns[currentPattern].name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Reset to default"
            >
              <RotateCcw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Clear all tokens"
            >
              <Trash2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Import/Export */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 dark:text-white">Import/Export</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 text-sm">
                    <Import className="w-4 h-4 mr-2" />
                    <span className="dark:text-gray-300">Import JSON</span>
                  </div>
                </label>
                <button
                  onClick={handleExport}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </button>
              </div>
              <button
                onClick={handleExportFromFigma}
                className="w-full flex items-center justify-center px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                title="Export tokens from current Figma file"
              >
                <Palette className="w-4 h-4 mr-2" />
                Export from Figma
              </button>
            </div>
          </div>

          {/* Pattern Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 dark:text-white">Pattern</h3>
            <select
              value={currentPattern}
              onChange={(e) => handleChangePattern(e.target.value as PatternKey)}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
            >
              {(Object.keys(tokenPatterns) as PatternKey[]).map((key) => (
                <option key={key} value={key}>
                  {tokenPatterns[key].name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 dark:text-white">View Mode</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('card-minimum')}
                className={`flex-1 p-2 rounded-lg ${viewMode === 'card-minimum' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                title="Card (minimum)"
              >
                <Grid3x3 className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('card-detailed')}
                className={`flex-1 p-2 rounded-lg ${viewMode === 'card-detailed' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                title="Card (detailed)"
              >
                <Layers className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                title="Table"
              >
                <TableIcon className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
        </div>

        {/* Token Display - Grouped by Type */}
        <div className="space-y-6">
          {Object.entries(groupedTokens).map(([type, typeTokens]) => (
            <div key={type} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className={`px-3 py-1 rounded ${getTokenBadgeClasses(type)}`}>
                  {type}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({typeTokens.length})
                </span>
              </h2>

              {viewMode === 'table' ? (
                renderTable(typeTokens)
              ) : (
                <div className={`grid gap-4 ${
                  viewMode === 'card-minimum'
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {typeTokens.map((token, index) =>
                    viewMode === 'card-minimum'
                      ? renderCardMinimum(token, index)
                      : renderCardDetailed(token, index)
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {flatTokens.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm text-center">
            <Palette className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 dark:text-white">No tokens found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Import a JSON file or select a pattern to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
