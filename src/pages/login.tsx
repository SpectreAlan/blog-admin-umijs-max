import {
    LockOutlined,
    MobileOutlined,
    UserOutlined,
    GithubOutlined
} from '@ant-design/icons';
import {
    LoginFormPage,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';
import {Divider, Space, Tabs} from 'antd';
import type {CSSProperties} from 'react';
import {useState} from 'react';
import {history, useRequest, useModel} from '@umijs/max';
import Logo from '@/assets/images/logo.png'
import Bg from '@/assets/images/bg.png'
import {encrypt} from '@/utils/common'

type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};

export default () => {
    const {setInitialState} = useModel('@@initialState');
    const items = [
        {label: '账户密码登录', key: 'account'},
        {label: '手机号登录', key: 'phone'},
    ];
    const [loginType, setLoginType] = useState<LoginType>('account');

    const {loading, run} = useRequest((data: User.UserLogin) => {
        return {
            url: '/auth/login',
            method: 'post',
            data,
        }
    }, {
        manual: true,
        onSuccess: (res: User.AccountInfo) => {
            console.log(res);
            sessionStorage.setItem('token', res.token)
            sessionStorage.setItem('user', encrypt(res))
            setInitialState(res);
            history.push('/')
        }
    });

    const onSubmit = async (formData: User.UserLogin) => {
        run(formData)
    };
    return (
        <div
            style={{
                backgroundColor: 'white',
                height: '100vh',
                width: '100vw',
            }}
        >
            <LoginFormPage
                onFinish={onSubmit}
                backgroundImageUrl={Bg}
                logo={Logo}
                loading={loading}
                title="博客后台"
                subTitle="基于umijs/max"
                actions={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Divider plain>
              <span
                  style={{color: '#CCC', fontWeight: 'normal', fontSize: 14}}
              >
                其他登录方式
              </span>
                        </Divider>
                        <Space align="center" size={24}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid #D4D8DD',
                                    borderRadius: '50%',
                                }}
                            >
                                <GithubOutlined style={{...iconStyles, color: '#000'}}/>
                            </div>
                        </Space>
                    </div>
                }
            >
                <Tabs
                    centered
                    items={items}
                    activeKey={loginType}
                    onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                ></Tabs>

                {loginType === 'account' && (
                    <>
                        <ProFormText
                            name="account"
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={'prefixIcon'}/>,
                            }}
                            placeholder={'请输入账号'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入账号!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'}/>,
                            }}
                            placeholder={'请输入密码'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                    </>
                )}
                {loginType === 'phone' && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: <MobileOutlined className={'prefixIcon'}/>,
                            }}
                            name="mobile"
                            placeholder={'手机号'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入手机号！',
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '手机号格式错误！',
                                },
                            ]}
                        />
                        <ProFormCaptcha
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'}/>,
                            }}
                            captchaProps={{
                                size: 'large',
                            }}
                            placeholder={'请输入验证码'}
                            captchaTextRender={(timing, count) => {
                                if (timing) {
                                    return `${count} ${'获取验证码'}`;
                                }
                                return '获取验证码';
                            }}
                            name="captcha"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码！',
                                },
                            ]}
                            onGetCaptcha={async () => {
                            }}
                        />
                    </>
                )}
                <div style={{marginBlockEnd: 24}}>
                    <ProFormCheckbox noStyle name="autoLogin">
                        自动登录
                    </ProFormCheckbox>
                    <a style={{float: 'right'}}>忘记密码 </a>
                </div>
            </LoginFormPage>
        </div>
    );
};

