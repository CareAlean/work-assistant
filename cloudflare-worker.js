/**
 * DeepSeek API代理 - Cloudflare Workers版本
 * 用于解决CORS问题，允许浏览器直接调用DeepSeek API
 * 部署到Cloudflare Workers后完全免费使用（每天10万次请求额度）
 */

// 允许的请求来源（可以根据需要修改）
const ALLOWED_ORIGINS = [
  'http://localhost:8000',
  'https://your-production-domain.com' // 上线后替换为您的实际域名
];

// DeepSeek API端点
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 处理请求的主函数
async function handleRequest(request) {
  // 获取请求来源
  const origin = request.headers.get('Origin');
  
  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return handleCors(new Response(null, { status: 204 }), origin);
  }
  
  // 只处理POST请求
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  
  try {
    // 获取请求数据
    const requestData = await request.json();
    
    // 从请求数据中提取目标URL、方法、头部和请求体
    const { url, method, headers, body } = requestData;
    
    // 验证目标URL是否为DeepSeek API
    if (url !== DEEPSEEK_API_URL) {
      return new Response('Invalid Target URL', { status: 400 });
    }
    
    // 准备请求选项
    const fetchOptions = {
      method: method || 'POST',
      headers: headers || {},
      body: JSON.stringify(body)
    };
    
    // 发送请求到DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, fetchOptions);
    
    // 获取响应数据
    const responseData = await response.json();
    
    // 创建并返回响应
    const corsResponse = new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // 添加CORS头部
    return handleCors(corsResponse, origin);
  } catch (error) {
    // 处理错误
    const errorResponse = new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // 添加CORS头部
    return handleCors(errorResponse, origin);
  }
}

// 添加CORS头部
function handleCors(response, origin) {
  // 检查请求来源是否在允许列表中
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  // 克隆响应以添加头部
  const corsResponse = new Response(response.body, response);
  
  // 添加CORS头部
  corsResponse.headers.set('Access-Control-Allow-Origin', allowOrigin);
  corsResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  corsResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  corsResponse.headers.set('Access-Control-Max-Age', '86400');
  
  return corsResponse;
}

// 注册事件监听器
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
