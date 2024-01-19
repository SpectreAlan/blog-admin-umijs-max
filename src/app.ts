import request from '@/utils/request'
import {RunTimeLayoutConfig} from '@umijs/max';

export async function getInitialState(): Promise<{ name: string }> {
    const user = sessionStorage.getItem('user')
    if(user){
        return JSON.parse(user)
    }
    return {name: 'admin'};
}

export const layout: RunTimeLayoutConfig = ({initialState}) => {
    return {
        logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
        title: 'blog admin',
        menu: {
            locale: false,
        },
        layout: 'mix',
        splitMenus: true,
        avatarProps: {
            src: initialState?.avatar || undefined,
            title: initialState?.nickName || '用户',
            size: 'small',
        },
    };
};
export {request}
