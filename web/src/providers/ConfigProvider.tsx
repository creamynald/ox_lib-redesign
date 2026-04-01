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
      }
      if (data.secondaryHex) {
        document.documentElement.style.setProperty('--ox-secondary-color', data.secondaryHex);
      }
    });
  }, []);

  return <ConfigCtx.Provider value={{ config, setConfig }}>{children}</ConfigCtx.Provider>;
};

export default ConfigProvider;

export const useConfig = () => useContext<ConfigCtxValue>(ConfigCtx as Context<ConfigCtxValue>);
