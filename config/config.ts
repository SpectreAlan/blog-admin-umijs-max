import {defineConfig} from '@umijs/max';
import {routes} from './routes'

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: {
        title: 'blog admin',
    },
    routes,
    npmClient: 'pnpm',
    proxy: {
        '/api': {
            'target': process.env.PROXY,
            'changeOrigin': true,
            'pathRewrite': {'^/api': ''},
        },
    },
    define: {
        'process.env': process.env
    }
});

