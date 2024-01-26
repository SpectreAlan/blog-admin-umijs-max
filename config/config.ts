import {defineConfig} from '@umijs/max';
import routes from './routes'

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: {},
    routes,
    hash: true,
    npmClient: 'pnpm',
    proxy: {
        '/api': {
            'target': process.env.PROXY,
            'changeOrigin': true,
            'pathRewrite': {'^/api': ''},
        },
        '/image-base-url': {
            'target': process.env.IMAGE_PROXY,
            'changeOrigin': true,
            'pathRewrite': {'^/image-base-url': ''},
        },
    },
    define: {
        'process.env': process.env
    },
    favicons: [
        '/favicon.ico'
    ],
});

