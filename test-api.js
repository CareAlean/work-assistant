// 简单的测试脚本，直接调用DeepSeek API
const https = require('https');

// API密钥和请求数据
const apiKey = 'sk-e14ca5937bec444da5bd8bf0aa59f4fe';
const requestData = JSON.stringify({
  model: 'deepseek-llm-67b-chat',
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
  hostname: 'api.deepseek.ai',
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
