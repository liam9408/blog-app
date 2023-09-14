/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *  Application Config
 */
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

interface Config {
  env: string;
  apiUrl: string;
}

const config: { [name: string]: any } = {
  all: {
    env: process.env.REACT_APP_ENV || 'local',
    isBrowser: typeof window !== 'undefined',
    isServer: typeof window === 'undefined',
    defaultTimeZone: 'Asia/Hong_Kong',
  },
};

const parsedConfigs: Config = {
  ...config.all,
  apiUrl: `${publicRuntimeConfig.API_URL}/api`,
};

export default parsedConfigs;
