// 国际化支持模块

// 语言包
const translations = {
  zh: {
    appName: 'VocabQuiz',
    startTest: '开始测试',
    restartTest: '重新测试',
    library: '词库管理',
    import: '导入单词',
    review: '我的复习',
    instructions: '使用说明',
    instruction1: '系统会随机显示英文单词，中文翻译默认隐藏',
    instruction2: '如果你认识这个单词，可以点击「认识，下一个」',
    instruction3: '如果你不认识，可以点击「查看中文」先看翻译，然后点击「不认识，标记复习」',
    instruction4: '可以点击「跳过」直接进入下一个单词',
    instruction5: '标记的单词会在「我的复习」页面中集中显示',
    instruction6: '你可以通过「词库管理」页面创建和管理词库',
    totalWords: '总单词数',
    currentProgress: '当前进度',
    known: '已掌握',
    needReview: '需复习',
    testProgress: '测试进度',
    modeIndicator: {
      test: '测试模式',
      review: '复习模式'
    },
    pronounce: '发音',
    previous: '上一个',
    showChinese: '查看中文',
    knownNext: '认识，下一个',
    unknownReview: '不认识，标记复习',
    switchMode: '切换模式',
    quizComplete: 'VocabQuiz完成！',
    reviewComplete: '复习完成！',
    libraryManagement: '词库管理',
    createLibrary: '新建词库',
    refreshLibrary: '刷新词库',
    noLibraries: '暂无词库，请新建或导入词库',
    use: '使用',
    edit: '编辑',
    delete: '删除',
    export: '导出',
    importWords: '导入单词',
    selectLibrary: '选择词库：',
    refresh: '刷新',
    format: '格式：每行一个单词，英文和中文用英文逗号分隔，例如：hello,你好 或直接粘贴JSON格式',
    jsonExample: 'JSON格式示例：',
    importText: '导入文本',
    loadDefault: '加载默认单词',
    exportJson: '导出当前词库JSON',
    restart: '重新开始测试',
    myReview: '我的复习',
    startReview: '开始复习',
    clearReview: '清除复习列表',
    noReviewWords: '暂无需要复习的单词',
    deleteWord: '删除',
    createLibraryModal: '新建词库',
    editLibraryModal: '编辑词库',
    libraryName: '词库名称',
    libraryDescription: '词库描述',
    save: '保存',
    cancel: '取消',
    toast: {
      welcome: '欢迎使用VocabQuiz！',
      noWords: '请先导入单词！',
      startTest: '开始测试！',
      restartTest: '测试已重新开始！',
      switchToTest: '已切换到测试模式！',
      noReviewWords: '暂无需要复习的单词！',
      startReview: '开始复习！',
      importSuccess: '成功导入 {count} 个单词！',
      loadDefault: '成功加载 {count} 个默认单词到词库！',
      exportSuccess: '词库导出成功！',
      createLibrary: '词库创建成功！',
      updateLibrary: '词库更新成功！',
      deleteLibrary: '词库删除成功！',
      useLibrary: '词库切换成功！',
      noWordsInLibrary: '该词库暂无单词，请先导入！',
      parseError: '解析JSON文件失败！',
      readError: '文件读取失败！',
      noValidWords: '没有有效的单词数据！',
      initError: '初始化应用失败！',
      loadError: '加载单词失败！',
      saveError: '保存词库失败！',
      refreshError: '刷新词库列表失败！',
      deleteError: '删除词库失败！',
      useError: '使用词库失败！',
      exportError: '导出词库失败！',
      importError: '导入单词失败！',
      loadDefaultError: '加载默认单词失败！'
    },
    confirm: {
      restart: '确定要重新开始测试吗？这将重置所有进度！',
      deleteLibrary: '确定要删除这个词库吗？删除后将无法恢复！',
      clearReview: '确定要清除所有复习单词吗？',
      resetStats: '确定要重置所有学习统计数据吗？此操作不可恢复！'
    },
    learningStats: '学习统计',
    progressTrend: '学习进度趋势',
    wordMastery: '单词掌握情况'
  },
  en: {
    appName: 'VocabQuiz',
    startTest: 'Start Test',
    restartTest: 'Restart Test',
    library: 'Library',
    import: 'Import Words',
    review: 'My Review',
    instructions: 'Instructions',
    instruction1: 'The system will randomly display English words, with Chinese translations hidden by default',
    instruction2: 'If you know the word, you can click "Known, Next"',
    instruction3: 'If you don\'t know, you can click "Show Chinese" to see the translation first, then click "Unknown, Mark for Review"',
    instruction4: 'You can click "Skip" to go directly to the next word',
    instruction5: 'Marked words will be displayed in the "My Review" page',
    instruction6: 'You can create and manage libraries through the "Library" page',
    totalWords: 'Total Words',
    currentProgress: 'Current Progress',
    known: 'Known',
    needReview: 'Need Review',
    testProgress: 'Test Progress',
    modeIndicator: {
      test: 'Test Mode',
      review: 'Review Mode'
    },
    pronounce: 'Pronounce',
    previous: 'Previous',
    showChinese: 'Show Chinese',
    knownNext: 'Known, Next',
    unknownReview: 'Unknown, Mark for Review',
    switchMode: 'Switch Mode',
    quizComplete: 'VocabQuiz Complete!',
    reviewComplete: 'Review Complete!',
    libraryManagement: 'Library Management',
    createLibrary: 'Create Library',
    refreshLibrary: 'Refresh Libraries',
    noLibraries: 'No libraries yet, please create or import libraries',
    use: 'Use',
    edit: 'Edit',
    delete: 'Delete',
    export: 'Export',
    importWords: 'Import Words',
    selectLibrary: 'Select Library:',
    refresh: 'Refresh',
    format: 'Format: One word per line, English and Chinese separated by English comma, e.g.: hello,你好 or paste JSON format directly',
    jsonExample: 'JSON Format Example:',
    importText: 'Import Text',
    loadDefault: 'Load Default Words',
    exportJson: 'Export Current Library JSON',
    restart: 'Restart Test',
    myReview: 'My Review',
    startReview: 'Start Review',
    clearReview: 'Clear Review List',
    noReviewWords: 'No words need review',
    deleteWord: 'Delete',
    createLibraryModal: 'Create Library',
    editLibraryModal: 'Edit Library',
    libraryName: 'Library Name',
    libraryDescription: 'Library Description',
    save: 'Save',
    cancel: 'Cancel',
    toast: {
      welcome: 'Welcome to VocabQuiz!',
      noWords: 'Please import words first!',
      startTest: 'Start Test!',
      restartTest: 'Test has been restarted!',
      switchToTest: 'Switched to test mode!',
      noReviewWords: 'No words need review!',
      startReview: 'Start Review!',
      importSuccess: 'Successfully imported {count} words!',
      loadDefault: 'Successfully loaded {count} default words to library!',
      exportSuccess: 'Library exported successfully!',
      createLibrary: 'Library created successfully!',
      updateLibrary: 'Library updated successfully!',
      deleteLibrary: 'Library deleted successfully!',
      useLibrary: 'Library switched successfully!',
      noWordsInLibrary: 'This library has no words, please import first!',
      parseError: 'Failed to parse JSON file!',
      readError: 'Failed to read file!',
      noValidWords: 'No valid word data!',
      initError: 'Failed to initialize application!',
      loadError: 'Failed to load words!',
      saveError: 'Failed to save library!',
      refreshError: 'Failed to refresh library list!',
      deleteError: 'Failed to delete library!',
      useError: 'Failed to use library!',
      exportError: 'Failed to export library!',
      importError: 'Failed to import words!',
      loadDefaultError: 'Failed to load default words!'
    },
    confirm: {
      restart: 'Are you sure you want to restart the test? This will reset all progress!',
      deleteLibrary: 'Are you sure you want to delete this library? This cannot be undone!',
      clearReview: 'Are you sure you want to clear all review words?',
      resetStats: 'Are you sure you want to reset all learning statistics? This operation cannot be undone!'
    },
    learningStats: 'Learning Statistics',
    progressTrend: 'Progress Trend',
    wordMastery: 'Word Mastery'
  }
};

