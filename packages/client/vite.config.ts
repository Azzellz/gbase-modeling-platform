import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 5000,
        host: true,
    },
    plugins: [vue(), vueJsx(), vueDevTools(), UnoCSS()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@config': fileURLToPath(new URL('../../config/client.config.ts', import.meta.url))
        }
    }
})
