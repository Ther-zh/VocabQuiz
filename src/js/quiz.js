import { defaultWords } from './data.js';
import { showToast } from './ui.js';
import { t } from './i18n.js';

// 状态变量
let words = [...defaultWords];
let currentIndex = 0;
let knownCount = 0;
let reviewList = [];
let shuffledWords = [];
let isReviewMode = false; // 是否处于复习模式
let reviewModeTotalWords = 0; // 复习模式下的总单词数，用于进度条计算
let testModeProgress = 0; // 测试模式的进度，用于返回时恢复
let testStartTime = 0; // 测试开始时间

// DOM 元素缓存
let domElements = {
    wordDisplay: null,
    chineseDisplay: null,
    startSection: null,
    controlsSection: null,
    startButton: null,
    restartButton: null,
    totalWords: null,
    currentIndex: null,
    knownCount: null,
    reviewCount: null,
    progressText: null,
    progressBar: null,
    modeIndicator: null,
    reviewList: null
};

// 初始化 DOM 元素缓存
function initDomElements() {
    domElements = {
        wordDisplay: document.getElementById('wordDisplay'),
        chineseDisplay: document.getElementById('chineseDisplay'),
        startSection: document.getElementById('startSection'),
        controlsSection: document.getElementById('controlsSection'),
        startButton: document.querySelector('button[onclick="startTest()"]'),
        restartButton: document.querySelector('button[onclick="restartTest()"]'),
        totalWords: document.getElementById('totalWords'),
        currentIndex: document.getElementById('currentIndex'),
        knownCount: document.getElementById('knownCount'),
        reviewCount: document.getElementById('reviewCount'),
        progressText: document.getElementById('progressText'),
        progressBar: document.getElementById('progressBar'),
        modeIndicator: document.getElementById('modeIndicator'),
        reviewList: document.getElementById('reviewList')
    };
}

// 初始化测试
export function init() {
    // 初始化 DOM 元素缓存
    initDomElements();
    
    // 打乱单词顺序
    shuffledWords = [...words].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    knownCount = 0;
    reviewList = [];
    isReviewMode = false;
    reviewModeTotalWords = 0;
    testModeProgress = 0;
    updateStats();
    showCurrentWord();
    
    // 初始化键盘快捷键
    initKeyboardShortcuts();
}

// 初始化键盘快捷键
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // 防止在输入框中触发快捷键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        switch (e.key) {
            case 'ArrowRight':
            case 'd':
                // 认识，下一个
                knownWord();
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
                // 上一个
                previousWord();
                e.preventDefault();
                break;
            case ' ': 
                // 查看中文
                showChinese();
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
                // 不认识，标记复习
                unknownWord();
                e.preventDefault();
                break;
            case 'r':
                // 开始复习
                startReview();
                e.preventDefault();
                break;
            case 't':
                // 开始测试
                startTest();
                e.preventDefault();
                break;
            case 'p':
                // 发音
                pronounceWord();
                e.preventDefault();
                break;
        }
    });
}

// 设置单词列表
export function setWords(newWords) {
    words = newWords;
    init();
}

// 开始测试
export function startTest() {
    if (words.length === 0) {
        showToast(t('toast.noWords'), 'error');
        return;
    }
    
    // 如果当前在复习模式，退出复习模式并恢复测试进度
    if (isReviewMode) {
        isReviewMode = false;
        reviewModeTotalWords = 0;
        // 恢复测试模式的进度
        shuffledWords = [...words].sort(() => Math.random() - 0.5);
        currentIndex = testModeProgress;
    } else if (currentIndex === 0 && knownCount === 0) {
        // 只有在首次开始测试时才重新初始化
        init();
        // 记录测试开始时间
        testStartTime = Date.now();
    }
    
    // 隐藏重新测试按钮，显示开始测试按钮
    const startButton = document.querySelector('button[onclick="startTest()"]');
    const restartButton = document.querySelector('button[onclick="restartTest()"]');
    if (startButton) startButton.style.display = 'inline-block';
    if (restartButton) restartButton.style.display = 'none';
    
    updateStats();
    showCurrentWord();
    saveData();
    showToast(t('toast.startTest'), 'success');
}

