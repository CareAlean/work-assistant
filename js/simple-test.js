/**
 * 简单测试脚本
 * 用于测试DeepSeek API是否能够访问数据模型
 */

// 创建一个简单的测试数据
const testData = {
    testNumber: 1,
    testString: "这是一个测试字符串",
    testArray: ["项目1", "任务2", "需求3"]
};

// 自动运行测试
document.addEventListener('DOMContentLoaded', function() {
    // 延迟一秒执行，确保所有组件都已初始化
    setTimeout(function() {
        console.log('自动运行简单测试...');
        runSimpleTest();
    }, 1000);
});

// 运行简单测试
async function runSimpleTest() {
    console.log('开始运行简单测试...');
    
    // 检查DeepSeek API是否存在
    if (!window.deepseekApi) {
        alert('错误: DeepSeek API未初始化');
        console.error('DeepSeek API未初始化');
        return;
    }
    
    try {
        // 1. 设置测试数据
        window.deepseekApi.testData = testData;
        console.log('测试数据已设置:', testData);
        
        // 2. 创建一个简单的方法来生成测试上下文
        window.deepseekApi.generateTestContext = async function() {
            const basePrompt = await this.getSystemPrompt();
            return `${basePrompt}\n\n## 测试数据\n这是一个简单的测试，请回答下面的问题：\n1. 测试数字是多少？\n2. 测试字符串是什么？\n3. 测试数组包含哪些元素？\n\n测试数字: ${this.testData.testNumber}\n测试字符串: ${this.testData.testString}\n测试数组: ${this.testData.testArray.join(', ')}`;
        };
        
        // 3. 发送测试消息
        const testMessage = "请告诉我测试数据中的测试数字是多少？";
        
        // 显示测试信息
        console.log('正在测试中，请稍候...');
        
        // 保存原始方法
        const originalPrepareContext = window.deepseekApi.prepareSystemContext;
        
        // 临时替换方法
        window.deepseekApi.prepareSystemContext = window.deepseekApi.generateTestContext;
        
        // 发送测试消息
        console.log('发送测试消息:', testMessage);
        const response = await window.deepseekApi.sendMessage(
            testMessage,
            null,
            (response) => {
                console.log('收到响应:', response);
                console.log('测试结果:');
                console.log(`- 测试消息: ${testMessage}`);
                console.log(`- AI响应: ${response}`);
                console.log(`- 分析: ${response.includes('1') ? '成功! AI能够看到测试数字' : '失败! AI无法看到测试数字'}`);
                
                // 恢复原始方法
                window.deepseekApi.prepareSystemContext = originalPrepareContext;
                
                // 继续测试数据模型集成
                testDataModelIntegration();
            },
            (error) => {
                console.error('测试失败:', error);
                console.log('简单测试失败，可能是API调用问题');
                
                // 恢复原始方法
                window.deepseekApi.prepareSystemContext = originalPrepareContext;
            }
        );
    } catch (error) {
        console.error('测试过程中出错:', error);
        alert('测试失败: ' + error.message);
    }
}
