/**
 * 数据模型
 * 用于管理项目、需求和任务的数据结构
 * 版本: 1.0.0
 */

class DataModel {
    constructor() {
        // 初始化存储
        this.projects = [];
        this.requirements = [];
        this.tasks = [];
        this.teamMembers = [];
        
        // 加载数据
        this.loadData();
        
        // 如果没有数据，创建示例数据
        if (this.projects.length === 0) {
            this.createSampleData();
        }
    }
    
    /**
     * 加载数据
     */
    loadData() {
        try {
            // 从本地存储加载数据
            const projectsData = localStorage.getItem('work_assistant_projects');
            const requirementsData = localStorage.getItem('work_assistant_requirements');
            const tasksData = localStorage.getItem('work_assistant_tasks');
            const teamMembersData = localStorage.getItem('work_assistant_team_members');
            
            if (projectsData) this.projects = JSON.parse(projectsData);
            if (requirementsData) this.requirements = JSON.parse(requirementsData);
            if (tasksData) this.tasks = JSON.parse(tasksData);
            if (teamMembersData) this.teamMembers = JSON.parse(teamMembersData);
        } catch (error) {
            console.error('加载数据失败:', error);
            // 如果加载失败，重置数据
            this.projects = [];
            this.requirements = [];
            this.tasks = [];
            this.teamMembers = [];
        }
    }
    
    /**
     * 保存数据
     */
    saveData() {
        try {
            // 保存数据到本地存储
            localStorage.setItem('work_assistant_projects', JSON.stringify(this.projects));
            localStorage.setItem('work_assistant_requirements', JSON.stringify(this.requirements));
            localStorage.setItem('work_assistant_tasks', JSON.stringify(this.tasks));
            localStorage.setItem('work_assistant_team_members', JSON.stringify(this.teamMembers));
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }
    
    /**
     * 创建示例数据
     */
    createSampleData() {
        // 创建团队成员
        const teamMembers = [
            { id: 'tm1', name: '张三', role: '前端开发', avatar: '👨‍💻' },
            { id: 'tm2', name: '李四', role: '后端开发', avatar: '👩‍💻' },
            { id: 'tm3', name: '王五', role: 'UI设计师', avatar: '👨‍🎨' },
            { id: 'tm4', name: '赵六', role: '产品经理', avatar: '👩‍💼' }
        ];
        
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
                projectId: 'p1',
                name: '需求管理模块',
                description: '创建需求管理模块，支持需求的创建、编辑和删除',
                priority: 'medium',
                status: 'planned',
                owner: 'tm4',
                assignee: 'tm1'
            },
            {
                id: 'r5',
                projectId: 'p1',
                name: '任务管理模块',
                description: '创建任务管理模块，支持任务的创建、编辑和删除',
                priority: 'medium',
                status: 'planned',
                owner: 'tm4',
                assignee: 'tm1'
            }
        ];
        
        // 创建任务
        const tasks = [
            {
                id: 't1',
                projectId: 'p1',
                requirementId: 'r1',
                name: 'UI设计评审',
                description: '评审仪表盘的UI设计',
                priority: 'high',
                status: 'in-progress', // not-started, in-progress, completed, on-hold, cancelled
                startDate: '2025-05-30',
                dueDate: '2025-05-30 18:00',
                owner: 'tm4',
                assignee: 'tm3'
            },
            {
                id: 't2',
                projectId: 'p1',
                requirementId: 'r2',
                name: '前端框架选型',
                description: '选择适合项目的前端框架',
                priority: 'medium',
                status: 'in-progress',
                startDate: '2025-05-30',
                dueDate: '2025-05-31 10:00',
                owner: 'tm4',
                assignee: 'tm1'
            },
            {
                id: 't3',
                projectId: 'p1',
                requirementId: 'r2',
                name: '需求文档定稿',
                description: '完成需求文档的定稿',
                priority: 'medium',
                status: 'in-progress',
                startDate: '2025-05-30',
                dueDate: '2025-06-01 15:00',
                owner: 'tm4',
                assignee: 'tm4'
            },
            {
                id: 't4',
                projectId: 'p1',
                requirementId: 'r2',
                name: '团队周会准备',
                description: '准备团队周会的议程和材料',
                priority: 'low',
                status: 'not-started',
                startDate: '2025-05-30',
                dueDate: '2025-06-02 14:00',
                owner: 'tm4',
                assignee: 'tm4'
            }
        ];
        
