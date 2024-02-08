declare namespace Log {
    interface LogItem {
        id: string
        ip:string
        method:string
        message:string
        status:string
        url:string
        query:string
        body:string
        createdAt:string
        userAgent:string
    }
}