// 当前语言
let currentLang = 'zh';

// 获取翻译
export function t(key, params = {}) {
  const keys = key.split('.');
  let value = translations[currentLang];
  
  for (const k of keys) {
    if (value === undefined) break;
    value = value[k];
  }
  
  if (typeof value === 'string') {
    // 替换参数
    return Object.entries(params).reduce((result, [param, value]) => {
      return result.replace(new RegExp(`\\{${param}\\}`), value);
    }, value);
  }
  
  return key;
}

// 切换语言
export function changeLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('vocabquiz-lang', lang);
    updateUI();
    return true;
  }
  return false;
}

// 获取当前语言
export function getCurrentLanguage() {
  return currentLang;
}

// 初始化语言
export function initLanguage() {
  // 从localStorage获取保存的语言
  const savedLang = localStorage.getItem('vocabquiz-lang');
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
  } else {
    // 检测浏览器语言
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      currentLang = browserLang;
    }
  }
  updateUI();
}

// 更新UI
function updateUI() {
  // 更新页面标题
  document.title = `${t('appName')} - ${t('startTest')}`;
  
  // 更新导航栏
  document.querySelector('.nav-title').textContent = t('appName');
  document.querySelectorAll('.nav-link').forEach((link, index) => {
    const pages = ['startTest', 'library', 'import', 'review'];
    if (pages[index]) {
      link.textContent = t(pages[index]);
    }
  });
  
  // 更新测试页面
  updateTestPage();
  
  // 更新词库管理页面
  updateLibraryPage();
  
  // 更新导入页面
  updateImportPage();
  
  // 更新复习页面
  updateReviewPage();
  
  // 更新模态框
  updateModal();
}

