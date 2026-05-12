// 家庭打卡奖励程序 - 主程序逻辑

// 初始化数据
let currentUser = null;
let users = {
    '圆圆': {
        points: 300,
        level: '熟练',
        tasks: [
            { id: 1, name: '完成数学作业', category: 'study', points: 15, completed: false, completedToday: false },
            { id: 2, name: '阅读30分钟', category: 'study', points: 10, completed: false, completedToday: false },
            { id: 3, name: '跳绳100下', category: 'sports', points: 10, completed: false, completedToday: false },
            { id: 4, name: '户外运动30分钟', category: 'sports', points: 15, completed: false, completedToday: false },
            { id: 5, name: '玩益智游戏', category: 'game', points: 5, completed: false, completedToday: false }
        ],
        rewards: [
            { id: 1, name: '玩电子游戏30分钟', cost: 50, redeemed: false },
            { id: 2, name: '看动画片1集', cost: 30, redeemed: false },
            { id: 3, name: '买一本新书', cost: 200, redeemed: false },
            { id: 4, name: '去游乐场', cost: 500, redeemed: false }
        ],
        achievements: [1, 2, 3, 4, 8],
        checkinHistory: {},
        totalPoints: 300,
        streak: 5
    },
    '爸爸': {
        points: 0,
        level: '新手',
        tasks: [
            { id: 1, name: '阅读专业书籍1小时', category: 'reading', points: 20, completed: false, completedToday: false },
            { id: 2, name: '学习新技术30分钟', category: 'study', points: 15, completed: false, completedToday: false },
            { id: 3, name: '完成家务打扫', category: 'housework', points: 15, completed: false, completedToday: false },
            { id: 4, name: '跑步5公里', category: 'sports', points: 20, completed: false, completedToday: false },
            { id: 5, name: '做晚饭', category: 'housework', points: 10, completed: false, completedToday: false }
        ],
        rewards: [
            { id: 1, name: '买一本新书', cost: 100, redeemed: false },
            { id: 2, name: '周末睡懒觉', cost: 50, redeemed: false },
            { id: 3, name: '和朋友聚餐', cost: 200, redeemed: false },
            { id: 4, name: '买新电子产品', cost: 1000, redeemed: false }
        ],
        achievements: [],
        checkinHistory: {},
        totalPoints: 0,
        streak: 0
    },
    '妈妈': {
        points: 0,
        level: '新手',
        tasks: [
            { id: 1, name: '瑜伽/健身30分钟', category: 'sports', points: 15, completed: false, completedToday: false },
            { id: 2, name: '散步/跑步', category: 'sports', points: 10, completed: false, completedToday: false },
            { id: 3, name: '阅读30分钟', category: 'reading', points: 10, completed: false, completedToday: false }
        ],
        rewards: [
            { id: 1, name: '买新衣服', cost: 200, redeemed: false },
            { id: 2, name: 'SPA按摩', cost: 300, redeemed: false },
            { id: 3, name: '和朋友聚餐', cost: 150, redeemed: false },
            { id: 4, name: '买新护肤品', cost: 250, redeemed: false }
        ],
        achievements: [],
        checkinHistory: {},
        totalPoints: 0,
        streak: 0
    }
};

// 成就徽章定义 - 基于积分或其他条件解锁
const achievementsList = [
    { id: 1, name: '初学者', icon: '🌟', description: '累计获得10积分', condition: (user) => user.totalPoints >= 10, pointsRequired: 10 },
    { id: 2, name: '新秀', icon: '⭐', description: '累计获得50积分', condition: (user) => user.totalPoints >= 50, pointsRequired: 50 },
    { id: 3, name: '进阶者', icon: '💪', description: '累计获得100积分', condition: (user) => user.totalPoints >= 100, pointsRequired: 100 },
    { id: 4, name: '达人', icon: '🏅', description: '累计获得200积分', condition: (user) => user.totalPoints >= 200, pointsRequired: 200 },
    { id: 5, name: '高手', icon: '👑', description: '累计获得500积分', condition: (user) => user.totalPoints >= 500, pointsRequired: 500 },
    { id: 6, name: '大师', icon: '🎖️', description: '累计获得1000积分', condition: (user) => user.totalPoints >= 1000, pointsRequired: 1000 },
    { id: 7, name: '传奇', icon: '🏆', description: '累计获得2000积分', condition: (user) => user.totalPoints >= 2000, pointsRequired: 2000 },
    { id: 8, name: '坚持者', icon: '🔥', description: '连续打卡3天', condition: (user) => user.streak >= 3, streakRequired: 3 },
    { id: 9, name: '不缺席', icon: '⚡', description: '连续打卡7天', condition: (user) => user.streak >= 7, streakRequired: 7 },
    { id: 10, name: '打卡狂人', icon: '💎', description: '连续打卡30天', condition: (user) => user.streak >= 30, streakRequired: 30 }
];

// 加载自定义徽章
function loadCustomAchievements() {
    const customAchievements = JSON.parse(localStorage.getItem('customAchievements') || '[]');
    return customAchievements;
}

// 保存自定义徽章
function saveCustomAchievements(customList) {
    localStorage.setItem('customAchievements', JSON.stringify(customList));
}

// 判断徽章的稀有度
function getAchievementRarity(achievement) {
    // 根据所需积分或天数判断稀有度
    const required = achievement.pointsRequired || achievement.streakRequired || 0;
    
    if (achievement.pointsRequired) {
        // 按积分判断
        if (required >= 2000) return 'legendary';
        if (required >= 500) return 'epic';
        if (required >= 100) return 'rare';
        return 'common';
    } else if (achievement.streakRequired) {
        // 按连续天数判断
        if (required >= 30) return 'legendary';
        if (required >= 7) return 'epic';
        return 'common';
    }
    
    return 'common'; // 默认普通
}

// 获取稀有度显示名称
function getRarityName(rarity) {
    const names = {
        'common': '普通',
        'rare': '稀有',
        'epic': '史诗',
        'legendary': '传说'
    };
    return names[rarity] || '普通';
}