// 重新测试
export function restartTest() {
    if (confirm(t('confirm.restart'))) {
        init();
        // 隐藏重新测试按钮，显示开始测试按钮
        const startButton = document.querySelector('button[onclick="startTest()"]');
        const restartButton = document.querySelector('button[onclick="restartTest()"]');
        if (startButton) startButton.style.display = 'inline-block';
        if (restartButton) restartButton.style.display = 'none';
        saveData();
        showToast(t('toast.restartTest'), 'success');
    }
}

// 单词发音功能
export function pronounceWord() {
    const word = shuffledWords[currentIndex];
    if (!word) return;
    
    const speech = new SpeechSynthesisUtterance(word.english);
    speech.lang = 'en-US';
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;
    
    window.speechSynthesis.speak(speech);
}

// 显示当前单词
export function showCurrentWord() {
    updateModeIndicator();
    
    if (currentIndex >= shuffledWords.length) {
        if (domElements.wordDisplay) {
            domElements.wordDisplay.textContent = isReviewMode ? t('reviewComplete') : t('quizComplete');
        }
        
        if (domElements.startSection) {
            domElements.startSection.style.display = 'block';
        }
        
        if (domElements.controlsSection) {
            domElements.controlsSection.style.display = 'none';
        }
        
        if (domElements.startButton) {
            domElements.startButton.style.display = isReviewMode ? 'inline-block' : 'none';
        }
        if (domElements.restartButton) {
            domElements.restartButton.style.display = isReviewMode ? 'none' : 'inline-block';
        }
        
        if (domElements.chineseDisplay) {
            domElements.chineseDisplay.textContent = '';
            domElements.chineseDisplay.classList.remove('show');
        }
        
        // 计算测试时间并保存学习记录
        if (!isReviewMode && testStartTime > 0) {
            const duration = Math.round((Date.now() - testStartTime) / 1000);
            // 动态导入统计模块
            import('./statistics.js').then(({ saveLearningRecord }) => {
                saveLearningRecord(knownCount, words.length, duration);
            }).catch(err => console.error('加载统计模块失败:', err));
        }
        
        // 更新进度条为100%
        updateStats();
        return;
    }
    
    const word = shuffledWords[currentIndex];
    if (!word) return;
    
    // 强制更新DOM
    if (domElements.wordDisplay && domElements.chineseDisplay) {
        // 直接设置内容，确保DOM立即更新
        domElements.wordDisplay.textContent = word.english;
        domElements.chineseDisplay.textContent = word.chinese;
        domElements.chineseDisplay.classList.remove('show');
        
        // 强制浏览器重排
        domElements.wordDisplay.offsetHeight;
    }
    
    // 隐藏开始按钮，显示控制区域
    if (domElements.startSection) {
        domElements.startSection.style.display = 'none';
    }
    
    if (domElements.controlsSection) {
        domElements.controlsSection.style.display = 'flex';
    }
    
    // 检查单词是否已收藏并更新收藏按钮状态
    updateFavoriteButton();
}

// 更新收藏按钮状态
async function updateFavoriteButton() {
    if (currentIndex >= shuffledWords.length) return;
    
    const word = shuffledWords[currentIndex];
    if (!word) return;
    
    try {
        // 动态导入db模块
        const { isFavorite } = await import('./db.js');
        const favoriteButton = document.getElementById('favoriteButton');
        if (favoriteButton) {
            const isFav = await isFavorite(word.id);
            favoriteButton.innerHTML = isFav ? '❤️ 已收藏' : '🤍 收藏';
            favoriteButton.className = isFav ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-secondary';
        }
    } catch (error) {
        console.error('更新收藏按钮状态失败:', error);
    }
}

// 切换收藏状态
export async function toggleFavorite() {
    if (currentIndex >= shuffledWords.length) return;
    
    const word = shuffledWords[currentIndex];
    if (!word) return;
    
    try {
        // 动态导入db模块和ui模块
        const { isFavorite, addToFavorites, removeFromFavorites } = await import('./db.js');
        const { showToast } = await import('./ui.js');
        
        const isFav = await isFavorite(word.id);
        if (isFav) {
            await removeFromFavorites(word.id);
            showToast('已取消收藏', 'info');
        } else {
            await addToFavorites(word.id);
            showToast('已添加到收藏', 'success');
        }
        
        // 更新收藏按钮状态
        updateFavoriteButton();
    } catch (error) {
        console.error('切换收藏状态失败:', error);
        showToast('操作失败', 'error');
    }
}

// 显示中文翻译
export function showChinese() {
    if (domElements.chineseDisplay) {
        domElements.chineseDisplay.classList.add('show');
    }
}

