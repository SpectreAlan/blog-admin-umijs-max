import CryptoJS from "crypto-js";

export function encrypt(data:any){
    const key: string = process.env.CRYPTO_SECRET_KEY!
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data),
        key,
    );
    return encrypted.toString()
}
export function decrypt(data:string){
    const key: string = process.env.CRYPTO_SECRET_KEY!
    const bytes = CryptoJS.AES.decrypt(data as string, key)
    const decrypt = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypt)
}