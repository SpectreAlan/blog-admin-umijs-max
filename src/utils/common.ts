export function getCookie(cookieName: string) {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const [name, value] = cookie.split('=');

        if (name === cookieName) {
            return decodeURIComponent(value);
        }
    }

    return null;
}