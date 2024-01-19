import request from '@/utils/request'
import {RunTimeLayoutConfig} from '@umijs/max';

export async function getInitialState(): Promise<{ name: string }> {
    return {name: 'admin'};
}

export const layout: RunTimeLayoutConfig = ({initialState}) => {
    return {
        logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
        title: 'blog admin',
        menu: {
            locale: false,
        },
        layout: 'mix', //菜单的方式，有mix,top,side三种，这里用mix
        splitMenus: true, // 这里用了mix才会生效,bia
        avatarProps: {
            src: initialState?.avatar || undefined, //右上角头像
            title: initialState?.name || '用户', //右上角名称
            size: 'small',
        },
    };
};
export {request}