// 认识这个单词
export function knownWord() {
    if (isReviewMode) {
        // 复习模式下，将当前单词从复习列表中移除
        const currentWord = shuffledWords[currentIndex];
        const indexInReview = reviewList.findIndex(word => 
            word.english === currentWord.english && 
            word.chinese === currentWord.chinese
        );
        if (indexInReview > -1) {
            reviewList.splice(indexInReview, 1);
        }
    } else {
        // 确保knownCount不会超过总单词数
        if (knownCount < words.length) {
            knownCount++;
        }
    }
    currentIndex++;
    updateStats();
    showCurrentWord();
    saveData();
}

// 不认识这个单词，标记复习
export function unknownWord() {
    if (!isReviewMode) {
        const currentWord = shuffledWords[currentIndex];
        // 检查单词是否已经在复习列表中
        const isDuplicate = reviewList.some(word => 
            word.english === currentWord.english && 
            word.chinese === currentWord.chinese
        );
        if (!isDuplicate) {
            reviewList.push(currentWord);
        }
        currentIndex++;
    } else {
        // 复习模式下，将当前单词移到列表末尾，不增加进度条
        const currentWord = shuffledWords[currentIndex];
        // 从当前位置移除
        shuffledWords.splice(currentIndex, 1);
        // 添加到末尾
        shuffledWords.push(currentWord);
        // 不增加currentIndex，保持在当前位置
    }
    updateStats();
    showCurrentWord();
    saveData();
}

// 回溯到上一个单词
export function previousWord() {
    if (currentIndex > 0) {
        currentIndex--;
        // 检查当前单词是否在复习列表中
        const currentWord = shuffledWords[currentIndex];
        const indexInReview = reviewList.findIndex(word => 
            word.english === currentWord.english && 
            word.chinese === currentWord.chinese
        );
        if (indexInReview > -1 && !isReviewMode) {
            // 只有在非复习模式下，才从复习列表中移除单词
            // 如果单词在复习列表中，说明之前标记为不认识，移除它
            reviewList.splice(indexInReview, 1);
        } else if (!isReviewMode) {
            // 如果单词不在复习列表中，且不是复习模式，说明之前标记为认识，需要减回去
            knownCount = Math.max(0, knownCount - 1);
        }
        updateStats();
        showCurrentWord();
        saveData();
    }
}

// 开始复习模式
export function startReview() {
    if (reviewList.length === 0) {
        showToast(t('toast.noReviewWords'), 'info');
        return;
    }
    
    // 保存测试模式的进度
    if (!isReviewMode) {
        testModeProgress = currentIndex;
    }
    
    isReviewMode = true;
    // 保存当前复习列表的长度，用于进度条计算
    reviewModeTotalWords = reviewList.length;
    // 打乱复习列表
    shuffledWords = [...reviewList].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    // 立即更新统计信息和显示
    updateStats();
    showCurrentWord();
    saveData();
    showToast(t('toast.startReview'), 'success');
}

// 切换模式
export function returnToMainMode() {
    if (isReviewMode) {
        // 从复习模式切换到测试模式
        isReviewMode = false;
        reviewModeTotalWords = 0;
        // 恢复测试模式的进度
        shuffledWords = [...words].sort(() => Math.random() - 0.5);
        currentIndex = testModeProgress;
        showToast(t('toast.switchToTest'), 'info');
    } else {
        // 从测试模式切换到复习模式（如果有需要复习的单词）
        if (reviewList.length > 0) {
            startReview();
            return;
        } else {
            showToast(t('toast.noReviewWords'), 'info');
            return;
        }
    }
    // 更新统计信息和显示
    updateStats();
    showCurrentWord();
    saveData();
}

