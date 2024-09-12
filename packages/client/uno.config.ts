// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
    // ...UnoCSS options
    shortcuts: {
        tip: 'text-sm text-gray font-bold',
        'text-primary': 'text-green-600', // 主题色
        'border-bottom-primary': 'border-b-solid border-b-1 border-b-green-600',
        'router-link': 'transition-all hover:text-primary hover:scale-110 hover:border-bottom-primary',
        'router-link-active': 'transition-all text-primary scale-110 border-bottom-primary',
        'router-link-no-border': 'transition-all hover:text-primary hover:scale-110 ',
    }
})
