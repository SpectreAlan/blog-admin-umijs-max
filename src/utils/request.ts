import {RequestConfig} from '@umijs/max';
import {message} from "antd";
import {decrypt} from '@/utils/common'
import {history} from '@umijs/max';

const request: RequestConfig = {
    baseURL: process.env.BASE_URL,
    timeout: 50000,
    errorConfig: {
        errorHandler(error: any) {
            const {response} = error;
            const res = decrypt(response.data as string)
            message.error(res?.message || error?.message || '请求错误：服务器故障，请稍后再试');
            if (response && response.status === 401) {
                sessionStorage.clear()
                history.push('/login')
            }

        },
        errorThrower() {
        },
    },
    // 请求拦截
    requestInterceptors: [
        (config: any) => {
            let token = sessionStorage.getItem('token') || '';
            if(!token && !config.url.includes('/auth/')){
                history.push('/login')
                const error = new Error('No token available');
                error.name = 'TOKEN_ERROR';
                error.message = 'TOKEN_ERROR';
                return Promise.reject(error);
            }
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            if (config.method !== 'get') {
                config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
                config.data = JSON.stringify(config.data)
            }
            return config;
        },
        (error: any) => {
            return error;
        },
    ],
    responseInterceptors: [
        (response) => {
            const res = decrypt(response.data as string)
            const {code, message: msg} = res;
            if (code) {
                message.error(msg)
            }else{
                if (msg !== 'success') {
                    message.success(msg)
                }
            }
            response.data = res
            return response
        },
    ]
}

export default request;
