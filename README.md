<div align="center">
<h1 align="center">个人博客后台管理系统</h1>
<img src="https://img.shields.io/github/issues/SpectreAlan/blog_admin?color=green">
<img src="https://img.shields.io/github/stars/SpectreAlan/blog_admin?color=yellow">
<img src="https://img.shields.io/github/forks/SpectreAlan/blog_admin?color=orange">
<img src="https://img.shields.io/github/license/SpectreAlan/blog_admin?color=ff69b4">
<img src="https://img.shields.io/github/search/SpectreAlan/blog_admin/main?color=blue">
<img src="https://img.shields.io/github/v/release/SpectreAlan/blog_admin?color=blueviolet">
<img src="https://img.shields.io/github/languages/code-size/SpectreAlan/blog_admin?color=critical">
</div>

# 简介
基于vue全家桶搭建的个人博客后台管理系统，搭配 [博客前台](https://github.com/SpectreAlan/blog-nextjs) 以及 [中台server](https://github.com/SpectreAlan/blog-server) 一起组成完整的个人博客系统，基础模板使用vue-element-admin，删除本项目无用的组件和页面，扩展了如下功能：

# 功能
* [x] 博客报表，基于echarts包含评论统计、图片统计、访客统计以及访客分布散点图
* [x] 权限管理，按钮级别控制
* [x] 用户动态主题
* [x] 拓展菜单管理，包含菜单名称、图标、顺序
* [x] 图片管理、相册管理，前端图片上传前无损压缩
* [x] 网站基础设置，包含图床配置等
* [x] 一言
* [x] 封装原ElementUI的table组件

# 目录

- [简介](#简介)
- [功能](#功能)
- [目录](#目录)
- [fork本项目](#fork本项目)
- [本地运行](#本地运行)
- [部署及后续操作](#部署及后续操作)
- [配置文件说明](#配置文件说明)
# 使用方法

## fork本项目

项目地址：[SpectreAlan/blog_admin](https://github.com/SpectreAlan/blog_admin)

# 本地运行
```bash
# 克隆项目
git clone https://github.com/SpectreAlan/blog_admin.git
# 切换到项目目录
cd blog_admin
# 安装依赖
yarn install
# 启动服务
yarn run dev
```
# 部署及后续操作
命令行切换到项目根目录进行打包，打包后的项目文件在/dist下
```bash
yarn run build:prod
```
# 配置文件说明
/src/settings.js文件
```javascript
module.exports = {
  title: "Alan Grady's Management System", // 项目标题
  proxy: {
    name: '/admin', // 代理字段，用作nginx反向代理使用
    url: 'http://127.0.0.1:7001' // 本地代理地址
  },
  port: 5000, // 开发环境服务端口
  showSettings: true, // 默认显示settings按钮
  tagsView: true, // 默认显示tags标签
  theme: '#304156', // 默认主题颜色
  fixedHeader: false, // 页头固定: 否
  sidebarLogo: false, // 侧边栏logo: 否
  errorLog: 'production'
}

```

