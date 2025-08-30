import React, { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";

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

export const BackgroundProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [background, setBackground] = useState<string | null>(null);

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};
