import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{find: /^react-native$/, replacement: 'react-native-web'}],
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.jsx', '.tsx'],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.jsx', '.tsx'],
    },
  },
});
