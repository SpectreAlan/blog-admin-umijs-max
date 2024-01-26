# 博客后台管理系统
Personal blog backend management system based on Umi Max, Related [backend services](https://github.com/SpectreAlan/blog-server-nestjs-vercel)
# How to use
```bash
# Clone to local
git clone https://github.com/SpectreAlan/blog-admin-umijs-max.git
# Switch working directory
cd blog-admin-umijs-max
# Install dependencies
pnpm install
# Running locally
pnpm dev
```
# Environmental requirements
> node >>> 16.x
# Project configuration
Create .env in the project root directory,Fill in the following content
```txt
// .env
PORT=Project running port
CRYPTO_SECRET_KEY=CRYPTO encryption and decryption key
BASE_URL=Base url for http requests
PROXY=proxy address for http request
IMAGE_PROXY=proxy address for static image
```
Basic example
```javascript
PORT=4000
CRYPTO_SECRET_KEY=your_secret_key
BASE_URL=/api
PROXY=https://example.http.com
IMAGE_PROXY=https://example.assets.com
```
> Tips: CRYPTO_SECRET_KEY should be consistent with the background service