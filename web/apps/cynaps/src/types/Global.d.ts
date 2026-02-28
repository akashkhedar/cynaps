interface Window {
  APP_SETTINGS?: Record<string, any>;
  Cynaps?: any;
  DataManager?: any;
  dataManager?: any;
}

declare const APP_SETTINGS: Record<string, any>;

declare type AnyObject = Record<string, unknown>;

// PNG image imports
declare module '*.png' {
  const value: string;
  export default value;
}

