/**
 * API密钥管理器
 * 用于安全地存储和管理DeepSeek API密钥
 */
class ApiKeyManager {
    constructor() {
        this.storageKey = 'deepseek_api_key';
        this.initEventListeners();
    }

    /**
     * 初始化事件监听器
     */
    initEventListeners() {
        // 页面加载完成后检查是否有保存的API密钥
        document.addEventListener('DOMContentLoaded', () => {
            this.loadApiKey();
            
            // 保存按钮点击事件
            const saveButton = document.getElementById('save-api-key');
            if (saveButton) {
                saveButton.addEventListener('click', () => this.saveApiKey());
            }
            
            // 设置按钮点击事件
            const settingsButton = document.getElementById('settings-button');
            if (settingsButton) {
                settingsButton.addEventListener('click', () => {
                    const settingsPanel = document.getElementById('settings-panel');
                    if (settingsPanel) {
                        settingsPanel.classList.add('show');
                    }
                });
            }
            
            // 关闭设置面板按钮
            const closeSettings = document.getElementById('close-settings');
            if (closeSettings) {
                closeSettings.addEventListener('click', () => {
                    const settingsPanel = document.getElementById('settings-panel');
                    if (settingsPanel) {
                        settingsPanel.classList.remove('show');
                    }
                });
            }
        });
    }

    /**
     * 保存API密钥到本地存储
     */
    saveApiKey() {
        const apiKeyInput = document.getElementById('api-key');
        if (!apiKeyInput) return;
        
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            this.showNotification('请输入有效的API密钥', 'error');
            return;
        }
        
        // 简单验证API密钥格式
        if (!apiKey.startsWith('sk-')) {
            this.showNotification('API密钥格式不正确，应以sk-开头', 'error');
            return;
        }
        
        // 保存到本地存储
        localStorage.setItem(this.storageKey, apiKey);
        this.showNotification('API密钥已保存', 'success');
        
        // 更新DeepSeek API实例的密钥
        if (window.deepseekAPI) {
            window.deepseekAPI.setApiKey(apiKey);
        }
        
        // 关闭设置面板
        const settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel) {
            settingsPanel.classList.remove('show');
        }
    }

    /**
     * 从本地存储加载API密钥
     */
    loadApiKey() {
        const apiKey = localStorage.getItem(this.storageKey);
        if (apiKey) {
            // 填充输入框
            const apiKeyInput = document.getElementById('api-key');
            if (apiKeyInput) {
                apiKeyInput.value = apiKey;
            }
            
            // 更新DeepSeek API实例的密钥
            if (window.deepseekAPI) {
                window.deepseekAPI.setApiKey(apiKey);
            }
        }
    }

    /**
     * 获取API密钥
     * @returns {string|null} API密钥或null
     */
    getApiKey() {
        return localStorage.getItem(this.storageKey);
    }

    /**
     * 显示通知
     * @param {string} message 通知消息
     * @param {string} type 通知类型 (success, error, info)
     */
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 创建全局实例
window.apiKeyManager = new ApiKeyManager();
