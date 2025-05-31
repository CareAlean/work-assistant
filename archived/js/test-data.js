/**
 * 测试数据生成器
 * 用于生成测试数据，帮助测试DeepSeek API的数据集成功能
 * 版本: 1.0.0
 */

function loadTestData() {
    console.log('加载测试数据...');
    
    // 检查是否已有数据模型实例
    if (!window.dataModel) {
        console.error('数据模型未初始化，无法加载测试数据');
        return;
    }
    
    // 检查是否已有数据
    if (window.dataModel.projects.length > 0) {
        console.log('已有数据，跳过测试数据加载');
        return;
    }
    
    // 创建团队成员
    const teamMembers = [
        { id: 'tm1', name: '张三', role: '前端开发', avatar: '👨‍💻' },
        { id: 'tm2', name: '李四', role: '后端开发', avatar: '👩‍💻' },
        { id: 'tm3', name: '王五', role: 'UI设计师', avatar: '👨‍🎨' },
        { id: 'tm4', name: '赵六', role: '产品经理', avatar: '👩‍💼' }
    ];
    
    // 添加团队成员
    teamMembers.forEach(member => {
        window.dataModel.teamMembers.push(member);
    });
    
    // 创建项目
    const projects = [
        {
            id: 'p1',
            name: '工作助手',
            description: '开发一个帮助管理项目、需求和任务的工作助手',
            startDate: '2025-05-15',
            endDate: '2025-06-15',
            status: 'in-progress', // in-progress, completed, on-hold, cancelled
            progress: 65,
            owner: 'tm4',
            team: ['tm1', 'tm2', 'tm3', 'tm4']
        },
        {
            id: 'p2',
            name: '客户管理系统',
            description: '开发一个客户关系管理系统',
            startDate: '2025-06-01',
            endDate: '2025-07-30',
            status: 'planned', // planned, in-progress, completed, on-hold, cancelled
            progress: 0,
            owner: 'tm4',
            team: ['tm1', 'tm2']
        }
    ];
    
    // 添加项目
    projects.forEach(project => {
        window.dataModel.projects.push(project);
    });
    
    // 创建需求
    const requirements = [
        {
            id: 'r1',
            projectId: 'p1',
            name: '仪表盘功能',
            description: '创建一个仪表盘，显示项目、需求和任务的概览',
            priority: 'high', // high, medium, low
            status: 'in-progress', // planned, in-progress, completed, on-hold, cancelled
            owner: 'tm4',
            assignee: 'tm1'
        },
        {
            id: 'r2',
            projectId: 'p1',
            name: 'DeepSeek集成',
            description: '集成DeepSeek AI，提供智能助手功能',
            priority: 'high',
            status: 'in-progress',
            owner: 'tm4',
            assignee: 'tm2'
        },
        {
            id: 'r3',
            projectId: 'p1',
            name: '项目管理模块',
            description: '创建项目管理模块，支持项目的创建、编辑和删除',
            priority: 'medium',
            status: 'planned',
            owner: 'tm4',
            assignee: 'tm1'
        },
        {
            id: 'r4',
            projectId: 'p2',
            name: '客户信息管理',
            description: '实现客户信息的增删改查功能',
            priority: 'high',
            status: 'planned',
            owner: 'tm4',
            assignee: 'tm2'
        },
        {
            id: 'r5',
            projectId: 'p2',
            name: '数据分析报表',
            description: '实现客户数据的分析和报表功能',
            priority: 'medium',
            status: 'planned',
            owner: 'tm4',
            assignee: 'tm1'
        }
    ];
    
    // 添加需求
    requirements.forEach(requirement => {
        window.dataModel.requirements.push(requirement);
    });
    
    // 创建任务
    const tasks = [
        {
            id: 't1',
            projectId: 'p1',
            requirementId: 'r1',
            name: 'UI设计评审',
            description: '评审仪表盘的UI设计',
            priority: 'high',
            status: 'completed', // not-started, in-progress, completed, on-hold, cancelled
            startDate: '2025-05-20',
            dueDate: '2025-05-25',
            completedDate: '2025-05-24',
            owner: 'tm4',
            assignee: 'tm3',
            progress: 100
        },
        {
            id: 't2',
            projectId: 'p1',
            requirementId: 'r1',
            name: '前端实现',
            description: '实现仪表盘的前端界面',
            priority: 'high',
            status: 'in-progress',
            startDate: '2025-05-26',
            dueDate: '2025-06-05',
            owner: 'tm4',
            assignee: 'tm1',
            progress: 60
        },
        {
            id: 't3',
            projectId: 'p1',
            requirementId: 'r2',
            name: 'API集成',
            description: '集成DeepSeek API',
            priority: 'high',
            status: 'in-progress',
            startDate: '2025-05-26',
            dueDate: '2025-06-02',
            owner: 'tm4',
            assignee: 'tm2',
            progress: 80
        },
        {
            id: 't4',
            projectId: 'p1',
            requirementId: 'r2',
            name: '聊天界面实现',
            description: '实现与DeepSeek AI的聊天界面',
            priority: 'medium',
            status: 'not-started',
            startDate: '2025-06-03',
            dueDate: '2025-06-10',
            owner: 'tm4',
            assignee: 'tm1',
            progress: 0
        },
        {
            id: 't5',
            projectId: 'p1',
            requirementId: 'r3',
            name: '需求分析',
            description: '分析项目管理模块的需求',
            priority: 'medium',
            status: 'not-started',
            startDate: '2025-06-01',
            dueDate: '2025-06-05',
            owner: 'tm4',
            assignee: 'tm4',
            progress: 0
        }
    ];
    
    // 添加任务
    tasks.forEach(task => {
        window.dataModel.tasks.push(task);
    });
    
    // 保存数据
    window.dataModel.saveData();
    
    console.log('测试数据加载完成');
}

// 在页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('准备加载测试数据...');
    
    // 检查数据模型是否已初始化
    const checkDataModel = function() {
        if (window.dataModel) {
            console.log('数据模型已初始化，加载测试数据');
            loadTestData();
            
            // 如果有DeepSeek API实例，设置数据模型
            if (window.deepseekApi) {
                console.log('设置DeepSeek API的数据模型');
                window.deepseekApi.setDataModel(window.dataModel);
            }
        } else {
            console.log('数据模型未初始化，等待...');
            setTimeout(checkDataModel, 100);
        }
    };
    
    // 开始检查
    checkDataModel();
});
