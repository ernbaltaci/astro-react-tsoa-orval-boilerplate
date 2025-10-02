import { defineConfig } from 'orval';
import path from 'path';

export default defineConfig({
  backend: {
    input: path.resolve(__dirname, '../backend/src/swagger.json'),
    output: {
      target: path.resolve(__dirname, 'src/lib/api/endpoints.ts'),
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: path.resolve(__dirname, 'src/lib/utils/custom-instance.ts'),
          name: 'customInstance',
        },
      },
      mode: 'tags-split',
      clean: true,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});

