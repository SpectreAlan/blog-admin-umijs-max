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
    interface UserItem {
        id: string
        account:string
        nickName:string
        avatar:string
        email:string
        role:string
        status:number
        createdAt:string
        updatedAt: string
    }
}
