# Cloudflare Workers 部署指南

这个指南将帮助您将DeepSeek API代理部署到Cloudflare Workers，这样您就可以免费、稳定地解决CORS问题，不再需要在本地运行代理服务器。

## 部署步骤

### 1. 注册Cloudflare账号

1. 访问 [Cloudflare官网](https://www.cloudflare.com/)
2. 点击"Sign Up"注册一个免费账号
3. 完成邮箱验证

### 2. 创建Workers项目

1. 登录Cloudflare账号后，点击左侧菜单的"Workers"
2. 点击"Create a Worker"创建一个新的Worker
3. 在编辑器中，删除默认代码
4. 复制我们准备好的`cloudflare-worker.js`文件中的代码，粘贴到编辑器中
5. 在代码中修改`ALLOWED_ORIGINS`数组，确保包含您的网站域名或本地开发地址

### 3. 保存并部署

1. 点击"Save and Deploy"按钮
2. Cloudflare会为您的Worker分配一个域名，格式类似于：`your-worker-name.your-username.workers.dev`
3. 记录下这个域名，我们需要在前端代码中使用它

### 4. 更新前端代码

1. 打开`js/deepseek-api-cloudflare.js`文件
2. 找到构造函数中的`this.proxyUrl`设置行
3. 将其值替换为您刚才获得的Cloudflare Workers URL
4. 示例：`this.proxyUrl = 'https://deepseek-proxy.your-username.workers.dev';`

### 5. 在项目中使用新的API类

1. 在`index.html`文件中，将原来的DeepSeek API脚本引用替换为新版本：

```html
<!-- 将这一行 -->
<script src="js/deepseek-api.js"></script>

<!-- 替换为 -->
<script src="js/deepseek-api-cloudflare.js"></script>
```

2. 重新加载页面，现在您的应用将通过Cloudflare Workers代理与DeepSeek API通信

## 免费使用限制

Cloudflare Workers免费计划包括：

- 每天100,000次请求
- 每个请求最多10ms CPU时间
- 每天1,000个子请求
- 每个Worker最多可以部署一个脚本

这些限制对于个人项目来说通常是足够的。如果您需要更多资源，可以考虑升级到Cloudflare Workers付费计划。

## 故障排除

如果您遇到问题，请检查：

1. Cloudflare Workers是否正确部署
2. 前端代码中的代理URL是否正确设置
3. 允许的来源(ALLOWED_ORIGINS)是否包含您的网站域名
4. 浏览器控制台是否有错误信息

## 优势

使用Cloudflare Workers作为代理有以下优势：

1. 完全免费，无需支付服务器费用
2. 全球CDN加速，响应速度快
3. 高可用性，无需担心服务器宕机
4. 无需维护，Cloudflare负责所有基础设施
5. 安全，Cloudflare提供DDoS保护和其他安全功能

---

如果您有任何问题，请随时联系我们获取帮助。
