/**
 * DeepSeek API 接口 - Cloudflare Workers版本
 * 用于处理与DeepSeek AI的通信，通过Cloudflare Workers代理解决CORS问题
 * 版本: 3.0.0
 */
class DeepSeekAPI {
    /**
     * 构造函数
     * @param {string} apiKey - DeepSeek API密钥
     * @param {string} proxyUrl - Cloudflare Workers代理URL
     */
    constructor(apiKey, proxyUrl) {
        // 检查本地存储中是否有API密钥
        if (!apiKey) {
            apiKey = localStorage.getItem('deepseek_api_key');
        }
        
        // API配置
        this.apiKey = apiKey || 'sk-e14ca5937bec444da5bd8bf0aa59f4fe';
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.model = 'deepseek-chat'; // 使用正确的模型名称
        
        // Cloudflare Workers代理URL
        this.proxyUrl = proxyUrl || 'https://your-worker.your-username.workers.dev'; // 部署后替换为实际URL
        
        // 对话历史
        this.conversationHistory = [];
        this._cachedPrompt = null; // 缓存的提示词
        
        // 模拟模式（默认关闭）
        this.useSimulation = false;
        
        // 数据模型引用
        this.dataModel = null;
        
        // 初始化时预加载提示词
        this.loadPromptFromFile().then(prompt => {
            this._cachedPrompt = prompt;
            console.log('DeepSeek API 初始化完成，提示词已加载');
        }).catch(error => {
            console.error('加载提示词失败，使用默认提示词', error);
            this._cachedPrompt = this.getFallbackSystemPrompt();
        });
    }
    
    /**
     * 设置数据模型
     * @param {DataModel} dataModel - 数据模型实例
     * @returns {DeepSeekAPI} - 当前实例，支持链式调用
     */
    setDataModel(dataModel) {
        this.dataModel = dataModel;
        console.log('数据模型已设置');
        return this;
    }
    
    /**
     * 准备系统上下文
     * @returns {Promise<string>} - 包含系统数据的提示词
     */
    async prepareSystemContext() {
        // 获取基础提示词
        const basePrompt = await this.getSystemPrompt();
        
        // 如果没有数据模型，返回基础提示词
        if (!this.dataModel) {
            console.log('未设置数据模型，使用基础提示词');
            return basePrompt;
        }
        
        try {
            // 获取系统数据
            const projects = this.dataModel.projects || [];
            const requirements = this.dataModel.requirements || [];
            const tasks = this.dataModel.tasks || [];
            const teamMembers = this.dataModel.teamMembers || [];
            
            // 简化数据格式
            let dataContext = `\n\n## 系统数据\n当前系统中有以下数据，请基于这些数据回答用户问题：\n\n`;
            
            // 添加项目数据
            dataContext += `### 项目列表 (共${projects.length}个)\n`;
            projects.forEach((project, index) => {
                dataContext += `${index+1}. 项目：${project.name}\n   - 状态：${project.status}\n   - 进度：${project.progress}%\n   - 截止日期：${project.endDate}\n\n`;
            });
            
            // 添加需求数据
            dataContext += `### 需求列表 (共${requirements.length}个)\n`;
            requirements.forEach((req, index) => {
                const project = projects.find(p => p.id === req.projectId);
                dataContext += `${index+1}. 需求：${req.name}\n   - 所属项目：${project ? project.name : '未知'}\n   - 优先级：${req.priority}\n   - 状态：${req.status}\n\n`;
            });
            
            // 添加任务数据
            dataContext += `### 任务列表 (共${tasks.length}个)\n`;
            tasks.forEach((task, index) => {
                const project = projects.find(p => p.id === task.projectId);
                dataContext += `${index+1}. 任务：${task.name}\n   - 所属项目：${project ? project.name : '未知'}\n   - 状态：${task.status}\n   - 截止日期：${task.dueDate}\n\n`;
            });
            
            console.log('系统数据上下文已生成');
            
            // 组合提示词和数据上下文
            return `${basePrompt}${dataContext}`;
        } catch (error) {
            console.error('生成系统上下文失败:', error);
            return basePrompt;
        }
    }
    
    /**
     * 获取系统提示词
     * @returns {Promise<string>} - 系统提示词
     */
    async getSystemPrompt() {
        if (!this._cachedPrompt) {
            this._cachedPrompt = await this.loadPromptFromFile();
        }
        return this._cachedPrompt;
    }
    
