import React, { useState, useEffect } from 'react';
import { Palette, Import, Search, Sun, Moon } from 'lucide-react';
import type { TokenSet, DesignToken, FlattenedToken } from './types';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tokens, setTokens] = useState<TokenSet>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<FlattenedToken | null>(null);

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
          <div className="flex items-center space-x-2">
            <Palette className="w-8 h-8 text-blue-500" />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Design Tokens Manager
            </h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-200" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
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
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {token.path.join('.')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {token.value.toString()}
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