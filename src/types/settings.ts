export interface AppSettings {
  id: string;
  name: string;
  logo: string;
  favicon: string;
  colors: {
    primary: string;
    secondary: string;
    navbar: {
      from: string;
      to: string;
    };
    sidebar: string;
  };
  updatedAt: string;
}