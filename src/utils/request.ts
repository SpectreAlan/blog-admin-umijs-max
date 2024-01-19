import {RequestConfig} from '@umijs/max';
import {message} from "antd";
import CryptoJS from 'crypto-js';
import { history  } from 'umi';

const request: RequestConfig = {
    timeout: 15000,
    // other axios options you want
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
            if(config.method === 'post'){
                config.headers['Content-Type'] = 'application/json'
            }
            return config;
        },
        (error: any) => {
            return error;
        },
    ],
    responseInterceptors: [
        (response) => {
            const key = process.env.CRYPTO_SECRET_KEY;
            const bytes = CryptoJS.AES.decrypt(response.data, key)
            const decrypt = bytes.toString(CryptoJS.enc.Utf8)
            const res = JSON.parse(decrypt)
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
