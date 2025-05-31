# 个人工作助手

## 项目介绍
个人工作助手是一个基于DeepSeek API的智能助手网站，可以帮助用户管理项目、需求和任务。通过集成DeepSeek的AI能力，为用户提供智能对话和工作辅助功能。

## 功能特点
- 智能聊天界面：与AI助手进行自然语言对话
- 项目管理：记录和跟踪项目进度
- 需求管理：整理和分析项目需求
- 任务管理：创建和监控任务完成情况

## 技术架构
- 前端：HTML5 + CSS3 + JavaScript
- AI接口：DeepSeek API
- 数据存储：本地存储 (localStorage)
- 代理服务：Node.js代理服务器（解决CORS问题）

## 安装与使用

### 环境要求
- Node.js 14.0+
- 现代浏览器（Chrome、Firefox、Safari等）

### 安装步骤
1. 克隆或下载本项目
2. 进入项目目录
3. 启动代理服务器：`node proxy-server.js`
4. 启动Web服务器：`npx http-server -p 7777`
5. 浏览器访问：`http://localhost:7777`

## DeepSeek API集成指南

### 重要经验教训
在集成DeepSeek API时，我们遇到了一些关键问题，并总结了以下经验：

1. **正确的API端点**
   - ✅ 正确：`https://api.deepseek.com/v1/chat/completions`
   - ❌ 错误：`https://api.deepseek.ai/v1/chat/completions`

2. **正确的模型名称**
   - ✅ 正确：`deepseek-chat`
   - ❌ 错误：`deepseek-llm-67b-chat`

3. **处理CORS问题**
   - 浏览器直接调用DeepSeek API会遇到CORS限制
   - 解决方案：使用Node.js代理服务器中转请求

4. **API请求格式**
   ```javascript
   {
     "model": "deepseek-chat",
     "messages": [
       {
         "role": "system",
         "content": "你是一个智能助手，请简短回答问题。"
       },
       {
         "role": "user",
         "content": "用户问题"
       }
     ],
     "temperature": 0.7,
     "max_tokens": 100
   }
   ```

5. **API响应格式**
   ```javascript
   {
     "id": "响应ID",
     "object": "chat.completion",
     "created": 时间戳,
     "model": "deepseek-chat",
     "choices": [
       {
         "index": 0,
         "message": {
           "role": "assistant",
           "content": "AI回复内容"
         },
         "finish_reason": "stop"
       }
     ],
     "usage": {
       "prompt_tokens": 数值,
       "completion_tokens": 数值,
       "total_tokens": 数值
     }
   }
   ```

6. **常见错误与解决方案**
   - "Failed to fetch"：检查网络连接和代理服务器
   - "getaddrinfo ENOTFOUND"：检查API域名是否正确
   - 401错误：检查API密钥是否正确
   - 模型不存在错误：检查模型名称是否正确

7. **调试技巧**
   - 使用单独的Node.js脚本测试API连接
   - 检查浏览器控制台的网络请求
   - 在代理服务器添加详细日志

## 文件结构
- `index.html`：主页面
- `css/`：样式文件
- `js/`：JavaScript文件
  - `deepseek-api.js`：DeepSeek API集成
  - `chat-interface.js`：聊天界面逻辑
  - `data-model.js`：数据模型
- `proxy-server.js`：代理服务器
- `test-api.js`：API测试脚本

## 使用提示
1. 确保代理服务器在运行状态
2. 使用"测试API"按钮可以直接测试API连接
3. 聊天历史会自动保存到本地存储

## 问题排查
如果遇到API调用问题：
1. 检查代理服务器是否正常运行
2. 确认API密钥是否正确
3. 查看浏览器控制台是否有错误信息
4. 尝试使用test-api.js脚本直接测试API

## 后续开发计划
- 添加更多项目管理功能
- 优化聊天界面体验
- 增加数据分析功能
- 支持多用户协作

## 许可证
本项目仅供个人学习和使用。

## 联系方式
如有问题或建议，请联系项目维护者。
