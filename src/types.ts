export interface TokenSet {
  [key: string]: DesignToken | TokenGroup;
}

export interface TokenGroup {
  [key: string]: DesignToken | TokenGroup;
}

export interface TypographyValue {
  fontFamily: string;
  fontSize: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface DesignToken {
  $type: 'color' | 'typography' | 'spacing' | 'size' | 'opacity' | 'borderRadius';
  $value: string | number | TypographyValue;
  $description?: string;
}

export interface FlattenedToken {
  path: string[];
  type: string;
  value: string | number | TypographyValue;
  description?: string;
}

export interface TokenHistory {
  id: string;
  name: string;
  date: string;
  type: 'import' | 'export';
  tokenCount: number;
}

export interface AppState {
  currentView: 'home' | 'import' | 'export' | 'preview' | 'about';
  isDarkMode: boolean;
  tokens: TokenSet;
  selectedPath: string[] | null;
  selectedToken: FlattenedToken | null;
  history: TokenHistory[];
  searchQuery: string;
}