// 等级系统
const levels = [
    { name: '新手', minPoints: 0 },
    { name: '入门', minPoints: 50 },
    { name: '进阶', minPoints: 100 },
    { name: '熟练', minPoints: 200 },
    { name: '高手', minPoints: 500 },
    { name: '大师', minPoints: 1000 },
    { name: '宗师', minPoints: 2000 }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    checkAndResetAllUsersDailyTasks();
    loadAllAvatars();
    updateUserCards();
});

// 加载本地存储的数据
function loadData() {
    const savedData = localStorage.getItem('familyCheckinData');
    if (savedData) {
        users = JSON.parse(savedData);
    }
}

// 保存数据到本地存储
function saveData() {
    localStorage.setItem('familyCheckinData', JSON.stringify(users));
}

// 检查并重置所有用户的每日任务
function checkAndResetAllUsersDailyTasks() {
    const today = new Date().toISOString().split('T')[0];
    const lastResetDate = localStorage.getItem('lastResetDate');
    
    // 如果是新的一天，重置所有用户的completedToday标记
    if (lastResetDate !== today) {
        Object.keys(users).forEach(userName => {
            checkAndResetDailyTasks(userName);
        });
        localStorage.setItem('lastResetDate', today);
    }
}

// 检查并重置单个用户的每日任务
function checkAndResetDailyTasks(userName) {
    const user = users[userName];
    const today = new Date().toISOString().split('T')[0];
    
    // 根据今天的打卡记录，设置completedToday标记
    const todayCheckins = user.checkinHistory[today] || [];
    
    user.tasks.forEach(task => {
        // 如果任务在今天有打卡记录，标记为已完成
        if (todayCheckins.includes(task.id)) {
            task.completedToday = true;
        } else {
            task.completedToday = false;
        }
    });
}

// 更新用户卡片显示
function updateUserCards() {
    ['圆圆', '爸爸', '妈妈'].forEach(userName => {
        const user = users[userName];
        document.getElementById(`${getNameKey(userName)}-points`).textContent = user.points;
        document.getElementById(`${getNameKey(userName)}-level`).textContent = user.level;
    });
}

// 获取用户名对应的key
function getNameKey(userName) {
    if (userName === '圆圆') return 'yuanyuan';
    if (userName === '爸爸') return 'baba';
    if (userName === '妈妈') return 'mama';
    return '';
}

// 选择用户
function selectUser(userName) {
    currentUser = userName;
    
    // 检查并重置该用户的每日任务
    checkAndResetDailyTasks(currentUser);
    
    document.getElementById('user-select').classList.add('hidden');
    document.getElementById('main-interface').classList.remove('hidden');
    document.getElementById('current-user-title').textContent = `${userName}的打卡中心`;
    
    updateCurrentUserDisplay();
    loadHeaderAvatar();
    switchTab('checkin');
}

// 显示指定屏幕（用于切换用户等功能）
function showScreen(screenId) {
    // 隐藏所有主要屏幕
    document.getElementById('user-select').classList.add('hidden');
    document.getElementById('main-interface').classList.add('hidden');
    
    // 显示目标屏幕
    document.getElementById(screenId).classList.remove('hidden');
    
    // 如果显示用户选择界面，更新用户卡片
    if (screenId === 'user-select') {
        updateUserCards();
        currentUser = null;
    }
}

// 更新当前用户显示
function updateCurrentUserDisplay() {
    const user = users[currentUser];
    document.getElementById('current-points').textContent = user.points;
    document.getElementById('current-level').textContent = user.level;
}

// 刷新当前活动页面的所有数据
function refreshCurrentView() {
    if (!currentUser) return;
    
    // 更新顶部的积分和等级显示
    updateCurrentUserDisplay();
    
    // 更新用户选择页面的卡片
    updateUserCards();
    
    // 刷新当前活动标签页的内容
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        switch(tabName) {
            case 'checkin':
                loadTasks();
                break;
            case 'rewards':
                loadRewards();
                break;
            case 'statistics':
                loadStatistics();
                break;
            case 'achievements':
                loadAchievements();
                break;
            case 'family':
                loadFamilyScreen();
                break;
        }
    }
}

