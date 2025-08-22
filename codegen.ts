
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/graphql",
  documents: "src/**/*.tsx",
  generates: {
    "src/app/api/graphql/generated/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
