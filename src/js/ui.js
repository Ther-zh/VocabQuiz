import { getAllLibraries, getLibrary, createLibrary, updateLibrary, deleteLibrary, getWordsByLibraryId } from './db.js';
import { setWords } from './quiz.js';
import { t } from './i18n.js';
import { getCurrentLibraryId, setCurrentLibraryId } from './main.js';

// 全局变量
let currentPage = 'quiz';

// 页面切换功能
export function switchPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId;
    
    // 更新导航链接状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // 如果切换到导入页面，刷新词库选择
    if (pageId === 'import') {
        refreshLibrarySelect();
    }
}

// 显示Toast消息
export function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 打开创建词库模态框
export function openCreateLibraryModal() {
    document.getElementById('libraryModal').classList.add('active');
    document.getElementById('libraryForm').reset();
    document.getElementById('libraryId').value = '';
    document.querySelector('.modal-title').textContent = '创建词库';
}

// 关闭词库模态框
export function closeLibraryModal() {
    document.getElementById('libraryModal').classList.remove('active');
}

// 刷新词库列表
export async function refreshLibraryList() {
    try {
        const libraries = await getAllLibraries();
        const libraryList = document.getElementById('libraryList');
        libraryList.innerHTML = '';
        
        if (libraries.length === 0) {
            libraryList.innerHTML = '<li class="empty-state">暂无词库，请创建一个词库</li>';
            return;
        }
        
        libraries.forEach(library => {
            const li = document.createElement('li');
            li.className = 'library-item';
            li.innerHTML = `
                <div class="library-info">
                    <div class="library-name">${library.name}</div>
                    <div class="library-description">${library.description || '无描述'}</div>
                    <div class="library-stats">
                        单词数: ${library.wordCount} | 创建时间: ${new Date(library.createdAt).toLocaleString()}
                    </div>
                </div>
                <div class="library-actions">
                    <button class="btn btn-sm btn-primary" onclick="useLibrary(${library.id})">使用</button>
                    <button class="btn btn-sm btn-secondary" onclick="editLibrary(${library.id})">编辑</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteLibrary(${library.id})">删除</button>
                    <button class="btn btn-sm btn-warning" onclick="exportLibraryToJson(${library.id})">导出</button>
                </div>
            `;
            libraryList.appendChild(li);
        });
    } catch (error) {
        console.error('刷新词库列表失败:', error);
        showToast(t('toast.refreshError'), 'error');
    }
}

// 刷新词库选择
export async function refreshLibrarySelect() {
    try {
        const libraries = await getAllLibraries();
        const select = document.getElementById('selectedLibrary');
        select.innerHTML = '';
        
        if (libraries.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '暂无词库，请先创建';
            select.appendChild(option);
            return;
        }
        
        libraries.forEach(library => {
            const option = document.createElement('option');
            option.value = library.id;
            option.textContent = `${library.name} (${library.wordCount}个单词)`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('刷新词库选择失败:', error);
        showToast(t('toast.refreshError'), 'error');
    }
}

// 初始化导航链接点击事件
export function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            switchPage(pageId);
        });
    });
}

// 初始化词库表单
export function initLibraryForm() {
    document.getElementById('libraryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('libraryId').value;
        const name = document.getElementById('libraryName').value;
        const description = document.getElementById('libraryDescription').value;
        
        try {
            if (id) {
                // 更新词库
                await updateLibrary(parseInt(id), { name, description });
                showToast(t('toast.updateLibrary'), 'success');
            } else {
                // 创建词库
                await createLibrary(name, description);
                showToast(t('toast.createLibrary'), 'success');
            }
            closeLibraryModal();
            await refreshLibraryList();
            await refreshLibrarySelect();
        } catch (error) {
            console.error('保存词库失败:', error);
            showToast(t('toast.saveError'), 'error');
        }
    });
}

// 编辑词库
export async function editLibrary(id) {
    try {
        const library = await getLibrary(id);
        if (library) {
            document.getElementById('libraryId').value = library.id;
            document.getElementById('libraryName').value = library.name;
            document.getElementById('libraryDescription').value = library.description;
            document.querySelector('.modal-title').textContent = '编辑词库';
            document.getElementById('libraryModal').classList.add('active');
        }
    } catch (error) {
        console.error('获取词库信息失败:', error);
        showToast(t('toast.loadError'), 'error');
    }
}

// 使用词库
export async function useLibrary(id) {
    try {
        const words = await getWordsByLibraryId(id);
        if (words.length === 0) {
            showToast(t('toast.noWordsInLibrary'), 'info');
            switchPage('import');
            // 设置当前选择的词库
            document.getElementById('selectedLibrary').value = id;
            return;
        }
        
        // 设置单词列表
        setWords(words.map(word => ({
            english: word.english,
            chinese: word.chinese
        })));
        // 使用setCurrentLibraryId函数设置当前词库ID
        setCurrentLibraryId(id);
        switchPage('quiz');
        showToast(t('toast.useLibrary'), 'success');
    } catch (error) {
        console.error('使用词库失败:', error);
        showToast(t('toast.useError'), 'error');
    }
}

// 导出词库为JSON
export async function exportLibraryToJson(libraryId) {
    try {
        const library = await getLibrary(libraryId);
        const words = await getWordsByLibraryId(libraryId);
        
        const exportData = {
            library: library,
            words: words.map(word => ({
                english: word.english,
                chinese: word.chinese
            })),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vocabquiz-library-${library.name}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showToast(t('toast.exportSuccess'), 'success');
    } catch (error) {
        console.error('导出词库失败:', error);
        showToast(t('toast.exportError'), 'error');
    }
}

// 删除词库
export async function deleteLibraryById(id) {
    if (confirm(t('confirm.deleteLibrary'))) {
        try {
            await deleteLibrary(id);
            await refreshLibraryList();
            await refreshLibrarySelect();
            showToast(t('toast.deleteLibrary'), 'success');
        } catch (error) {
            console.error('删除词库失败:', error);
            showToast(t('toast.deleteError'), 'error');
        }
    }
}