// 切换标签
function switchTab(tabName) {
    // 更新按钮状态 - 根据data-tab属性找到对应的按钮
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 隐藏所有屏幕
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    
    // 显示选中的屏幕
    const targetScreen = document.getElementById(`${tabName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // 加载对应内容
    switch(tabName) {
        case 'checkin':
            loadTasks();
            break;
        case 'rewards':
            loadRewards();
            break;
        case 'statistics':
            loadStatistics();
            break;
        case 'achievements':
            loadAchievements();
            break;
        case 'family':
            loadFamilyScreen();
            break;
    }
}

// 加载任务列表
function loadTasks() {
    const user = users[currentUser];
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    if (user.tasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无任务，请添加任务</p>';
        return;
    }
    
    user.tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completedToday ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <div class="task-info">
                <h4>${getCategoryIcon(task.category)} ${task.name}</h4>
                <p>完成可获得 ${task.points} 积分</p>
            </div>
            <div class="task-actions">
                <div class="task-points">+${task.points}</div>
                <button class="btn-edit" onclick="editTask(${task.id})" title="编辑任务">✏️</button>
                <button class="btn-delete" onclick="deleteTask(${task.id})" title="删除任务">🗑️</button>
                ${task.completedToday ? `
                <button class="btn-undo-checkin" onclick="undoCheckin(${task.id})" title="撤回本次打卡">↩️ 撤回</button>
                ` : ''}
                <button class="btn-checkin ${task.completedToday ? 'completed' : ''}" 
                        onclick="checkin(${task.id})" 
                        ${task.completedToday ? 'disabled' : ''}>
                    ${task.completedToday ? '✓ 已完成' : '打卡'}
                </button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

// 获取分类图标
function getCategoryIcon(category) {
    const icons = {
        'study': '📚',
        'sports': '🏃',
        'game': '🎮',
        'reading': '📖',
        'housework': '🏠'
    };
    return icons[category] || '⭐';
}

// 删除任务
function deleteTask(taskId) {
    if (!confirm('确定要删除这个任务吗？')) {
        return;
    }
    
    const user = users[currentUser];
    const taskIndex = user.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        const taskName = user.tasks[taskIndex].name;
        user.tasks.splice(taskIndex, 1);
        
        saveData();
        loadTasks();
        
        // 添加到家庭动态
        addFamilyFeed(currentUser, `删除了任务：${taskName}`);
    }
}

// 编辑任务
function editTask(taskId) {
    const user = users[currentUser];
    const task = user.tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    // 填充编辑表单
    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-name').value = task.name;
    document.getElementById('edit-task-category').value = task.category;
    document.getElementById('edit-task-points').value = task.points;
    
    // 显示编辑弹窗
    document.getElementById('edit-task-modal').classList.remove('hidden');
}

// 保存任务编辑
function saveTaskEdit() {
    const taskId = parseInt(document.getElementById('edit-task-id').value);
    const taskName = document.getElementById('edit-task-name').value;
    const category = document.getElementById('edit-task-category').value;
    const points = parseInt(document.getElementById('edit-task-points').value);
    
    if (!taskName) {
        alert('请输入任务名称');
        return;
    }
    
    if (points < 1 || points > 100) {
        alert('积分必须在1-100之间');
        return;
    }
    
    const user = users[currentUser];
    const task = user.tasks.find(t => t.id === taskId);
    
    if (task) {
        task.name = taskName;
        task.category = category;
        task.points = points;
        
        saveData();
        loadTasks();
        closeEditModal();
        
        // 添加到家庭动态
        addFamilyFeed(currentUser, `修改了任务：${taskName}`);
    }
}

// 关闭编辑弹窗
function closeEditModal() {
    document.getElementById('edit-task-modal').classList.add('hidden');
}

// 打卡
function checkin(taskId) {
    const user = users[currentUser];
    const task = user.tasks.find(t => t.id === taskId);
    
    if (task && !task.completedToday) {
        // 添加积分
        user.points += task.points;
        user.totalPoints += task.points;
        
        // 标记完成
        task.completed = true;
        task.completedToday = true;
        
        // 更新连续打卡天数
        updateStreak(currentUser);
        
        // 记录打卡历史
        const today = new Date().toISOString().split('T')[0];
        if (!user.checkinHistory[today]) {
            user.checkinHistory[today] = [];
        }
        user.checkinHistory[today].push(task.id);
        
        // 更新等级
        updateLevel(currentUser);
        
        // 检查成就
        checkAchievements(currentUser);
        
        // 保存数据
        saveData();
        
        // 更新顶部的积分和等级显示
        updateCurrentUserDisplay();
        updateUserCards();
        
        // 就地更新打卡按钮状态（不重新渲染整个列表，避免闪烁）
        updateTaskItemUI(taskId);
        
        // 显示成功弹窗
        showCheckinModal(task);
    }
}

// 撤回打卡
function undoCheckin(taskId) {
    const user = users[currentUser];
    const task = user.tasks.find(t => t.id === taskId);
    
    if (!task || !task.completedToday) return;
    
    if (!confirm(`确定要撤回「${task.name}」的打卡吗？将扣除 ${task.points} 积分。`)) {
        return;
    }
    
    // 扣除积分（不低于0）
    user.points = Math.max(0, user.points - task.points);
    user.totalPoints = Math.max(0, user.totalPoints - task.points);
    
    // 取消完成标记
    task.completedToday = false;
    // 注意：task.completed 保留，因为历史上完成过
    
    // 从今日打卡历史中移除
    const today = new Date().toISOString().split('T')[0];
    if (user.checkinHistory[today]) {
        const idx = user.checkinHistory[today].indexOf(task.id);
        if (idx !== -1) {
            user.checkinHistory[today].splice(idx, 1);
        }
        // 如果今天没有任何打卡了，删除今日记录
        if (user.checkinHistory[today].length === 0) {
            delete user.checkinHistory[today];
        }
    }
    
    // 重新计算连续打卡天数
    recalculateStreak(currentUser);
    
    // 更新等级
    updateLevel(currentUser);
    
    // 重新检查成就（撤销因积分不足而不应获得的成就）
    recheckAchievementsAfterUndo(currentUser);
    
    // 保存数据
    saveData();
    
    // 更新显示
    updateCurrentUserDisplay();
    updateUserCards();
    updateTaskItemUI(taskId);
    
    // 添加到家庭动态
    addFamilyFeed(currentUser, `撤回了「${task.name}」的打卡记录`);
}

// 重新从头计算连续打卡天数
function recalculateStreak(userName) {
    const user = users[userName];
    const today = new Date().toISOString().split('T')[0];
    
    let streak = 0;
    let checkDate = new Date();
    
    // 从今天往前数，找连续有打卡记录的天数
    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (user.checkinHistory[dateStr] && user.checkinHistory[dateStr].length > 0) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    user.streak = streak;
}

// 撤回打卡后重新检查成就（只撤销积分类成就）
function recheckAchievementsAfterUndo(userName) {
    const user = users[userName];
    const allAchievements = [...achievementsList, ...loadCustomAchievements()];
    
    // 只对积分类成就重新检查
    allAchievements.forEach(achievement => {
        if (achievement.pointsRequired) {
            const idx = user.achievements.indexOf(achievement.id);
            if (idx !== -1) {
                // 如果当前积分已不满足条件，撤销成就
                if (!achievement.condition(user)) {
                    user.achievements.splice(idx, 1);
                }
            }
        }
    });
}

// 更新连续打卡天数
function updateStreak(userName) {
    const user = users[userName];
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (user.checkinHistory[today] && user.checkinHistory[today].length > 0) {
        if (user.checkinHistory[yesterday] && user.checkinHistory[yesterday].length > 0) {
            user.streak += 1;
        } else {
            user.streak = 1;
        }
    }
}

// 更新等级
function updateLevel(userName) {
    const user = users[userName];
    let newLevel = '新手';
    
    for (let i = levels.length - 1; i >= 0; i--) {
        if (user.totalPoints >= levels[i].minPoints) {
            newLevel = levels[i].name;
            break;
        }
    }
    
    if (newLevel !== user.level) {
        user.level = newLevel;
        // 可以在这里添加升级提示
    }
}

// 检查成就
function checkAchievements(userName) {
    const user = users[userName];
    
    achievementsList.forEach(achievement => {
        if (!user.achievements.includes(achievement.id)) {
            if (achievement.condition(user)) {
                user.achievements.push(achievement.id);
                // 可以在这里添加成就解锁提示
            }
        }
    });
}

// 显示打卡成功弹窗
function showCheckinModal(task) {
    document.getElementById('checkin-message').textContent = 
        `你完成了「${task.name}」，获得了${task.points}积分！`;
    document.getElementById('checkin-modal').classList.remove('hidden');
}

// 关闭弹窗
function closeModal() {
    document.getElementById('checkin-modal').classList.add('hidden');
    // 关闭弹窗后刷新页面数据，确保显示最新状态
    refreshCurrentView();
}

// 分享成就
function shareAchievement() {
    // 添加到家庭动态
    addFamilyFeed(currentUser, '完成了任务，获得了积分！');
    closeModal();
}

// 加载奖励列表
function loadRewards() {
    const user = users[currentUser];
    const rewardsList = document.getElementById('rewards-list');
    rewardsList.innerHTML = '';
    
    if (user.rewards.length === 0) {
        rewardsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无奖励，请添加奖励</p>';
        return;
    }
    
    user.rewards.forEach(reward => {
        const rewardItem = document.createElement('div');
        rewardItem.className = 'reward-item';
        rewardItem.innerHTML = `
            <div class="reward-info">
                <h4>🎁 ${reward.name}</h4>
                <p>需要 ${reward.cost} 积分</p>
            </div>
            <div class="reward-actions">
                <div class="reward-cost">${reward.cost} 积分</div>
                <button class="btn-edit" onclick="editReward(${reward.id})" title="编辑奖励">✏️</button>
                <button class="btn-delete" onclick="deleteReward(${reward.id})" title="删除奖励">🗑️</button>
                <button class="btn-redeem ${user.points < reward.cost ? 'disabled' : ''}" 
                        onclick="redeemReward(${reward.id})"
                        ${user.points < reward.cost || reward.redeemed ? 'disabled' : ''}>
                    ${reward.redeemed ? '✓ 已兑换' : user.points < reward.cost ? '积分不足' : '兑换'}
                </button>
            </div>
        `;
        rewardsList.appendChild(rewardItem);
    });
}

// 兑换奖励
function redeemReward(rewardId) {
    const user = users[currentUser];
    const reward = user.rewards.find(r => r.id === rewardId);
    
    if (reward && user.points >= reward.cost && !reward.redeemed) {
        user.points -= reward.cost;
        reward.redeemed = true;
        
        saveData();
        updateCurrentUserDisplay();
        updateUserCards();
        loadRewards();
        
        // 显示兑换成功弹窗
        document.getElementById('redeem-message').textContent = 
            `你成功兑换了「${reward.name}」！`;
        document.getElementById('redeem-modal').classList.remove('hidden');
        
        // 添加到家庭动态
        addFamilyFeed(currentUser, `兑换了奖励：${reward.name}`);
    }
}

// 关闭兑换弹窗
function closeRedeemModal() {
    document.getElementById('redeem-modal').classList.add('hidden');
    // 关闭弹窗后刷新页面数据
    refreshCurrentView();
}

// ============ 奖励管理功能 ============

// 删除奖励
function deleteReward(rewardId) {
    if (!confirm('确定要删除这个奖励吗？')) {
        return;
    }
    
    const user = users[currentUser];
    const rewardIndex = user.rewards.findIndex(r => r.id === rewardId);
    
    if (rewardIndex !== -1) {
        const rewardName = user.rewards[rewardIndex].name;
        user.rewards.splice(rewardIndex, 1);
        
        saveData();
        loadRewards();
        
        // 添加到家庭动态
        addFamilyFeed(currentUser, `删除了奖励：${rewardName}`);
    }
}

// 编辑奖励
function editReward(rewardId) {
    const user = users[currentUser];
    const reward = user.rewards.find(r => r.id === rewardId);
    
    if (!reward) return;
    
    // 填充编辑表单
    document.getElementById('edit-reward-id').value = reward.id;
    document.getElementById('edit-reward-name').value = reward.name;
    document.getElementById('edit-reward-cost').value = reward.cost;
    
    // 显示编辑弹窗
    document.getElementById('edit-reward-modal').classList.remove('hidden');
}

// 保存奖励编辑
function saveRewardEdit() {
    const rewardId = parseInt(document.getElementById('edit-reward-id').value);
    const rewardName = document.getElementById('edit-reward-name').value;
    const cost = parseInt(document.getElementById('edit-reward-cost').value);
    
    if (!rewardName) {
        alert('请输入奖励名称');
        return;
    }
    
    if (cost < 1) {
        alert('积分必须大于0');
        return;
    }
    
    const user = users[currentUser];
    const reward = user.rewards.find(r => r.id === rewardId);
    
    if (reward) {
        reward.name = rewardName;
        reward.cost = cost;
        
        saveData();
        loadRewards();
        closeRewardEditModal();
        
        // 添加到家庭动态
        addFamilyFeed(currentUser, `修改了奖励：${rewardName}`);
    }
}

// 关闭奖励编辑弹窗
function closeRewardEditModal() {
    document.getElementById('edit-reward-modal').classList.add('hidden');
}

// 添加自定义任务
function addCustomTask() {
    const taskName = document.getElementById('new-task-input').value;
    const category = document.getElementById('new-task-category').value;
    const points = parseInt(document.getElementById('new-task-points').value);
    
    if (!taskName) {
        alert('请输入任务名称');
        return;
    }
    
    const user = users[currentUser];
    const newId = Math.max(...user.tasks.map(t => t.id), 0) + 1;
    
    user.tasks.push({
        id: newId,
        name: taskName,
        category: category,
        points: points,
        completed: false,
        completedToday: false
    });
    
    saveData();
    loadTasks();
    
    // 清空输入
    document.getElementById('new-task-input').value = '';
    document.getElementById('new-task-points').value = '10';
}

// 添加自定义奖励
function addCustomReward() {
    const rewardName = document.getElementById('new-reward-input').value;
    const points = parseInt(document.getElementById('new-reward-points').value);
    
    if (!rewardName) {
        alert('请输入奖励名称');
        return;
    }
    
    const user = users[currentUser];
    const newId = Math.max(...user.rewards.map(r => r.id), 0) + 1;
    
    user.rewards.push({
        id: newId,
        name: rewardName,
        cost: points,
        redeemed: false
    });
    
    saveData();
    loadRewards();
    
    // 清空输入
    document.getElementById('new-reward-input').value = '';
    document.getElementById('new-reward-points').value = '100';
}

// 加载统计信息
function loadStatistics() {
    const user = users[currentUser];
    
    // 更新统计数据
    document.getElementById('streak-days').textContent = user.streak;
    document.getElementById('total-points').textContent = user.totalPoints;
    
    // 计算本周完成率
    const weekCompletion = calculateWeekCompletion(currentUser);
    document.getElementById('week-completion').textContent = weekCompletion + '%';
    
    // 生成日历
    generateCalendar(currentUser);
    
    // 绘制图表
    drawCharts(currentUser);
}

// 计算本周完成率
function calculateWeekCompletion(userName) {
    const user = users[userName];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    let completedDays = 0;
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        if (user.checkinHistory[dateStr] && user.checkinHistory[dateStr].length > 0) {
            completedDays++;
        }
    }
    
    return Math.round((completedDays / 7) * 100);
}

// 生成日历
function generateCalendar(userName) {
    const user = users[userName];
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // 添加星期标题
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day';
        dayHeader.style.fontWeight = 'bold';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });
    
    // 获取当前月份的第一天
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // 添加空白天数
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendar.appendChild(emptyDay);
    }
    
    // 添加日期
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(today.getFullYear(), today.getMonth(), d);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        
        if (user.checkinHistory[dateStr] && user.checkinHistory[dateStr].length > 0) {
            dayCell.classList.add('checked');
        }
        
        if (d === today.getDate()) {
            dayCell.classList.add('today');
        }
        
        dayCell.textContent = d;
        calendar.appendChild(dayCell);
    }
}

// 绘制图表
function drawCharts(userName) {
    const user = users[userName];
    
    // 完成率图表
    const completionCtx = document.getElementById('completion-chart').getContext('2d');
    new Chart(completionCtx, {
        type: 'doughnut',
        data: {
            labels: ['已完成', '未完成'],
            datasets: [{
                data: [calculateWeekCompletion(userName), 100 - calculateWeekCompletion(userName)],
                backgroundColor: ['#4caf50', '#f0f0f0']
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // 积分趋势图
    const pointsCtx = document.getElementById('points-chart').getContext('2d');
    
    // 生成最近7天的数据
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
        
        const dateStr = date.toISOString().split('T')[0];
        const dayPoints = user.checkinHistory[dateStr] ? 
            user.checkinHistory[dateStr].reduce((sum, taskId) => {
                const task = user.tasks.find(t => t.id === taskId);
                return sum + (task ? task.points : 0);
            }, 0) : 0;
        data.push(dayPoints);
    }
    
    new Chart(pointsCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '每日获得积分',
                data: data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 加载成就
function loadAchievements() {
    const user = users[currentUser];
    
    // 先检查是否有新解锁的成就
    checkAchievements(user);
    
    const achievementsListContainer = document.getElementById('achievements-list');
    achievementsListContainer.innerHTML = '';
    
    // 合并预设徽章和自定义徽章
    const allAchievements = [...achievementsList, ...loadCustomAchievements()];
    
    allAchievements.forEach(achievement => {
        const unlocked = user.achievements.includes(achievement.id);
        
        // 判断徽章稀有度
        const rarity = getAchievementRarity(achievement);
        const rarityName = getRarityName(rarity);
        
        const achievementItem = document.createElement('div');
        
        // 设置CSS类，并存储稀有度数据属性供预览使用
        if (unlocked) {
            achievementItem.className = `achievement-item unlocked rarity-${rarity}`;
        } else {
            achievementItem.className = 'achievement-item';
            // 添加预览用的数据属性
            achievementItem.dataset.rarity = rarity;
        }
        
        // 图标：未解锁同时存储灰色和彩色图标
        const iconDisplay = unlocked ? achievement.icon : '⚫';
        const iconPreview = achievement.icon; // 预览时显示的彩色图标
        
        // 稀有度标签
        const rarityBadge = unlocked ? `<div class="rarity-badge">${rarityName}</div>` : 
            `<div class="rarity-badge rarity-badge-hidden">${rarityName}</div>`;
        
        // 状态文本
        const statusText = unlocked ? 
            '<div class="achievement-status unlocked-status">✓ 已解锁</div>' : 
            (achievement.pointsRequired ? 
                `<div class="achievement-status locked-status">需要 ${achievement.pointsRequired} 积分</div>` : 
                achievement.streakRequired ? 
                `<div class="achievement-status locked-status">需要连续 ${achievement.streakRequired} 天</div>` : '');
        
        // 预览时显示的状态文本
        const previewStatusText = unlocked ? '' : 
            '<div class="achievement-status preview-status">✨ 预览效果</div>';
        
        achievementItem.innerHTML = `
            ${rarityBadge}
            <div class="achievement-icon" data-preview-icon="${iconPreview}">${iconDisplay}</div>
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            ${statusText}
            ${!unlocked ? previewStatusText : ''}
            <div class="achievement-actions">
                <button class="btn-edit" onclick="editAchievement(${achievement.id})" title="编辑徽章">✏️</button>
                <button class="btn-delete" onclick="deleteAchievement(${achievement.id})" title="删除徽章">🗑️</button>
            </div>
        `;
        achievementsListContainer.appendChild(achievementItem);
    });
    
    // 为未解锁徽章绑定悬浮预览事件（切换图标）
    setupAchievementPreview();
}

// 设置徽章悬浮预览功能
function setupAchievementPreview() {
    const lockedItems = document.querySelectorAll('.achievement-item:not(.unlocked)');
    lockedItems.forEach(item => {
        const iconEl = item.querySelector('.achievement-icon');
        if (!iconEl) return;
        const originalIcon = iconEl.textContent;
        const previewIcon = iconEl.dataset.previewIcon;
        
        if (previewIcon) {
            item.addEventListener('mouseenter', function() {
                iconEl.textContent = previewIcon;
            });
            item.addEventListener('mouseleave', function() {
                iconEl.textContent = originalIcon;
            });
        }
    });
}

// 检查成就 - 改进版，自动根据条件检查
function checkAchievements(user) {
    // 检查预设徽章和自定义徽章
    const allAchievements = [...achievementsList, ...loadCustomAchievements()];
    
    allAchievements.forEach(achievement => {
        if (!user.achievements.includes(achievement.id)) {
            if (achievement.condition(user)) {
                user.achievements.push(achievement.id);
                // 可以在这里添加成就解锁提示
                showAchievementNotification(achievement);
            }
        }
    });
}

// 显示成就解锁通知
function showAchievementNotification(achievement) {
    // 添加到家庭动态
    addFamilyFeed(currentUser, `解锁了成就：【${achievement.name}】${achievement.icon}`);
    
    // 可以添加一个临时通知，这里简化为添加到动态
    // 实际应用可以添加一个Toast通知
}

// ============ 徽章管理功能 ============

// 添加自定义徽章
function addCustomAchievement() {
    const name = document.getElementById('new-achievement-name').value;
    const icon = document.getElementById('new-achievement-icon').value || '🏅';
    const description = document.getElementById('new-achievement-desc').value;
    const type = document.getElementById('new-achievement-type').value;
    const required = parseInt(document.getElementById('new-achievement-required').value);
    
    if (!name) {
        alert('请输入徽章名称');
        return;
    }
    
    if (!description) {
        alert('请输入徽章描述');
        return;
    }
    
    if (!required || required < 1) {
        alert('请输入有效的数值');
        return;
    }
    
    // 获取现有自定义徽章
    const customAchievements = loadCustomAchievements();
    
    // 生成新ID（从100开始，避免与预设徽章冲突）
    const newId = customAchievements.length > 0 ? 
        Math.max(...customAchievements.map(a => a.id)) + 1 : 100;
    
    // 创建新徽章对象
    const newAchievement = {
        id: newId,
        name: name,
        icon: icon,
        description: description,
        isCustom: true
    };
    
    // 根据类型设置条件
    if (type === 'points') {
        newAchievement.pointsRequired = required;
        newAchievement.condition = (user) => user.totalPoints >= required;
    } else if (type === 'streak') {
        newAchievement.streakRequired = required;
        newAchievement.condition = (user) => user.streak >= required;
    }
    
    // 添加到列表
    customAchievements.push(newAchievement);
    
    // 保存到localStorage
    saveCustomAchievements(customAchievements);
    
    // 重新加载徽章列表
    loadAchievements();
    
    // 清空输入
    document.getElementById('new-achievement-name').value = '';
    document.getElementById('new-achievement-icon').value = '🏅';
    document.getElementById('new-achievement-desc').value = '';
    document.getElementById('new-achievement-required').value = '100';
    
    alert('徽章添加成功！');
}

// 删除徽章
function deleteAchievement(achievementId) {
    // 预设徽章删除确认
    if (achievementId < 100) {
        if (!confirm('这是预设徽章，确定要删除吗？删除后所有用户将无法获得此徽章。')) {
            return;
        }
        // 从预设列表中移除
        const idx = achievementsList.findIndex(a => a.id === achievementId);
        if (idx !== -1) {
            const achievementName = achievementsList[idx].name;
            achievementsList.splice(idx, 1);
            // 从所有用户的已解锁列表中也移除
            Object.keys(users).forEach(userName => {
                const aIdx = users[userName].achievements.indexOf(achievementId);
                if (aIdx !== -1) {
                    users[userName].achievements.splice(aIdx, 1);
                }
            });
            saveData();
            loadAchievements();
            addFamilyFeed(currentUser, `删除了预设徽章：${achievementName}`);
        }
        return;
    }
    
    // 自定义徽章删除
    if (!confirm('确定要删除这个徽章吗？')) {
        return;
    }
    
    const customAchievements = loadCustomAchievements();
    const achievementIndex = customAchievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1) {
        const achievementName = customAchievements[achievementIndex].name;
        customAchievements.splice(achievementIndex, 1);
        
        // 从所有用户的已解锁列表中也移除
        Object.keys(users).forEach(userName => {
            const aIdx = users[userName].achievements.indexOf(achievementId);
            if (aIdx !== -1) {
                users[userName].achievements.splice(aIdx, 1);
            }
        });
        
        saveCustomAchievements(customAchievements);
        saveData();
        loadAchievements();
        
        addFamilyFeed(currentUser, `删除了徽章：${achievementName}`);
    }
}

// 编辑徽章（支持预设和自定义）
function editAchievement(achievementId) {
    let achievement = null;
    let isPreset = false;
    
    // 先查找预设徽章
    if (achievementId < 100) {
        achievement = achievementsList.find(a => a.id === achievementId);
        isPreset = true;
    }
    
    // 如果预设中没找到，查找自定义徽章
    if (!achievement) {
        const customAchievements = loadCustomAchievements();
        achievement = customAchievements.find(a => a.id === achievementId);
    }
    
    if (!achievement) return;
    
    // 填充编辑表单
    document.getElementById('edit-achievement-id').value = achievement.id;
    document.getElementById('edit-achievement-id').dataset.isPreset = isPreset;
    document.getElementById('edit-achievement-name').value = achievement.name;
    document.getElementById('edit-achievement-icon').value = achievement.icon;
    document.getElementById('edit-achievement-desc').value = achievement.description;
    
    // 根据条件类型设置下拉框
    if (achievement.pointsRequired) {
        document.getElementById('edit-achievement-type').value = 'points';
        document.getElementById('edit-achievement-required').value = achievement.pointsRequired;
    } else if (achievement.streakRequired) {
        document.getElementById('edit-achievement-type').value = 'streak';
        document.getElementById('edit-achievement-required').value = achievement.streakRequired;
    }
    
    // 显示编辑弹窗
    document.getElementById('edit-achievement-modal').classList.remove('hidden');
}

// 保存徽章编辑（支持预设和自定义）
function saveAchievementEdit() {
    const achievementId = parseInt(document.getElementById('edit-achievement-id').value);
    const isPreset = document.getElementById('edit-achievement-id').dataset.isPreset === 'true';
    const name = document.getElementById('edit-achievement-name').value;
    const icon = document.getElementById('edit-achievement-icon').value;
    const description = document.getElementById('edit-achievement-desc').value;
    const type = document.getElementById('edit-achievement-type').value;
    const required = parseInt(document.getElementById('edit-achievement-required').value);
    
    if (!name) {
        alert('请输入徽章名称');
        return;
    }
    
    if (!description) {
        alert('请输入徽章描述');
        return;
    }
    
    if (!required || required < 1) {
        alert('请输入有效的数值');
        return;
    }
    
    if (isPreset) {
        // 编辑预设徽章
        const achievement = achievementsList.find(a => a.id === achievementId);
        if (achievement) {
            achievement.name = name;
            achievement.icon = icon;
            achievement.description = description;
            
            delete achievement.pointsRequired;
            delete achievement.streakRequired;
            
            if (type === 'points') {
                achievement.pointsRequired = required;
                achievement.condition = (user) => user.totalPoints >= required;
            } else if (type === 'streak') {
                achievement.streakRequired = required;
                achievement.condition = (user) => user.streak >= required;
            }
            
            saveData();
            loadAchievements();
            closeAchievementEditModal();
            addFamilyFeed(currentUser, `修改了预设徽章：${name}`);
        }
    } else {
        // 编辑自定义徽章
        const customAchievements = loadCustomAchievements();
        const achievement = customAchievements.find(a => a.id === achievementId);
        
        if (achievement) {
            achievement.name = name;
            achievement.icon = icon;
            achievement.description = description;
            
            delete achievement.pointsRequired;
            delete achievement.streakRequired;
            
            if (type === 'points') {
                achievement.pointsRequired = required;
                achievement.condition = (user) => user.totalPoints >= required;
            } else if (type === 'streak') {
                achievement.streakRequired = required;
                achievement.condition = (user) => user.streak >= required;
            }
            
            saveCustomAchievements(customAchievements);
            loadAchievements();
            closeAchievementEditModal();
            addFamilyFeed(currentUser, `修改了徽章：${name}`);
        }
    }
}

// 关闭徽章编辑弹窗
function closeAchievementEditModal() {
    document.getElementById('edit-achievement-modal').classList.add('hidden');
}

// 加载家庭界面
function loadFamilyScreen() {
    loadFamilyRankings();
    loadFamilyFeed();
}

// 加载家庭排行榜
function loadFamilyRankings() {
    const rankingsList = document.getElementById('family-rankings-list');
    rankingsList.innerHTML = '';
    
    // 按积分排序
    const sortedUsers = Object.entries(users).sort((a, b) => b[1].totalPoints - a[1].totalPoints);
    
    sortedUsers.forEach(([userName, userData], index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.innerHTML = `
            <div class="ranking-position">#${index + 1}</div>
            <div style="flex: 1;">
                <strong>${userName}</strong>
                <p style="font-size: 12px; color: #666;">${userData.level}</p>
            </div>
            <div>
                <strong>${userData.totalPoints}</strong> 积分
            </div>
        `;
        rankingsList.appendChild(rankingItem);
    });
}

// 加载家庭动态
function loadFamilyFeed() {
    const feedList = document.getElementById('family-feed-list');
    feedList.innerHTML = '';
    
    // 这里应该从某个地方加载家庭动态，暂时使用本地存储
    const feed = JSON.parse(localStorage.getItem('familyFeed') || '[]');
    
    feed.forEach(item => {
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.innerHTML = `
            <strong>${item.user}</strong>: ${item.message}
            <div class="timestamp">${item.timestamp}</div>
        `;
        feedList.appendChild(feedItem);
    });
}

// 添加家庭动态
function addFamilyFeed(userName, message) {
    let feed = JSON.parse(localStorage.getItem('familyFeed') || '[]');
    
    feed.unshift({
        user: userName,
        message: message,
        timestamp: new Date().toLocaleString('zh-CN')
    });
    
    // 只保留最近20条动态
    if (feed.length > 20) {
        feed = feed.slice(0, 20);
    }
    
    localStorage.setItem('familyFeed', JSON.stringify(feed));
}

// 发送鼓励
function sendEncouragement() {
    const encourageUser = document.getElementById('encourage-user').value;
    const message = document.getElementById('encourage-message').value;
    
    if (!message) {
        alert('请输入鼓励内容');
        return;
    }
    
    addFamilyFeed(currentUser, `给${encourageUser}打气：${message}`);
    
    // 清空输入
    document.getElementById('encourage-message').value = '';
    
    // 重新加载动态
    loadFamilyFeed();
    
    alert('鼓励已发送！');
}

// 辅助函数：检查是否完成所有类型的任务
function checkAllCategories(user) {
    const categories = new Set(user.tasks.map(t => t.category));
    return categories.size >= 3; // 简化条件
}

// 就地更新单个任务卡片的UI（打卡/撤回后不重新渲染整个列表）
function updateTaskItemUI(taskId) {
    const user = users[currentUser];
    const task = user.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 找到对应的 task-item DOM 元素
    const taskItems = document.querySelectorAll('.task-item');
    let targetItem = null;
    
    taskItems.forEach(item => {
        const checkinBtn = item.querySelector('.btn-checkin');
        if (checkinBtn) {
            const onclickAttr = checkinBtn.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes(`checkin(${taskId})`)) {
                targetItem = item;
            }
        }
    });
    
    if (!targetItem) {
        // 如果找不到DOM元素，回退到重新渲染整个列表
        loadTasks();
        return;
    }
    
    // 更新卡片样式
    if (task.completedToday) {
        targetItem.classList.add('completed');
    } else {
        targetItem.classList.remove('completed');
    }
    
    // 重建操作按钮区域
    const taskActions = targetItem.querySelector('.task-actions');
    if (taskActions) {
        taskActions.innerHTML = `
            <div class="task-points">+${task.points}</div>
            <button class="btn-edit" onclick="editTask(${task.id})" title="编辑任务">✏️</button>
            <button class="btn-delete" onclick="deleteTask(${task.id})" title="删除任务">🗑️</button>
            ${task.completedToday ? `
            <button class="btn-undo-checkin" onclick="undoCheckin(${task.id})" title="撤回本次打卡">↩️ 撤回</button>
            ` : ''}
            <button class="btn-checkin ${task.completedToday ? 'completed' : ''}" 
                    onclick="checkin(${task.id})" 
                    ${task.completedToday ? 'disabled' : ''}>
                ${task.completedToday ? '✓ 已完成' : '打卡'}
            </button>
        `;
    }
}
function isTopRank(user) {
    const sortedUsers = Object.entries(users).sort((a, b) => b[1].totalPoints - a[1].totalPoints);
    return sortedUsers[0][0] === currentUser;
}

// ============ 积分清空功能 ============

// 清空当前用户积分
function clearCurrentUserPoints() {
    const user = users[currentUser];
    const pointsInfo = user.points > 0 ? `当前积分：${user.points}，累计积分：${user.totalPoints}` : '当前积分为0，累计积分也为0';
    
    showClearConfirm(
        `确定要清空「${currentUser}」的积分吗？`,
        `${pointsInfo}\n\n清空后：\n• 可用积分归零\n• 累计积分归零\n• 等级重置为"新手"\n• 已解锁的积分类成就将被撤销\n• 连续打卡天数和打卡历史不受影响`,
        () => {
            // 执行清空
            user.points = 0;
            user.totalPoints = 0;
            user.level = '新手';
            
            // 重新检查成就，撤销不再满足条件的
            recheckAchievementsAfterUndo(currentUser);
            
            saveData();
            updateCurrentUserDisplay();
            updateUserCards();
            loadFamilyScreen();
            
            addFamilyFeed(currentUser, '清空了自己的积分');
            showClearSuccessToast(`${currentUser}的积分已清空`);
        }
    );
}

// 清空所有用户积分
function clearAllUsersPoints() {
    let summary = '';
    Object.keys(users).forEach(userName => {
        const u = users[userName];
        summary += `• ${userName}：积分 ${u.points}，累计 ${u.totalPoints}\n`;
    });
    
    showClearConfirm(
        '⚠️ 确定要清空所有成员的积分吗？',
        `当前各成员积分情况：\n${summary}\n清空后所有成员的积分、等级、积分类成就都将重置！\n此操作不可撤销！`,
        () => {
            Object.keys(users).forEach(userName => {
                users[userName].points = 0;
                users[userName].totalPoints = 0;
                users[userName].level = '新手';
                recheckAchievementsAfterUndo(userName);
            });
            
            saveData();
            updateCurrentUserDisplay();
            updateUserCards();
            loadFamilyScreen();
            
            addFamilyFeed(currentUser, '清空了所有成员的积分');
            showClearSuccessToast('所有成员的积分已清空');
        }
    );
}

// 显示积分清空确认弹窗
function showClearConfirm(title, detail, onConfirm) {
    // 移除已有的确认弹窗
    const existingModal = document.getElementById('clear-confirm-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'clear-confirm-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="confirm-modal-content">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">${title}</div>
            <div class="warning-detail">${detail.replace(/\n/g, '<br>')}</div>
            <div class="confirm-modal-actions">
                <button class="confirm-cancel" onclick="closeClearConfirm()">取消</button>
                <button class="confirm-danger" id="confirm-clear-btn">确认清空</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 绑定确认按钮
    document.getElementById('confirm-clear-btn').addEventListener('click', () => {
        closeClearConfirm();
        onConfirm();
    });
}

// 关闭清空确认弹窗
function closeClearConfirm() {
    const modal = document.getElementById('clear-confirm-modal');
    if (modal) modal.remove();
}

// 显示清空成功提示
function showClearSuccessToast(message) {
    // 移除已有的提示
    const existingToast = document.querySelector('.clear-success-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'clear-success-toast';
    toast.textContent = `✅ ${message}`;
    document.body.appendChild(toast);
    
    // 触发动画
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // 3秒后自动消失
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ============ 头像上传功能 ============

// 加载所有保存的头像
function loadAllAvatars() {
    const avatarData = JSON.parse(localStorage.getItem('avatarData') || '{}');
    
    Object.keys(avatarData).forEach(userName => {
        if (avatarData[userName]) {
            displayAvatar(userName, avatarData[userName]);
        }
    });
}

// 显示头像
function displayAvatar(userName, imageData) {
    const avatarKey = getNameKey(userName);
    const avatarDiv = document.getElementById(`avatar-${avatarKey}`);
    
    if (avatarDiv && imageData) {
        avatarDiv.innerHTML = `
            <img src="${imageData}" alt="${userName}">
            <div class="avatar-overlay">📷 更换</div>
        `;
    }
}

// 上传头像
function uploadAvatar(userName, input) {
    const file = input.files[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        input.value = '';
        return;
    }
    
    // 验证文件大小（限制2MB）
    if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB！');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // 保存到localStorage
        const avatarData = JSON.parse(localStorage.getItem('avatarData') || '{}');
        avatarData[userName] = imageData;
        localStorage.setItem('avatarData', JSON.stringify(avatarData));
        
        // 更新显示
        displayAvatar(userName, imageData);
        
        // 同时更新头部头像（如果当前用户是上传者）
        if (currentUser === userName) {
            updateHeaderAvatar(userName, imageData);
        }
        
        alert('头像更新成功！');
    };
    reader.onerror = function() {
        alert('读取文件失败，请重试！');
    };
    reader.readAsDataURL(file);
    
    // 清空input，允许再次选择同一文件
    setTimeout(() => {
        input.value = '';
    }, 100);
}

// 更新头部头像显示
function updateHeaderAvatar(userName, imageData) {
    let headerAvatar = document.getElementById('header-avatar');
    
    // 如果头部头像不存在，创建一个
    if (!headerAvatar) {
        const header = document.querySelector('header');
        if (header) {
            headerAvatar = document.createElement('div');
            headerAvatar.id = 'header-avatar';
            headerAvatar.className = 'header-avatar';
            header.insertBefore(headerAvatar, header.firstChild.nextSibling);
        }
    }
    
    if (headerAvatar && imageData) {
        headerAvatar.innerHTML = `<img src="${imageData}" alt="${userName}">`;
        headerAvatar.style.display = 'block';
    }
}

// 初始化时加载头像到头部
function loadHeaderAvatar() {
    if (!currentUser) return;
    
    const avatarData = JSON.parse(localStorage.getItem('avatarData') || '{}');
    const imageData = avatarData[currentUser];
    
    if (imageData) {
        updateHeaderAvatar(currentUser, imageData);
    }
}
