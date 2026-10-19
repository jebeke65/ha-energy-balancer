import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  input: join(__dirname, 'src/eb-cards.js'),
  output: {
    file: join(__dirname, 'dist/eb-cards.js'),
    format: 'es',
    sourcemap: false,
    banner: '/*! Energy Balancer cards. Portions derived from SEM (https://github.com/traktore-org/sem-community), MIT License, Copyright (c) 2025 belinea4071. Licensed under the MIT License; see NOTICE in the repository. */',
  },
  plugins: [
    resolve(),
    terser({ format: { comments: /^!/ } }),   // keep the /*! licence banner
  ],
};
