// 简单的代理服务器，用于解决CORS问题
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
