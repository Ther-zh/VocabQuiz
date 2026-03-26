// 导入核心模块
import { openDB, getWordsByLibraryId, getAllLibraries, createLibrary, addWordsToLibrary } from './db.js';
import { init, loadData, setWords, startTest, restartTest, showChinese, knownWord, unknownWord, previousWord, startReview, returnToMainMode, clearReviewList, removeFromReview, exportWords, pronounceWord, toggleFavorite } from './quiz.js';
import { switchPage, showToast, openCreateLibraryModal, closeLibraryModal, refreshLibraryList, refreshLibrarySelect, initNavigation, initLibraryForm, editLibrary, useLibrary, deleteLibraryById, exportLibraryToJson } from './ui.js';
import { importWords, loadFromJsonFile, loadDefaultWords, loadBuiltInWords } from './import.js';
import { defaultWords } from './data.js';
import { initLanguage, createLanguageSwitcher, t } from './i18n.js';

// 全局变量
let currentPage = 'quiz'; // 当前活跃页面
let _currentLibraryId = null;

// 导出currentLibraryId的getter和setter
export function getCurrentLibraryId() {
    return _currentLibraryId;
}

export function setCurrentLibraryId(id) {
    _currentLibraryId = id;
}

// 为了向后兼容，导出currentLibraryId变量
export let currentLibraryId = _currentLibraryId;

// 初始化应用
async function initApp() {
    try {
        // 打开数据库
        await openDB();
        
        // 加载本地存储的数据
        loadData();
        
        // 检查是否有词库
        const libraries = await getAllLibraries();
        if (libraries.length === 0) {
            // 创建默认词库
            const defaultLibraryId = await createLibrary('默认词库', '系统默认词库');
            setCurrentLibraryId(defaultLibraryId);
            
            // 加载默认单词到默认词库
            await addWordsToLibrary(defaultLibraryId, defaultWords);
            
            // 设置默认单词列表
            setWords(defaultWords);
        } else {
            // 使用第一个词库
            setCurrentLibraryId(libraries[0].id);
            const words = await getWordsByLibraryId(getCurrentLibraryId());
            if (words.length > 0) {
                setWords(words.map(word => ({
                    english: word.english,
                    chinese: word.chinese
                })));
            } else {
                setWords(defaultWords);
            }
        }
        
        // 初始化导航
        initNavigation();
        
        // 初始化词库表单
        initLibraryForm();
        
        // 刷新词库列表
        await refreshLibraryList();
        
        // 刷新词库选择
        await refreshLibrarySelect();
        
        // 显示初始页面
        switchPage('quiz');
        
        // 初始化国际化支持
        initLanguage();
        createLanguageSwitcher();
        
        // 显示欢迎消息
        showToast(t('toast.welcome'), 'success');
        
        // 动态加载非核心模块，减少初始加载时间
        setTimeout(async () => {
            try {
                // 动态导入可视化模块
                const { initCharts } = await import('./visualization.js');
                initCharts();
                
                // 动态导入统计模块
                const { initLearningStats } = await import('./statistics.js');
                initLearningStats();
            } catch (error) {
                console.error('加载非核心模块失败:', error);
            }
        }, 1000);
    } catch (error) {
        console.error('初始化应用失败:', error);
        showToast('初始化应用失败！', 'error');
    }
}

// 将函数暴露到全局作用域，以便HTML中直接调用
window.startTest = startTest;
window.restartTest = restartTest;
window.showChinese = showChinese;
window.knownWord = knownWord;
window.unknownWord = unknownWord;
window.previousWord = previousWord;
window.startReview = startReview;
window.returnToMainMode = returnToMainMode;
window.clearReviewList = clearReviewList;
window.removeFromReview = removeFromReview;
window.exportWords = exportWords;
window.pronounceWord = pronounceWord;
window.toggleFavorite = toggleFavorite;
window.openCreateLibraryModal = openCreateLibraryModal;
window.closeLibraryModal = closeLibraryModal;
window.refreshLibraryList = refreshLibraryList;
window.editLibrary = editLibrary;
window.useLibrary = useLibrary;
window.deleteLibrary = deleteLibraryById;
window.exportLibraryToJson = exportLibraryToJson;
window.importWords = importWords;
window.loadFromJsonFile = loadFromJsonFile;
window.loadDefaultWords = loadDefaultWords;
window.loadBuiltInWords = loadBuiltInWords;

// 切换快捷键帮助模态框
window.toggleShortcutHelp = function() {
    const modal = document.getElementById('shortcutModal');
    if (modal) {
        modal.classList.toggle('active');
    }
};

// 显示收藏单词模态框
window.showFavorites = function() {
    // 动态导入 quiz 模块以使用其中的函数
    import('./quiz.js').then(({ displayFavorites }) => {
        displayFavorites();
    }).catch(err => console.error('加载 quiz 模块失败:', err));
};

// 关闭收藏单词模态框
window.closeFavoritesModal = function() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// 页面加载完成后初始化
window.onload = async function() {
    await initApp();
    // 隐藏页面加载动画
    const loadingElement = document.getElementById('pageLoading');
    if (loadingElement) {
        loadingElement.classList.add('hidden');
        // 动画结束后移除元素
        setTimeout(() => {
            loadingElement.remove();
        }, 500);
    }
};