// 更新统计信息
export function updateStats() {
    // 总单词数始终显示为原始单词列表的长度
    const totalWords = words.length;
    if (domElements.totalWords) {
        domElements.totalWords.textContent = totalWords;
    }
    
    // 当前进度在复习模式下显示复习进度，测试模式下显示测试进度
    if (domElements.currentIndex) {
        domElements.currentIndex.textContent = isReviewMode ? currentIndex + 1 : currentIndex + 1;
    }
    
    // 已掌握单词数保持不变
    if (domElements.knownCount) {
        domElements.knownCount.textContent = knownCount;
    }
    
    // 需复习单词数显示当前复习列表长度
    if (domElements.reviewCount) {
        domElements.reviewCount.textContent = reviewList.length;
    }
    
    updateReviewList();
    
    // 更新进度条
    const total = isReviewMode ? reviewModeTotalWords : totalWords;
    // 确保processedCount不会超过total
    let processedCount;
    if (isReviewMode) {
        // 复习模式下，进度基于当前索引
        processedCount = currentIndex;
    } else {
        // 测试模式下，进度基于当前索引
        processedCount = currentIndex;
    }
    // 强制限制processedCount的范围
    processedCount = Math.max(0, Math.min(processedCount, total));
    // 当完成所有单词时，进度显示为100%
    let progress = 0;
    if (total > 0) {
        if (processedCount >= total) {
            // 完成测试或复习
            progress = 100;
        } else {
            // 计算当前进度
            progress = Math.min(Math.round((processedCount / total) * 100), 100);
        }
    }
    // 显示为x/总数格式
    const displayText = total > 0 ? `${processedCount}/${total} (${progress}%)` : '0/0 (0%)';
    
    if (domElements.progressText) {
        domElements.progressText.textContent = displayText;
    }
    
    if (domElements.progressBar) {
        domElements.progressBar.style.width = `${progress}%`;
    }
    
    // 动态导入可视化模块以避免初始加载时的性能问题
    import('./visualization.js').then(({ updateProgressChart, updateReviewChart }) => {
        // 检查DOM元素是否存在
        const progressChartElement = document.getElementById('progressChart');
        const reviewChartElement = document.getElementById('reviewChart');
        if (progressChartElement) {
            // 更新进度图表
            updateProgressChart(progress);
        }
        if (reviewChartElement) {
            // 更新复习情况图表
            updateReviewChart(knownCount, reviewList.length);
        }
    }).catch(err => console.error('加载可视化模块失败:', err));
}

// 更新复习列表
export function updateReviewList() {
    if (!domElements.reviewList) return;
    
    domElements.reviewList.innerHTML = '';
    
    if (reviewList.length === 0) {
        domElements.reviewList.innerHTML = '<li class="empty-state">暂无需要复习的单词</li>';
        return;
    }
    
    reviewList.forEach((word, index) => {
        const li = document.createElement('li');
        li.className = 'review-item';
        li.innerHTML = `
            <div style="flex: 1;">
                <span class="english">${word.english}</span>
                <span class="chinese">${word.chinese}</span>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="removeFromReview(${index})">删除</button>
        `;
        domElements.reviewList.appendChild(li);
    });
}

// 从复习列表中删除单词
export function removeFromReview(index) {
    reviewList.splice(index, 1);
    updateStats();
    saveData();
}

// 清除复习列表
export function clearReviewList() {
    if (reviewList.length === 0) {
        showToast(t('toast.noReviewWords'), 'info');
        return;
    }
    
    if (confirm(t('confirm.clearReview'))) {
        reviewList = [];
        updateStats();
        saveData();
        showToast('复习列表已清除！', 'success');
    }
}

// 更新模式状态显示
export function updateModeIndicator() {
    if (!domElements.modeIndicator) return;
    
    if (isReviewMode) {
        domElements.modeIndicator.textContent = t('modeIndicator.review');
        domElements.modeIndicator.style.backgroundColor = '#e74c3c';
        domElements.modeIndicator.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        domElements.modeIndicator.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.4)';
    } else {
        domElements.modeIndicator.textContent = t('modeIndicator.test');
        domElements.modeIndicator.style.backgroundColor = '#3498db';
        domElements.modeIndicator.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
        domElements.modeIndicator.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.4)';
    }
}

// 保存数据到localStorage
export function saveData() {
    const data = {
        reviewList,
        knownCount,
        timestamp: Date.now()
    };
    localStorage.setItem('quizData', JSON.stringify(data));
}

// 从localStorage加载数据
export function loadData() {
    const saved = localStorage.getItem('quizData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.reviewList) reviewList = data.reviewList;
            if (data.knownCount) knownCount = data.knownCount;
        } catch (error) {
            console.error('加载数据失败:', error);
        }
    }
}

// 导出当前单词列表
export function exportWords() {
    const exportData = {
        words: words.map(word => ({
            english: word.english,
            chinese: word.chinese
        })),
        reviewList: reviewList,
        knownCount: knownCount,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vocabquiz-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showToast('单词列表已导出！', 'success');
}