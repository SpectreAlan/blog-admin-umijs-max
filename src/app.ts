import request from '@/utils/request'
import {RunTimeLayoutConfig} from '@umijs/max';
import Logo from '@/assets/images/logo.png'
import {decrypt} from "@/utils/common";

export async function getInitialState():Promise<User.AccountInfo> {
    const user = sessionStorage.getItem('user')
    if(user){
        return decrypt(user)
    }
    return {role: 'default', avatar: '', nickName: '', account: '', email: '', token: ''};
}

export const layout: RunTimeLayoutConfig = ({initialState}) => {
    return {
        logo: Logo,
        title: 'blog admin',
        menu: {
            locale: false,
        },
        layout: 'side',
        avatarProps: {
            src: initialState?.avatar || undefined,
            title: initialState?.nickName || '用户',
            size: 'small',
        },
    };
};

export {request}