// 更新测试页面
function updateTestPage() {
  const quizPage = document.getElementById('quiz');
  if (quizPage) {
    // 更新使用说明
    const instructions = quizPage.querySelector('.instructions h3');
    if (instructions) instructions.textContent = t('instructions');
    
    const instructionList = quizPage.querySelectorAll('.instructions li');
    instructionList.forEach((li, index) => {
      const instructionKeys = ['instruction1', 'instruction2', 'instruction3', 'instruction4', 'instruction5', 'instruction6'];
      if (instructionKeys[index]) {
        li.textContent = t(instructionKeys[index]);
      }
    });
    
    // 更新统计标签
    const statLabels = quizPage.querySelectorAll('.stat-label');
    const statKeys = ['totalWords', 'currentProgress', 'known', 'needReview'];
    statLabels.forEach((label, index) => {
      if (statKeys[index]) {
        label.textContent = t(statKeys[index]);
      }
    });
    
    // 更新进度文本
    const progressText = quizPage.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = t('testProgress') + ': ';
    }
    
    // 更新模式指示器
    const modeIndicator = document.getElementById('modeIndicator');
    if (modeIndicator) {
      modeIndicator.textContent = t('modeIndicator.test');
    }
    
    // 更新发音按钮
    const pronounceBtn = quizPage.querySelector('button[onclick="pronounceWord()"]');
    if (pronounceBtn) {
      pronounceBtn.textContent = '🔊 ' + t('pronounce');
    }
    
    // 更新开始测试按钮
    const startBtn = quizPage.querySelector('button[onclick="startTest()"]');
    if (startBtn) startBtn.textContent = t('startTest');
    
    // 更新重新测试按钮
    const restartBtn = quizPage.querySelector('button[onclick="restartTest()"]');
    if (restartBtn) restartBtn.textContent = t('restartTest');
    
    // 更新控制按钮
    const controlBtns = quizPage.querySelectorAll('#controlsSection button');
    const controlKeys = ['previous', 'showChinese', 'knownNext', 'unknownReview', 'switchMode'];
    controlBtns.forEach((btn, index) => {
      if (controlKeys[index]) {
        btn.textContent = t(controlKeys[index]);
      }
    });
  }
}

// 更新词库管理页面
function updateLibraryPage() {
  const libraryPage = document.getElementById('library');
  if (libraryPage) {
    // 更新标题
    const title = libraryPage.querySelector('h3');
    if (title) title.textContent = t('libraryManagement');
    
    // 更新按钮
    const createBtn = libraryPage.querySelector('button[onclick="openCreateLibraryModal()"]');
    if (createBtn) createBtn.textContent = t('createLibrary');
    
    const refreshBtn = libraryPage.querySelector('button[onclick="refreshLibraryList()"]');
    if (refreshBtn) refreshBtn.textContent = t('refreshLibrary');
    
    // 更新空状态
    const emptyState = libraryPage.querySelector('.empty-state');
    if (emptyState) emptyState.textContent = t('noLibraries');
  }
}

