import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-32.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  options_page: 'options.html',
  devtools_page: 'devtools.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/contentScript/index.tsx'],
      run_at: "document_start",
      all_frames: true
    },
  ],
  web_accessible_resources: [
    {
      resources: ['*.png', '*.js', 'injector.js'],
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
    },
  ],
  permissions: ['sidePanel', 'storage', 'webRequest'],
  host_permissions: [
    'http://*/*',
    'https://*/*',
    '<all_urls>',
    // 'http://192.168.8.140:5678/*', // Add specific permission for your local server
  ],
})