    /**
     * 从文件加载提示词
     * @returns {Promise<string>} - 提示词
     */
    async loadPromptFromFile() {
        try {
            const response = await fetch('prompts/deepseek_prompt.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const prompt = await response.text();
            return prompt;
        } catch (error) {
            console.error('加载提示词文件失败:', error);
            return this.getFallbackSystemPrompt();
        }
    }
    
    /**
     * 获取后备系统提示词
     * @returns {string} - 后备系统提示词
     */
    getFallbackSystemPrompt() {
        return `# DeepSeek 工作助手提示词

## 角色定义
你是一个专业的个人工作助手，拥有丰富的项目管理、需求分析和任务跟踪经验。你的目标是帮助用户高效地组织工作、管理项目和完成任务。

## 核心能力
- 项目管理：帮助用户规划、跟踪和管理项目进度
- 需求分析：协助用户梳理、分析和优化需求
- 任务跟踪：提醒用户重要任务和截止日期
- 文档整理：帮助用户组织和管理文档
- 会议管理：协助安排会议并记录会议要点
- 决策支持：提供数据分析和决策建议

## 沟通风格
- 专业简洁：回答应该清晰、准确、直接切入主题
- 结构化输出：对于复杂信息，使用列表、表格等结构化方式呈现
- 积极主动：主动提供建议和解决方案，而不仅仅是回答问题
- 适度友好：保持专业的同时，语气友好亲切`;
    }
    
    /**
     * 保存聊天历史
     */
    saveHistory() {
        try {
            localStorage.setItem('deepseek_chat_history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('保存聊天历史失败:', error);
        }
    }
    
    /**
     * 加载聊天历史
     */
    loadHistory() {
        try {
            const history = localStorage.getItem('deepseek_chat_history');
            if (history) {
                this.conversationHistory = JSON.parse(history);
            }
        } catch (error) {
            console.error('加载聊天历史失败:', error);
            this.conversationHistory = [];
        }
    }
    
    /**
     * 清除聊天历史
     */
    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('deepseek_chat_history');
    }
    
    /**
     * 获取聊天历史
     * @returns {Array} - 聊天历史
     */
    getHistory() {
        return this.conversationHistory;
    }
    
    /**
     * 模拟响应（仅用于测试）
     * @param {string} message - 用户消息
     * @returns {string} - 模拟响应
     */
    simulateResponse(message) {
        const responses = [
            `我理解您的问题是关于"${message}"。作为您的工作助手，我建议您可以...`,
            `关于"${message}"，我有几点建议：\n1. 首先，明确目标和优先级\n2. 其次，制定详细的计划\n3. 最后，定期回顾和调整`,
            `您提到的"${message}"是一个很好的问题。从项目管理的角度，我认为...`,
            `"${message}"是一个常见的工作挑战。我建议您可以尝试以下方法解决...`,
            `我注意到您询问的是"${message}"。基于我的经验，最有效的方法是...`
        ];
        
        // 随机选择一个响应
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }
    
    /**
     * 发送消息到DeepSeek API
     * @param {string} message - 用户消息
     * @param {Function} onThinking - 思考状态回调
     * @param {Function} onResponse - 响应回调
     * @param {Function} onError - 错误回调
     * @returns {Promise<string>} - API响应
     */
    async sendMessage(message, onThinking, onResponse, onError) {
        // 更新思考状态
        if (onThinking) onThinking(true);
        
        // 添加用户消息到历史
        this.conversationHistory.push({
            role: 'user',
            content: message
        });
        
        // 如果使用模拟模式，返回模拟响应
        if (this.useSimulation) {
            console.log('使用模拟模式');
            
            // 模拟延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 生成模拟响应
            const simulatedResponse = this.simulateResponse(message);
            
            // 添加AI响应到历史
            this.conversationHistory.push({
                role: 'assistant',
                content: simulatedResponse
            });
            
            // 更新思考状态
            if (onThinking) onThinking(false);
            
            // 调用响应回调
            if (onResponse) onResponse(simulatedResponse);
            
            return simulatedResponse;
        }
        
        try {
            // 确保系统提示词已加载
            const systemPrompt = await this.getSystemPrompt();
            
            // 准备系统上下文（包含数据）
            const systemPromptWithContext = await this.prepareSystemContext();
            
            // 准备请求数据
            const requestData = {
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: systemPromptWithContext // 使用包含系统数据的提示词
                    },
                    ...this.conversationHistory
                ],
                temperature: 0.7,
                max_tokens: 1000
            };
            
            console.log('请求数据:', requestData);
            
            // 使用Cloudflare Workers代理发送API请求
            console.log('正在通过Cloudflare Workers代理调用DeepSeek API...');
            
            // 准备代理请求数据
            const proxyData = {
                url: this.apiUrl,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.apiKey
                },
                body: requestData
            };
            
            // 发送请求到Cloudflare Workers代理
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(proxyData)
            });
            
            // 检查响应状态
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API响应错误 (${response.status}): ${errorText}`);
            }
            
            // 解析响应
            const data = await response.json();
            
            // 提取AI回复
            if (!data.choices || data.choices.length === 0) {
                throw new Error('API响应格式不正确: ' + JSON.stringify(data));
            }
            
            const aiResponse = data.choices[0].message.content;
            
            // 添加AI响应到历史
            this.conversationHistory.push({
                role: 'assistant',
                content: aiResponse
            });
            
            // 保存聊天历史
            this.saveHistory();
            
            // 更新思考状态
            if (onThinking) onThinking(false);
            
            // 调用响应回调
            if (onResponse) onResponse(aiResponse);
            
            return aiResponse;
        } catch (error) {
            console.error('API调用失败:', error);
            
            // 更新思考状态
            if (onThinking) onThinking(false);
            
            // 调用错误回调
            if (onError) onError(error.message);
            
            throw error;
        }
    }
}
