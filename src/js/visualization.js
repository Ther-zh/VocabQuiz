import Chart from 'chart.js/auto';

// 学习进度图表
let progressChart = null;
let reviewChart = null;

// 初始化学习进度图表
export function initProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '学习进度',
                data: [],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '学习进度趋势'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '完成率 (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '学习次数'
                    }
                }
            }
        }
    });
}

// 初始化复习情况图表
export function initReviewChart() {
    const ctx = document.getElementById('reviewChart');
    if (!ctx) return;
    
    reviewChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['已掌握', '需复习'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#4cc9f0', '#f72585'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: '单词掌握情况'
                }
            }
        }
    });
}

// 更新学习进度图表
export function updateProgressChart(progress) {
    if (!progressChart) return;
    
    const labels = progressChart.data.labels;
    const data = progressChart.data.datasets[0].data;
    
    labels.push(`学习 ${labels.length + 1}`);
    data.push(progress);
    
    // 保持只显示最近10次数据
    if (labels.length > 10) {
        labels.shift();
        data.shift();
    }
    
    progressChart.update();
}

// 更新复习情况图表
export function updateReviewChart(knownCount, reviewCount) {
    if (!reviewChart) return;
    
    reviewChart.data.datasets[0].data = [knownCount, reviewCount];
    reviewChart.update();
}

// 保存学习进度数据
export function saveLearningProgress(progress) {
    const history = JSON.parse(localStorage.getItem('learningHistory') || '[]');
    history.push({
        progress,
        timestamp: new Date().toISOString()
    });
    
    // 只保存最近30条记录
    if (history.length > 30) {
        history.splice(0, history.length - 30);
    }
    
    localStorage.setItem('learningHistory', JSON.stringify(history));
}

// 加载学习进度数据
export function loadLearningProgress() {
    const history = JSON.parse(localStorage.getItem('learningHistory') || '[]');
    return history;
}

// 初始化所有图表
export function initCharts() {
    initProgressChart();
    initReviewChart();
    
    // 加载历史数据
    const history = loadLearningProgress();
    if (history.length > 0) {
        const labels = history.map((_, index) => `学习 ${index + 1}`);
        const data = history.map(item => item.progress);
        
        if (progressChart) {
            progressChart.data.labels = labels;
            progressChart.data.datasets[0].data = data;
            progressChart.update();
        }
    }
}