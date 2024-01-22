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
            message.error(response?.data?.message || error?.message || '请求错误：服务器故障，请稍后再试');
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
            }
            if (msg !== 'success') {
                message.success(msg)
            }
            response.data = res
            return response
        },
    ]
}

export default request;