// 更新导入页面
function updateImportPage() {
  const importPage = document.getElementById('import');
  if (importPage) {
    // 更新标题
    const title = importPage.querySelector('h3');
    if (title) title.textContent = t('importWords');
    
    // 更新选择词库标签
    const selectLabel = importPage.querySelector('label[for="selectedLibrary"]');
    if (selectLabel) selectLabel.textContent = t('selectLibrary');
    
    // 更新刷新按钮
    const refreshBtn = importPage.querySelector('button[onclick="refreshLibrarySelect()"]');
    if (refreshBtn) refreshBtn.textContent = t('refresh');
    
    // 更新格式说明
    const formatText = importPage.querySelector('p:nth-of-type(2)');
    if (formatText) formatText.textContent = t('format');
    
    // 更新JSON示例标题
    const jsonExampleTitle = importPage.querySelector('h4');
    if (jsonExampleTitle) jsonExampleTitle.textContent = t('jsonExample');
    
    // 更新按钮
    const importTextBtn = importPage.querySelector('button[onclick="importWords()"]');
    if (importTextBtn) importTextBtn.textContent = t('importText');
    
    const loadDefaultBtn = importPage.querySelector('button[onclick="loadDefaultWords()"]');
    if (loadDefaultBtn) loadDefaultBtn.textContent = t('loadDefault');
    
    const exportJsonBtn = importPage.querySelector('button[onclick="exportLibraryToJson()"]');
    if (exportJsonBtn) exportJsonBtn.textContent = t('exportJson');
    
    const restartBtn = importPage.querySelector('button[onclick="restartTest()"]');
    if (restartBtn) restartBtn.textContent = t('restart');
  }
}

// 更新复习页面
function updateReviewPage() {
  const reviewPage = document.getElementById('review');
  if (reviewPage) {
    // 更新标题
    const title = reviewPage.querySelector('h2');
    if (title) title.textContent = t('myReview');
    
    // 更新按钮
    const startReviewBtn = reviewPage.querySelector('button[onclick="startReview()"]');
    if (startReviewBtn) startReviewBtn.textContent = t('startReview');
    
    const clearReviewBtn = reviewPage.querySelector('button[onclick="clearReviewList()"]');
    if (clearReviewBtn) clearReviewBtn.textContent = t('clearReview');
    
    // 更新空状态
    const emptyState = reviewPage.querySelector('.empty-state');
    if (emptyState) emptyState.textContent = t('noReviewWords');
  }
}

// 更新模态框
function updateModal() {
  const modal = document.getElementById('libraryModal');
  if (modal) {
    // 更新标题
    const title = modal.querySelector('.modal-title');
    if (title) title.textContent = t('createLibraryModal');
    
    // 更新标签
    const nameLabel = modal.querySelector('label[for="libraryName"]');
    if (nameLabel) nameLabel.textContent = t('libraryName');
    
    const descLabel = modal.querySelector('label[for="libraryDescription"]');
    if (descLabel) descLabel.textContent = t('libraryDescription');
    
    // 更新按钮
    const cancelBtn = modal.querySelector('button[onclick="closeLibraryModal()"]');
    if (cancelBtn) cancelBtn.textContent = t('cancel');
    
    const saveBtn = modal.querySelector('button[type="submit"]');
    if (saveBtn) saveBtn.textContent = t('save');
  }
}

// 导出语言切换功能
export function createLanguageSwitcher() {
  const switcher = document.createElement('div');
  switcher.className = 'language-switcher';
  switcher.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    gap: 10px;
  `;
  
  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' }
  ];
  
  languages.forEach(lang => {
    const button = document.createElement('button');
    button.className = `btn btn-sm ${currentLang === lang.code ? 'btn-primary' : 'btn-secondary'}`;
    button.textContent = lang.name;
    button.onclick = () => {
      if (changeLanguage(lang.code)) {
        languages.forEach(l => {
          const btn = switcher.querySelector(`[data-lang="${l.code}"]`);
          if (l.code === lang.code) {
            btn.className = 'btn btn-sm btn-primary';
          } else {
            btn.className = 'btn btn-sm btn-secondary';
          }
        });
      }
    };
    button.setAttribute('data-lang', lang.code);
    switcher.appendChild(button);
  });
  
  document.body.appendChild(switcher);
}