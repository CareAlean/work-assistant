/**
 * 数据模型测试脚本
 * 用于测试DeepSeek API是否能够访问数据模型
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 延迟执行，确保所有组件都已初始化
    setTimeout(function() {
        console.log('开始测试数据模型集成...');
        testDataModelIntegration();
    }, 1500);
});

// 测试数据模型集成
async function testDataModelIntegration() {
    console.log('\n开始测试数据模型集成...');
    
    // 检查数据模型是否存在
    if (!window.dataModel) {
        console.error('数据模型未初始化');
        return;
    }
    
    // 检查DeepSeek API是否存在
    if (!window.deepseekApi) {
        console.error('DeepSeek API未初始化');
        return;
    }
    
    try {
        // 1. 确保数据模型已设置到DeepSeek API
        window.deepseekApi.setDataModel(window.dataModel);
        console.log('数据模型已设置到DeepSeek API');
        
        // 2. 检查数据模型内容
        console.log('数据模型内容:');
        console.log(`- 项目数量: ${window.dataModel.projects.length}`);
        console.log(`- 需求数量: ${window.dataModel.requirements.length}`);
        console.log(`- 任务数量: ${window.dataModel.tasks.length}`);
        console.log(`- 团队成员数量: ${window.dataModel.teamMembers.length}`);
        
        // 3. 生成系统上下文
        console.log('生成系统上下文...');
        const systemContext = await window.deepseekApi.prepareSystemContext();
        console.log('系统上下文生成成功，前200个字符:');
        console.log(systemContext.substring(0, 200) + '...');
        
        // 4. 检查系统上下文是否包含数据模型信息
        const containsProjects = systemContext.includes('项目信息');
        const containsRequirements = systemContext.includes('需求信息');
        const containsTasks = systemContext.includes('任务信息');
        const containsTeamMembers = systemContext.includes('团队成员信息');
        
        console.log('系统上下文分析:');
        console.log(`- 包含项目信息: ${containsProjects ? '是' : '否'}`);
        console.log(`- 包含需求信息: ${containsRequirements ? '是' : '否'}`);
        console.log(`- 包含任务信息: ${containsTasks ? '是' : '否'}`);
        console.log(`- 包含团队成员信息: ${containsTeamMembers ? '是' : '否'}`);
        
        // 5. 发送测试消息
        console.log('\n发送数据模型测试消息...');
        const testMessage = "我的项目有哪些？";
        
        // 发送测试消息
        await window.deepseekApi.sendMessage(
            testMessage,
            null,
            (response) => {
                console.log('收到响应:', response);
                console.log('数据模型测试结果:');
                console.log(`- 测试消息: ${testMessage}`);
                console.log(`- AI响应: ${response}`);
                
                // 分析响应是否包含项目信息
                const mentionsProjects = window.dataModel.projects.some(project => 
                    response.includes(project.name));
                
                console.log(`- 分析: ${mentionsProjects ? '成功! AI能够看到项目数据' : '失败! AI无法看到项目数据'}`);
                
                // 输出问题诊断
                if (!mentionsProjects) {
                    console.log('\n问题诊断:');
                    console.log('1. 数据模型可能未正确设置到DeepSeek API');
                    console.log('2. prepareSystemContext方法可能未正确生成包含数据的上下文');
                    console.log('3. DeepSeek API可能忽略了系统提示词中的数据部分');
                    console.log('4. 代理服务器可能未正确转发请求或响应');
                    
                    // 提出解决方案
                    console.log('\n可能的解决方案:');
                    console.log('1. 直接在提示词中硬编码一些测试数据');
                    console.log('2. 简化数据格式，确保DeepSeek API能够理解');
                    console.log('3. 检查代理服务器日志，确保请求正确转发');
                    console.log('4. 修改prepareSystemContext方法，使数据更突出');
                }
            },
            (error) => {
                console.error('数据模型测试失败:', error);
            }
        );
    } catch (error) {
        console.error('测试数据模型集成过程中出错:', error);
    }
}
