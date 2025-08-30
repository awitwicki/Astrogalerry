import React, { createContext, useContext, useState } from 'react';

interface BackgroundProviderProps {
  children: React.ReactNode;
}

interface BackgroundContextType {
  background: string | null;
  setBackground: (url: string | null) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [background, setBackground] = useState<string | null>(null);

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};
