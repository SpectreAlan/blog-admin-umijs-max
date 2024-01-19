declare namespace User {
    interface UserLogin {
        account: string
        password: string
    }
    interface AccountInfo {
        token: string
        account: string
        role: string
        avatar: string
        nickName: string
        email: string
    }
}
