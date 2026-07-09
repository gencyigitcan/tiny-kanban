const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: [path.join(__dirname, 'src/index.ts')],
  bundle: true,
  outfile: path.join(__dirname, 'dist/index.js'),
  platform: 'node',
  format: 'esm',
  target: 'es2022',
  external: [
    'cloudflare:node',
    'cloudflare:*'
  ],
  banner: {
    js: `import { createRequire } from 'node:module'; const require = createRequire('/');`
  },
  alias: {
    'iconv-lite': path.join(__dirname, 'src/stubs/iconv-lite-mock.ts')
  },
  loader: {
    '.png': 'dataurl',
    '.svg': 'text'
  }
}).catch(() => process.exit(1));
