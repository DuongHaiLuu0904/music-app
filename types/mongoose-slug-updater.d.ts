declare module 'mongoose-slug-updater' {
  import mongoose from 'mongoose';
  
  interface SlugOptions {
    field?: string;
    fields?: string[];
    separator?: string;
    permanent?: boolean;
    unique?: boolean;
    uniqueValidator?: (slug: string, options: any) => Promise<boolean>;
    update?: boolean;
    historyField?: string;
    slugField?: string;
    alwaysUpdateSlug?: boolean;
    index?: boolean;
    sparse?: boolean;
    slugPaddingSize?: number;
    slugFunction?: (originalValue: string, options: any) => string;
  }
  
  function plugin(schema: mongoose.Schema, options?: SlugOptions): void;
  
  namespace plugin {
    const defaults: {
      separator: string;
      field: string;
      fields: string[];
      uniqueValidator: (slug: string, options: any) => Promise<boolean>;
      permanent: boolean;
      slugField: string;
      update: boolean;
      historyField: string;
      alwaysUpdateSlug: boolean;
      index: boolean;
      sparse: boolean;
      slugPaddingSize: number;
      slugFunction: (originalValue: string, options: any) => string;
    };
  }
  
  export = plugin;
}