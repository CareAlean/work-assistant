# DeepSeek API集成经验总结

## 关键发现与经验教训

### 1. 正确的API配置

#### API端点
- ✅ **正确**: `https://api.deepseek.com/v1/chat/completions`
- ❌ **错误**: `https://api.deepseek.ai/v1/chat/completions`

#### 模型名称
- ✅ **正确**: `deepseek-chat`
- ❌ **错误**: `deepseek-llm-67b-chat`

### 2. 浏览器CORS问题解决方案

在浏览器环境中直接调用DeepSeek API会遇到跨域资源共享(CORS)限制。我们通过以下步骤解决：

1. 创建Node.js代理服务器
   ```javascript
   // proxy-server.js
   const http = require('http');
   const https = require('https');
   const url = require('url');

   const PORT = 3000;

   // 创建HTTP服务器
   const server = http.createServer((req, res) => {
       // 设置CORS头
       res.setHeader('Access-Control-Allow-Origin', '*');
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
       res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
       
       // 处理OPTIONS请求
       if (req.method === 'OPTIONS') {
           res.writeHead(200);
           res.end();
           return;
       }
       
       // 只处理POST请求
       if (req.method === 'POST' && req.url === '/proxy') {
           let body = '';
           
           // 接收请求数据
           req.on('data', chunk => {
               body += chunk.toString();
           });
           
           // 处理请求
           req.on('end', () => {
               try {
                   // 解析请求数据
                   const requestData = JSON.parse(body);
                   const { url: targetUrl, method, headers, body: requestBody } = requestData;
                   
                   console.log(`代理请求: ${method} ${targetUrl}`);
                   
                   // 解析目标URL
                   const parsedUrl = url.parse(targetUrl);
                   
                   // 创建请求选项
                   const options = {
                       hostname: parsedUrl.hostname,
                       port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
                       path: parsedUrl.path,
                       method: method || 'GET',
                       headers: headers || {}
                   };
                   
                   // 创建请求
                   const proxyReq = (parsedUrl.protocol === 'https:' ? https : http).request(options, proxyRes => {
                       // 设置响应头
                       res.writeHead(proxyRes.statusCode, proxyRes.headers);
                       
                       // 转发响应数据
                       proxyRes.pipe(res);
                   });
                   
                   // 处理请求错误
                   proxyReq.on('error', error => {
                       console.error('代理请求错误:', error);
                       res.writeHead(500);
                       res.end(JSON.stringify({ error: '代理请求失败', message: error.message }));
                   });
                   
                   // 发送请求体
                   if (requestBody) {
                       proxyReq.write(typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody));
                   }
                   
                   // 结束请求
                   proxyReq.end();
               } catch (error) {
                   console.error('处理请求错误:', error);
                   res.writeHead(400);
                   res.end(JSON.stringify({ error: '请求格式错误', message: error.message }));
               }
           });
       } else {
           // 其他请求返回404
           res.writeHead(404);
           res.end(JSON.stringify({ error: '未找到' }));
       }
   });

   // 启动服务器
   server.listen(PORT, () => {
       console.log(`代理服务器运行在 http://localhost:${PORT}`);
   });
   ```

2. 修改前端API调用代码
   ```javascript
   // 使用代理服务器发送API请求
   const proxyData = {
       url: 'https://api.deepseek.com/v1/chat/completions',
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Bearer ' + apiKey
       },
       body: requestData
   };
   
   // 发送到代理服务器
   const response = await fetch('http://localhost:3000/proxy', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(proxyData)
   });
   ```

### 3. 调试技巧

#### 使用Node.js测试脚本
创建一个独立的测试脚本来验证API连接：

```javascript
// test-api.js
const https = require('https');

// API密钥和请求数据
const apiKey = 'your-api-key';
const requestData = JSON.stringify({
  model: 'deepseek-chat',
  messages: [
    {
      role: 'user',
      content: '你好，请用一句话介绍自己'
    }
  ],
  temperature: 0.7,
  max_tokens: 100
});

// 请求选项
const options = {
  hostname: 'api.deepseek.com',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Length': Buffer.byteLength(requestData)
  }
};

// 发送请求
const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应数据:');
    console.log(JSON.parse(data));
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 写入请求数据
req.write(requestData);
req.end();

console.log('请求已发送，等待响应...');
```

#### 常见错误与解决方案

1. **"Failed to fetch"**
   - 可能原因：网络连接问题、CORS限制、代理服务器未运行
   - 解决方案：确保代理服务器正常运行，检查网络连接

2. **"getaddrinfo ENOTFOUND api.deepseek.ai"**
   - 可能原因：域名错误或DNS解析失败
   - 解决方案：使用正确的域名 `api.deepseek.com`

3. **401 Unauthorized**
   - 可能原因：API密钥错误或过期
   - 解决方案：检查API密钥是否正确

4. **模型不存在错误**
   - 可能原因：模型名称错误
   - 解决方案：使用正确的模型名称 `deepseek-chat`

### 4. 完整API请求示例

```javascript
const apiKey = 'your-api-key';
const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
const requestData = {
    model: 'deepseek-chat',
    messages: [
        {
            role: 'system',
            content: '你是一个智能助手，请简短回答问题。'
        },
        {
            role: 'user',
            content: '请用一句话自我介绍。'
        }
    ],
    temperature: 0.7,
    max_tokens: 100
};

// 使用代理服务器发送请求
const proxyData = {
    url: apiUrl,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: requestData
};

const response = await fetch('http://localhost:3000/proxy', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(proxyData)
});

// 处理响应
if (!response.ok) {
    const errorText = await response.text();
    console.error('API响应错误:', response.status, errorText);
    return;
}

const data = await response.json();
console.log('API响应成功:', data);

if (data.choices && data.choices.length > 0) {
    const aiResponse = data.choices[0].message.content;
    console.log('AI回复:', aiResponse);
}
```

## 总结

DeepSeek API集成过程中的关键经验：

1. 使用正确的API端点：`https://api.deepseek.com/v1/chat/completions`
2. 使用正确的模型名称：`deepseek-chat`
3. 通过Node.js代理服务器解决CORS问题
4. 使用独立测试脚本验证API连接
5. 详细记录错误信息，便于排查问题

这些经验教训对于任何需要集成第三方API的项目都有重要参考价值，特别是在处理跨域问题和API参数配置方面。
