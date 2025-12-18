import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CSSVariablesContextType {
  version: number;
  customCSSVariables: Record<string, string>;
  incrementVersion: () => void;
  setCustomCSSVariables: (variables: Record<string, string>) => void;
}

const CSSVariablesContext = createContext<CSSVariablesContextType | undefined>(undefined);

export const CSSVariablesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [version, setVersion] = useState(0);
  const [customCSSVariables, setCustomCSSVariables] = useState<Record<string, string>>({});

  const incrementVersion = useCallback(() => {
    setVersion((prev) => prev + 1);
  }, []);

  return (
    <CSSVariablesContext.Provider value={{ version, customCSSVariables, incrementVersion, setCustomCSSVariables }}>
      {children}
    </CSSVariablesContext.Provider>
  );
};

export const useCSSVariablesVersion = () => {
  const context = useContext(CSSVariablesContext);
  if (context === undefined) {
    throw new Error('useCSSVariablesVersion must be used within a CSSVariablesProvider');
  }
  return context;
};
