import React, {useState} from "react";
import {Avatar, Dropdown, Menu} from "antd";
import {LockOutlined, LogoutOutlined} from "@ant-design/icons";
import {InitialStateType} from "@@/plugin-initialState/@@initialState";
import {history} from '@umijs/max';
import UpdatePassword from "@/components/User/updatePassword";

const User: React.FC<{ initialState: InitialStateType }> = ({initialState}) => {
    const [drawerVisible, setDrawerVisible] = useState(false)

    const logout = () => {
        sessionStorage.clear()
        history.push('/login')
    }

    return (
        <>
            {drawerVisible &&
                <UpdatePassword setDrawerVisible={setDrawerVisible} id={initialState!.id} logout={logout}/>}

            <Dropdown overlay={<Menu>
                <Menu.Item key="logout" icon={<LogoutOutlined/>}>
                    <a onClick={() => logout()}>退出登录</a>
                </Menu.Item>
                <Menu.Item key="changePassword" icon={<LockOutlined/>}>
                    <a onClick={() => setDrawerVisible(true)}>修改密码</a>
                </Menu.Item>
            </Menu>}>
                <a>
                    <Avatar size="small" src={initialState?.avatar} alt="avatar"/>
                    <span style={{marginLeft: 8}}>{initialState?.nickName || '用户'}</span>
                </a>
            </Dropdown>
        </>
    )
}

export default User