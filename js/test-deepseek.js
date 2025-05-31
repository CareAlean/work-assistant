// 测试DeepSeek API的简单脚本
async function testDeepSeekAPI() {
    const apiKey = 'sk-e14ca5937bec444da5bd8bf0aa59f4fe';
    const apiUrl = 'https://api.deepseek.ai/v1/chat/completions';
    
    console.log('开始测试DeepSeek API...');
    
    const requestData = {
        model: 'deepseek-llm-67b-chat',
        messages: [
            {
                role: 'system',
                content: '你是一个智能助手，请简短回答问题。'
            },
            {
                role: 'user',
                content: '今天天气怎么样？'
            }
        ],
        temperature: 0.7,
        max_tokens: 100
    };
    
    try {
        console.log('发送请求到:', apiUrl);
        console.log('请求数据:', JSON.stringify(requestData, null, 2));
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            return;
        }
        
        const data = await response.json();
        console.log('API响应成功:', data);
        
        if (data.choices && data.choices.length > 0) {
            console.log('AI回复:', data.choices[0].message.content);
        }
    } catch (error) {
        console.error('API调用失败:', error);
    }
}

// 在页面加载完成后执行测试
window.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，开始测试DeepSeek API');
    testDeepSeekAPI();
});
