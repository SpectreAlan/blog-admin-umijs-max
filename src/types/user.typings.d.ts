declare namespace User {
    interface UserItem {
        id: string
        account: string
        nickName: string
        avatar: string
        email: string
        role: string
        status: number
    }
    interface UserLogin {
        account: string
        password: string
    }

    interface UserLoginSms {
        phone: string
        sms: string
    }

    interface AccountInfo {
        account: string
        avatar: string
        email: string
        id: string
        nickName: string
        role: string
        token: string
    }
}