        // 保存示例数据
        this.teamMembers = teamMembers;
        this.projects = projects;
        this.requirements = requirements;
        this.tasks = tasks;
        
        // 保存到本地存储
        this.saveData();
    }
    
    /**
     * 获取所有项目
     * @param {Object} filters - 过滤条件
     * @returns {Array} 项目列表
     */
    getProjects(filters = {}) {
        let result = [...this.projects];
        
        // 应用过滤条件
        if (filters.status) {
            result = result.filter(project => project.status === filters.status);
        }
        
        if (filters.owner) {
            result = result.filter(project => project.owner === filters.owner);
        }
        
        if (filters.team) {
            result = result.filter(project => project.team.includes(filters.team));
        }
        
        return result;
    }
    
    /**
     * 获取项目详情
     * @param {string} projectId - 项目ID
     * @returns {Object} 项目详情
     */
    getProject(projectId) {
        return this.projects.find(project => project.id === projectId);
    }
    
    /**
     * 添加项目
     * @param {Object} project - 项目数据
     * @returns {Object} 添加的项目
     */
    addProject(project) {
        // 生成ID
        project.id = 'p' + (this.projects.length + 1);
        
        // 添加项目
        this.projects.push(project);
        
        // 保存数据
        this.saveData();
        
        return project;
    }
    
    /**
     * 更新项目
     * @param {string} projectId - 项目ID
     * @param {Object} data - 更新的数据
     * @returns {Object} 更新后的项目
     */
    updateProject(projectId, data) {
        // 查找项目
        const index = this.projects.findIndex(project => project.id === projectId);
        
        if (index === -1) {
            throw new Error(`项目 ${projectId} 不存在`);
        }
        
        // 更新项目
        this.projects[index] = { ...this.projects[index], ...data };
        
        // 保存数据
        this.saveData();
        
        return this.projects[index];
    }
    
    /**
     * 删除项目
     * @param {string} projectId - 项目ID
     * @returns {boolean} 是否成功
     */
    deleteProject(projectId) {
        // 查找项目
        const index = this.projects.findIndex(project => project.id === projectId);
        
        if (index === -1) {
            throw new Error(`项目 ${projectId} 不存在`);
        }
        
        // 删除项目
        this.projects.splice(index, 1);
        
        // 删除相关的需求和任务
        this.requirements = this.requirements.filter(requirement => requirement.projectId !== projectId);
        this.tasks = this.tasks.filter(task => task.projectId !== projectId);
        
        // 保存数据
        this.saveData();
        
        return true;
    }
    
    /**
     * 获取所有需求
     * @param {Object} filters - 过滤条件
     * @returns {Array} 需求列表
     */
    getRequirements(filters = {}) {
        let result = [...this.requirements];
        
        // 应用过滤条件
        if (filters.projectId) {
            result = result.filter(requirement => requirement.projectId === filters.projectId);
        }
        
        if (filters.status) {
            result = result.filter(requirement => requirement.status === filters.status);
        }
        
        if (filters.priority) {
            result = result.filter(requirement => requirement.priority === filters.priority);
        }
        
        if (filters.owner) {
            result = result.filter(requirement => requirement.owner === filters.owner);
        }
        
        if (filters.assignee) {
            result = result.filter(requirement => requirement.assignee === filters.assignee);
        }
        
        return result;
    }
    
    /**
     * 获取需求详情
     * @param {string} requirementId - 需求ID
     * @returns {Object} 需求详情
     */
    getRequirement(requirementId) {
        return this.requirements.find(requirement => requirement.id === requirementId);
    }
    
    /**
     * 添加需求
     * @param {Object} requirement - 需求数据
     * @returns {Object} 添加的需求
     */
    addRequirement(requirement) {
        // 生成ID
        requirement.id = 'r' + (this.requirements.length + 1);
        
        // 添加需求
        this.requirements.push(requirement);
        
        // 保存数据
        this.saveData();
        
        return requirement;
    }
    
    /**
     * 更新需求
     * @param {string} requirementId - 需求ID
     * @param {Object} data - 更新的数据
     * @returns {Object} 更新后的需求
     */
    updateRequirement(requirementId, data) {
        // 查找需求
        const index = this.requirements.findIndex(requirement => requirement.id === requirementId);
        
        if (index === -1) {
            throw new Error(`需求 ${requirementId} 不存在`);
        }
        
        // 更新需求
        this.requirements[index] = { ...this.requirements[index], ...data };
        
        // 保存数据
        this.saveData();
        
        return this.requirements[index];
    }
    
    /**
     * 删除需求
     * @param {string} requirementId - 需求ID
     * @returns {boolean} 是否成功
     */
    deleteRequirement(requirementId) {
        // 查找需求
        const index = this.requirements.findIndex(requirement => requirement.id === requirementId);
        
        if (index === -1) {
            throw new Error(`需求 ${requirementId} 不存在`);
        }
        
        // 删除需求
        this.requirements.splice(index, 1);
        
        // 删除相关的任务
        this.tasks = this.tasks.filter(task => task.requirementId !== requirementId);
        
        // 保存数据
        this.saveData();
        
        return true;
    }
    
    /**
     * 获取所有任务
     * @param {Object} filters - 过滤条件
     * @returns {Array} 任务列表
     */
    getTasks(filters = {}) {
        let result = [...this.tasks];
        
        // 应用过滤条件
        if (filters.projectId) {
            result = result.filter(task => task.projectId === filters.projectId);
        }
        
        if (filters.requirementId) {
            result = result.filter(task => task.requirementId === filters.requirementId);
        }
        
        if (filters.status) {
            result = result.filter(task => task.status === filters.status);
        }
        
        if (filters.priority) {
            result = result.filter(task => task.priority === filters.priority);
        }
        
        if (filters.owner) {
            result = result.filter(task => task.owner === filters.owner);
        }
        
        if (filters.assignee) {
            result = result.filter(task => task.assignee === filters.assignee);
        }
        
        // 按截止日期排序
        result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        return result;
    }
    
    /**
     * 获取任务详情
     * @param {string} taskId - 任务ID
     * @returns {Object} 任务详情
     */
    getTask(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }
    
    /**
     * 添加任务
     * @param {Object} task - 任务数据
     * @returns {Object} 添加的任务
     */
    addTask(task) {
        // 生成ID
        task.id = 't' + (this.tasks.length + 1);
        
        // 添加任务
        this.tasks.push(task);
        
        // 保存数据
        this.saveData();
        
        return task;
    }
    
    /**
     * 更新任务
     * @param {string} taskId - 任务ID
     * @param {Object} data - 更新的数据
     * @returns {Object} 更新后的任务
     */
    updateTask(taskId, data) {
        // 查找任务
        const index = this.tasks.findIndex(task => task.id === taskId);
        
        if (index === -1) {
            throw new Error(`任务 ${taskId} 不存在`);
        }
        
        // 更新任务
        this.tasks[index] = { ...this.tasks[index], ...data };
        
        // 保存数据
        this.saveData();
        
        return this.tasks[index];
    }
    
    /**
     * 删除任务
     * @param {string} taskId - 任务ID
     * @returns {boolean} 是否成功
     */
    deleteTask(taskId) {
        // 查找任务
        const index = this.tasks.findIndex(task => task.id === taskId);
        
        if (index === -1) {
            throw new Error(`任务 ${taskId} 不存在`);
        }
        
        // 删除任务
        this.tasks.splice(index, 1);
        
        // 保存数据
        this.saveData();
        
        return true;
    }
    
    /**
     * 获取所有团队成员
     * @returns {Array} 团队成员列表
     */
    getTeamMembers() {
        return [...this.teamMembers];
    }
    
    /**
     * 获取团队成员详情
     * @param {string} memberId - 团队成员ID
     * @returns {Object} 团队成员详情
     */
    getTeamMember(memberId) {
        return this.teamMembers.find(member => member.id === memberId);
    }
    
    /**
     * 添加团队成员
     * @param {Object} member - 团队成员数据
     * @returns {Object} 添加的团队成员
     */
    addTeamMember(member) {
        // 生成ID
        member.id = 'tm' + (this.teamMembers.length + 1);
        
        // 添加团队成员
        this.teamMembers.push(member);
        
        // 保存数据
        this.saveData();
        
        return member;
    }
    
    /**
     * 更新团队成员
     * @param {string} memberId - 团队成员ID
     * @param {Object} data - 更新的数据
     * @returns {Object} 更新后的团队成员
     */
    updateTeamMember(memberId, data) {
        // 查找团队成员
        const index = this.teamMembers.findIndex(member => member.id === memberId);
        
        if (index === -1) {
            throw new Error(`团队成员 ${memberId} 不存在`);
        }
        
        // 更新团队成员
        this.teamMembers[index] = { ...this.teamMembers[index], ...data };
        
        // 保存数据
        this.saveData();
        
        return this.teamMembers[index];
    }
    
    /**
     * 删除团队成员
     * @param {string} memberId - 团队成员ID
     * @returns {boolean} 是否成功
     */
    deleteTeamMember(memberId) {
        // 查找团队成员
        const index = this.teamMembers.findIndex(member => member.id === memberId);
        
        if (index === -1) {
            throw new Error(`团队成员 ${memberId} 不存在`);
        }
        
        // 删除团队成员
        this.teamMembers.splice(index, 1);
        
        // 保存数据
        this.saveData();
        
        return true;
    }
    
    /**
     * 获取待办任务
     * @param {Object} filters - 过滤条件
     * @returns {Array} 待办任务列表
     */
    getTodoTasks(filters = {}) {
        // 获取未完成的任务
        const todoStatuses = ['not-started', 'in-progress'];
        filters.status = todoStatuses;
        
        return this.getTasks(filters);
    }
    
    /**
     * 获取即将截止的任务
     * @param {number} days - 天数
     * @returns {Array} 即将截止的任务列表
     */
    getUpcomingTasks(days = 7) {
        const now = new Date();
        const future = new Date();
        future.setDate(future.getDate() + days);
        
        // 获取截止日期在指定范围内的任务
        return this.tasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate >= now && dueDate <= future && task.status !== 'completed';
        });
    }
    
    /**
     * 获取项目进度
     * @param {string} projectId - 项目ID
     * @returns {Object} 项目进度信息
     */
    getProjectProgress(projectId) {
        // 获取项目
        const project = this.getProject(projectId);
        
        if (!project) {
            throw new Error(`项目 ${projectId} 不存在`);
        }
        
        // 获取项目的需求
        const requirements = this.getRequirements({ projectId });
        
        // 获取项目的任务
        const tasks = this.getTasks({ projectId });
        
        // 计算需求进度
        const completedRequirements = requirements.filter(req => req.status === 'completed').length;
        const requirementsProgress = requirements.length > 0 ? (completedRequirements / requirements.length) * 100 : 0;
        
        // 计算任务进度
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const tasksProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
        
        // 综合进度
        const progress = (requirementsProgress + tasksProgress) / 2;
        
        return {
            project,
            requirements: {
                total: requirements.length,
                completed: completedRequirements,
                progress: requirementsProgress
            },
            tasks: {
                total: tasks.length,
                completed: completedTasks,
                progress: tasksProgress
            },
            progress
        };
    }
    
    /**
     * 获取团队成员工作负载
     * @returns {Array} 团队成员工作负载列表
     */
    getTeamWorkload() {
        // 获取所有团队成员
        const members = this.getTeamMembers();
        
        // 计算每个成员的工作负载
        return members.map(member => {
            // 获取成员负责的任务
            const tasks = this.getTasks({ assignee: member.id, status: ['not-started', 'in-progress'] });
            
            // 计算工作负载
            const workload = {
                member,
                tasks: tasks.length,
                highPriority: tasks.filter(task => task.priority === 'high').length,
                mediumPriority: tasks.filter(task => task.priority === 'medium').length,
                lowPriority: tasks.filter(task => task.priority === 'low').length,
                upcomingDeadlines: tasks.filter(task => {
                    const dueDate = new Date(task.dueDate);
                    const now = new Date();
                    const threeDaysLater = new Date();
                    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
                    return dueDate >= now && dueDate <= threeDaysLater;
                }).length
            };
            
            // 计算工作负载分数 (高优先级 * 3 + 中优先级 * 2 + 低优先级 * 1 + 即将截止 * 2)
            workload.score = workload.highPriority * 3 + workload.mediumPriority * 2 + workload.lowPriority + workload.upcomingDeadlines * 2;
            
            return workload;
        });
    }
}

// 导出DataModel类
window.DataModel = DataModel;
