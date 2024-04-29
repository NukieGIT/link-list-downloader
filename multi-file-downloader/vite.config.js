import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        checker({
            typescript: true
        })
    ]
})