import request from '@/utils/request'
import {RunTimeLayoutConfig} from '@umijs/max';
import Logo from '@/assets/images/logo.png'
import {decrypt} from "@/utils/common";
import User from "@/components/User";

export async function getInitialState(): Promise<User.AccountInfo> {
    const user = sessionStorage.getItem('user')
    if (user) {
        return decrypt(user)
    }
    return {role: 'default', avatar: '', nickName: '', account: '', email: '', token: '', id: ''};
}
export const layout: RunTimeLayoutConfig = ({initialState}) => {
    return {
        logo: Logo,
        title: '博客管理系统',
        menu: {
            locale: 'en-US',
        },
        layout: 'mix',
        avatarProps: {
            render: ()=><User initialState={initialState}/>,
        },
        links: [
            <a href="https://google.com" key='google'>Google</a>
        ]
    };
};

export {request}
