// 学习统计功能

// 保存学习记录
export function saveLearningRecord(knownCount, totalWords, duration) {
    const record = {
        knownCount,
        totalWords,
        accuracy: totalWords > 0 ? Math.round((knownCount / totalWords) * 100) : 0,
        duration,
        timestamp: new Date().toISOString()
    };
    
    const records = JSON.parse(localStorage.getItem('learningRecords') || '[]');
    records.push(record);
    
    // 只保存最近50条记录
    if (records.length > 50) {
        records.splice(0, records.length - 50);
    }
    
    localStorage.setItem('learningRecords', JSON.stringify(records));
    
    // 更新学习统计
    updateLearningStats();
}

// 更新学习统计
export function updateLearningStats() {
    const records = JSON.parse(localStorage.getItem('learningRecords') || '[]');
    
    if (records.length === 0) {
        localStorage.setItem('learningStats', JSON.stringify({
            totalTests: 0,
            totalWords: 0,
            totalKnown: 0,
            averageAccuracy: 0,
            totalDuration: 0,
            averageDuration: 0
        }));
        return;
    }
    
    const totalTests = records.length;
    const totalWords = records.reduce((sum, record) => sum + record.totalWords, 0);
    const totalKnown = records.reduce((sum, record) => sum + record.knownCount, 0);
    const totalDuration = records.reduce((sum, record) => sum + record.duration, 0);
    const averageAccuracy = Math.round((totalKnown / totalWords) * 100) || 0;
    const averageDuration = Math.round(totalDuration / totalTests) || 0;
    
    const stats = {
        totalTests,
        totalWords,
        totalKnown,
        averageAccuracy,
        totalDuration,
        averageDuration
    };
    
    localStorage.setItem('learningStats', JSON.stringify(stats));
}

// 获取学习统计
export function getLearningStats() {
    const stats = JSON.parse(localStorage.getItem('learningStats') || '{}');
    return {
        totalTests: stats.totalTests || 0,
        totalWords: stats.totalWords || 0,
        totalKnown: stats.totalKnown || 0,
        averageAccuracy: stats.averageAccuracy || 0,
        totalDuration: stats.totalDuration || 0,
        averageDuration: stats.averageDuration || 0
    };
}

// 获取最近的学习记录
export function getRecentLearningRecords(limit = 10) {
    const records = JSON.parse(localStorage.getItem('learningRecords') || '[]');
    return records.slice(-limit).reverse();
}

// 重置学习统计
export function resetLearningStats() {
    if (confirm('确定要重置所有学习统计数据吗？此操作不可恢复！')) {
        localStorage.removeItem('learningRecords');
        localStorage.removeItem('learningStats');
        localStorage.removeItem('learningHistory');
        return true;
    }
    return false;
}

// 初始化学习统计
export function initLearningStats() {
    updateLearningStats();
}