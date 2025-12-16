import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    // 开发环境代理
    server: command === 'serve' ? {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8788',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    } : undefined,
    // 构建配置
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // 确保资源使用相对路径
      base: '',
      // 优化构建输出
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
    // 预览配置
    preview: {
      port: 4173,
      strictPort: true,
    },
    // 环境变量前缀
    define: {
      'process.env': {}
    },
    // 确保正确处理环境变量
    envPrefix: 'VITE_'
  }
})