import { Context, createContext, useContext, useEffect, useState } from 'react';
import { MantineColor } from '@mantine/core';
import { fetchNui } from '../utils/fetchNui';

interface Config {
  primaryColor: MantineColor;
  primaryShade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  primaryHex?: string;
  secondaryHex?: string;
}

interface ConfigCtxValue {
  config: Config;
  setConfig: (config: Config) => void;
}

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ConfigCtx = createContext<{ config: Config; setConfig: (config: Config) => void } | null>(null);

const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>({
    primaryColor: 'blue',
    primaryShade: 6,
    primaryHex: '#32a1ce',
    secondaryHex: '#1a4f5a',
  });

  useEffect(() => {
    fetchNui<Config>('getConfig').then((data) => {
      setConfig(data);
      if (data.primaryHex) {
        document.documentElement.style.setProperty('--ox-primary-color', data.primaryHex);
        document.documentElement.style.setProperty('--ox-primary-color-alpha', hexToRgba(data.primaryHex, 0.85));
      }
      if (data.secondaryHex) {
        document.documentElement.style.setProperty('--ox-secondary-color', data.secondaryHex);
        document.documentElement.style.setProperty('--ox-bg-color', hexToRgba(data.secondaryHex, 0.82));
      }
    });
  }, []);

  return <ConfigCtx.Provider value={{ config, setConfig }}>{children}</ConfigCtx.Provider>;
};

export default ConfigProvider;

export const useConfig = () => useContext<ConfigCtxValue>(ConfigCtx as Context<ConfigCtxValue>);
