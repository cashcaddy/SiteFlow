
export type SectionType =
  | 'custom'
  | 'header'
  | 'hero'
  | 'about'
  | 'services'
  | 'contact'
  | 'footer'


export interface Element {
  id: string;
  type: 'heading' | 'text' | 'button' | 'input' | 'image';
  content: string;
  placeholder?: string;
  style?: Record<string, any>;
}

export interface Section {
  id: string;
  type: SectionType;
  content: Record<string, any>;
  elements?: Element[];
  style?: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
  };
}

export interface WebsiteConfig {
  title: string;
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
  sections: Section[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  config: WebsiteConfig;
}
