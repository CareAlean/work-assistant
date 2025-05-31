/**
 * DeepSeek API 接口
 * 用于处理与DeepSeek AI的通信
 * 版本: 2.1.0
 */
class DeepSeekAPI {
    /**
     * 构造函数
     * @param {string} apiKey - DeepSeek API密钥
     */
    constructor(apiKey) {
        // 检查本地存储中是否有API密钥
        if (!apiKey) {
            apiKey = localStorage.getItem('deepseek_api_key');
        }
        
        // API配置
        this.apiKey = apiKey || '';
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        // 使用Vercel代理解决CORS问题
        this.proxyUrl = 'https://deepseek-proxy-zeta.vercel.app/api/proxy';
        // 备用代理地址，如果主代理失败会尝试使用
        this.fallbackProxyUrl = 'https://cors-anywhere.herokuapp.com/https://api.deepseek.com/v1/chat/completions';
        this.model = 'deepseek-chat'; // 使用正确的模型名称
        
        // 对话历史
        this.conversationHistory = [];
        this._cachedPrompt = null; // 缓存的提示词
        
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
     * 设置API密钥
     * @param {string} apiKey - API密钥
     * @returns {DeepSeekAPI} - 当前实例，支持链式调用
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('deepseek_api_key', apiKey);
        return this;
    }
    
    /**
     * 从文件加载提示词
     * @returns {Promise<string>} - 提示词文本
     */
    async loadPromptFromFile() {
        try {
            const response = await fetch('prompts/deepseek_prompt.txt');
            if (!response.ok) {
                console.error('加载提示词文件失败:', response.status);
                return this.getFallbackSystemPrompt();
            }
            const promptText = await response.text();
            console.log('成功从文件加载提示词');
            return promptText;
        } catch (error) {
            console.error('加载提示词文件错误:', error);
            return this.getFallbackSystemPrompt();
        }
    }
    
    /**
     * 获取默认系统提示词（如果文件加载失败）
     * @returns {string} - 默认提示词
     */
    getFallbackSystemPrompt() {
        return '你是一个智能工作助手，可以帮助用户管理项目、需求和任务。你应该提供清晰、简洁、有帮助的回答，并尽量满足用户的需求。';
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
     * 保存对话历史到本地存储
     * @returns {DeepSeekAPI} - 当前实例，支持链式调用
     */
    saveHistory() {
        try {
            localStorage.setItem('deepseek_conversation_history', JSON.stringify(this.conversationHistory));
            console.log('对话历史已保存到本地存储');
        } catch (error) {
            console.error('保存对话历史失败:', error);
        }
        return this;
    }
    
    /**
     * 从本地存储加载对话历史
     * @returns {DeepSeekAPI} - 当前实例，支持链式调用
     */
    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('deepseek_conversation_history');
            if (savedHistory) {
                this.conversationHistory = JSON.parse(savedHistory);
                console.log('从本地存储加载了对话历史');
            }
        } catch (error) {
            console.error('加载对话历史失败:', error);
        }
        return this;
    }
    
    /**
     * 清除对话历史
     * @returns {DeepSeekAPI} - 当前实例，支持链式调用
     */
    clearHistory() {
        this.conversationHistory = [];
        try {
            localStorage.removeItem('deepseek_conversation_history');
            console.log('对话历史已清除');
        } catch (error) {
            console.error('清除对话历史失败:', error);
        }
        return this;
    }
    
    /**
     * 获取对话历史
     * @returns {Array} - 对话历史数组
     */
    getHistory() {
        return this.conversationHistory;
    }
    
    /**
     * 设置系统提示词
     * @param {string} prompt - 新的系统提示词
     * @returns {DeepSeekAPI} - 当前实例，支持链式调用
     */
    setSystemPrompt(prompt) {
        this._cachedPrompt = prompt;
        return this;
    }
    
    /**
     * 发送消息到DeepSeek API
     * @param {string} message - 用户消息
     * @param {Function} onThinking - 思考状态回调
     * @param {Function} onResponse - 响应回调
     * @param {Function} onError - 错误回调
     * @returns {Promise<string>} - AI响应
     */
    async sendMessage(message, onThinking = null, onResponse = null, onError = null) {
        // 更新思考状态
        if (onThinking) onThinking(true);
        
        // 添加用户消息到历史
        this.conversationHistory.push({
            role: 'user',
            content: message
        });
        
        console.log('发送消息:', message);
        
        try {
            // 检查API密钥
            if (!this.apiKey) {
                throw new Error('请先设置DeepSeek API密钥');
            }
            
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
            
            console.log('正在通过Vercel代理调用DeepSeek API...');
            
            // 发送请求到Vercel代理
            console.log('尝试使用主代理地址:', this.proxyUrl);
            let response;
            try {
                response = await fetch(this.proxyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(proxyData),
                    mode: 'cors',
                    cache: 'no-cache'
                });
            } catch (proxyError) {
                console.warn('主代理请求失败，尝试直接调用API:', proxyError);
                
                // 尝试直接调用API（可能会有CORS问题）
                try {
                    response = await fetch(this.apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.apiKey
                        },
                        body: JSON.stringify(requestData),
                        mode: 'cors',
                        cache: 'no-cache'
                    });
                } catch (directError) {
                    console.error('直接API调用也失败，错误:', directError);
                    throw new Error('所有API调用方式均失败: ' + directError.message);
                }
            }
            
            // 检查响应状态
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API响应错误:', response.status, errorText);
                throw new Error('API响应错误: ' + response.status + ': ' + errorText);
            }
            
            // 解析响应
            const data = await response.json();
            console.log('API响应数据:', data);
            
            // 处理有效响应
            if (data && data.choices && data.choices.length > 0) {
                const aiResponse = data.choices[0].message.content;
                console.log('收到API响应');
                
                // 添加AI回复到历史
                this.conversationHistory.push({
                    role: 'assistant',
                    content: aiResponse
                });
                
                // 调用响应回调
                if (onResponse) onResponse(aiResponse);
                
                return aiResponse;
            } else {
                throw new Error('API响应格式不正确');
            }
        } catch (error) {
            console.error('API调用失败:', error);
            
            // 从历史中移除用户最后一条消息，避免重复
            if (this.conversationHistory.length > 0) {
                this.conversationHistory.pop();
            }
            
            // 详细记录错误信息，帮助调试
            let detailedError = error.message;
            if (error.stack) {
                console.error('错误堆栈:', error.stack);
            }
            
            // 检查是否是网络错误
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                detailedError = '网络连接错误，请检查您的网络连接或代理设置。可能是CORS问题导致。';
                console.warn('检测到网络错误，可能是CORS问题');
            }
            
            // 显示错误消息
            const errorMessage = 'DeepSeek API调用失败: ' + detailedError;
            if (onError) onError(errorMessage);
            
            return null; // 返回null而不是错误信息，让UI层处理错误显示
        } finally {
            // 更新思考状态
            if (onThinking) onThinking(false);
        }
    }
}
