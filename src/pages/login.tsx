import {
    LockOutlined,
    MobileOutlined,
    UserOutlined,
    GithubOutlined,
    FundViewOutlined
} from '@ant-design/icons';
import {
    LoginFormPage,
    ProFormCaptcha,
    ProFormText,
} from '@ant-design/pro-components';
import {Divider, Space, Tabs, Form, Input} from 'antd';
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
const changeCaptcha = () => `${process.env.BASE_URL}/auth/captcha?${Math.random()}`

export default () => {
    const [form] = Form.useForm()
    const [captcha, setCaptcha] = useState(changeCaptcha())

    const {setInitialState} = useModel('@@initialState');
    const items = [
        {label: '账户密码登录', key: 'account'},
        {label: '手机号登录', key: 'phone'},
    ];
    const [loginType, setLoginType] = useState<LoginType>('phone');

    const onSuccess = (res: User.AccountInfo) => {
        sessionStorage.setItem('token', res.token)
        sessionStorage.setItem('user', encrypt(res))
        setInitialState(res);
        history.push('/home')
    }

    const {loading, run} = useRequest((data: User.UserLogin | User.UserLoginSms) => {
        return {
            url: '/auth/login',
            method: 'post',
            data,
        }
    }, {
        manual: true,
        onSuccess,
        onError: () => {
            setCaptcha(changeCaptcha())
            form.setFieldsValue({captcha: ''})
        }
    });

    const {loading: loadingSms, run: runSms} = useRequest((data: User.UserLoginSms | User.UserLogin) => {
        return {
            url: '/auth/loginBySms',
            method: 'post',
            data,
        }
    }, {
        manual: true,
        onSuccess
    });

    const {run: getPhoneCaptcha} = useRequest((data: { phone: number }) => {
        return {
            url: '/auth/sms',
            method: 'post',
            data,
        }
    }, {
        manual: true
    });

    const onSubmit = async (formData: User.UserLoginSms | User.UserLogin) => {
        (loginType === 'account' ? run : runSms)(formData);
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
                form={form}
                onFinish={onSubmit}
                backgroundImageUrl={Bg}
                logo={Logo}
                loading={loading || loadingSms}
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
                        <Form.Item name={'captcha'} rules={[{required: true, message: '请输入验证码'}]}>
                            <Input
                                prefix={<FundViewOutlined/>}
                                placeholder={'请输入验证码'}
                                suffix={<img src={captcha} style={{cursor: 'pointer'}} alt="验证码"
                                             onClick={() => setCaptcha(changeCaptcha())}/>}
                            />
                        </Form.Item>
                    </>
                )}
                {loginType === 'phone' && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: <MobileOutlined className={'prefixIcon'}/>,
                            }}
                            name="phone"
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
                            name="sms"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码！',
                                },
                            ]}
                            onGetCaptcha={async () => {
                                getPhoneCaptcha({phone: form.getFieldValue('phone')})
                            }}
                        />
                    </>
                )}
            </LoginFormPage>
        </div>
    );
};

