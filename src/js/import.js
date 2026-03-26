import { builtInWords, defaultWords } from './data.js';
import { addWordsToLibrary, getWordsByLibraryId } from './db.js';
import { showToast, refreshLibraryList, refreshLibrarySelect } from './ui.js';
import { setWords } from './quiz.js';
import { getCurrentLibraryId, setCurrentLibraryId } from './main.js';

// 全局变量 - 现在从main.js导入

// 输入验证函数，防止XSS攻击
function validateInput(input) {
    if (typeof input !== 'string') {
        return input;
    }
    // 移除潜在的XSS攻击代码
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/&/g, '&amp;');
}

// 从文本导入单词
export async function importWords() {
    const input = document.getElementById('wordInput').value;
    const selectedLibraryId = document.getElementById('selectedLibrary').value;
    
    if (!selectedLibraryId) {
        showToast('请先选择词库！', 'error');
        return;
    }
    
    if (!input.trim()) {
        showToast('请输入单词列表！', 'error');
        return;
    }
    
    let newWords = [];
    
    // 尝试解析为JSON格式
    try {
        const jsonData = JSON.parse(input);
        if (Array.isArray(jsonData) && jsonData.length > 0) {
            newWords = jsonData;
        }
    } catch (e) {
        // 如果不是JSON格式，尝试按行解析
        const lines = input.trim().split('\n');
        lines.forEach((line, index) => {
            const parts = line.split(',');
            if (parts.length >= 2) {
                const english = validateInput(parts[0].trim());
                const chinese = validateInput(parts.slice(1).join(',').trim());
                if (english && chinese) {
                    newWords.push({ english, chinese });
                }
            }
        });
    }
    
    if (newWords.length > 0) {
        try {
            // 增量添加新单词，避免重复
            const addedCount = await addWordsToLibrary(parseInt(selectedLibraryId), newWords);
            showToast(`成功导入 ${addedCount} 个单词到词库！`, 'success');
            
            // 更新词库列表
            await refreshLibraryList();
            await refreshLibrarySelect();
            
            // 如果当前使用的是该词库，更新单词
            if (getCurrentLibraryId() === parseInt(selectedLibraryId)) {
                const words = await getWordsByLibraryId(parseInt(selectedLibraryId));
                setWords(words.map(word => ({
                    english: word.english,
                    chinese: word.chinese
                })));
            }
        } catch (error) {
            console.error('导入单词失败:', error);
            showToast('导入单词失败！', 'error');
        }
    } else {
        showToast('没有有效的单词数据！', 'error');
    }
}

// 从JSON文件导入
export function loadFromJsonFile() {
    const fileInput = document.getElementById('jsonFileInput');
    const file = fileInput.files[0];
    const selectedLibraryId = document.getElementById('selectedLibrary').value;
    
    if (!selectedLibraryId) {
        showToast('请先选择词库！', 'error');
        return;
    }
    
    if (!file) {
        showToast('请选择一个JSON文件！', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            let content = e.target.result;
            
            // 处理BOM（字节顺序标记）问题
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }
            
            // 解析JSON
            const data = JSON.parse(content);
            
            let validWords = [];
            
            if (data.words && Array.isArray(data.words)) {
                // 导入格式：{ "words": [{"english": "...", "chinese": "..."}] }
                validWords = data.words.filter(item => 
                    item && typeof item === 'object' && 
                    typeof item.english === 'string' && 
                    typeof item.chinese === 'string'
                );
            } else if (Array.isArray(data)) {
                // 导入格式：[{"english": "...", "chinese": "..."}]
                validWords = data.filter(item => 
                    item && typeof item === 'object' && 
                    typeof item.english === 'string' && 
                    typeof item.chinese === 'string'
                );
            }
            
            if (validWords.length === 0) {
                showToast('JSON文件中没有有效的单词数据！每个单词必须包含english和chinese字段。', 'error');
                return;
            }
            
            // 增量添加新单词，避免重复
            const addedCount = await addWordsToLibrary(parseInt(selectedLibraryId), validWords);
            showToast(`成功导入 ${addedCount} 个单词到词库！`, 'success');
            
            // 更新词库列表
            await refreshLibraryList();
            await refreshLibrarySelect();
            
            // 如果当前使用的是该词库，更新单词
            if (getCurrentLibraryId() === parseInt(selectedLibraryId)) {
                const words = await getWordsByLibraryId(parseInt(selectedLibraryId));
                setWords(words.map(word => ({
                    english: word.english,
                    chinese: word.chinese
                })));
            }
            
            // 清空文件输入
            fileInput.value = '';
        } catch (error) {
            console.error('解析JSON文件失败:', error);
            showToast('解析JSON文件失败！', 'error');
        }
    };
    
    reader.onerror = function(e) {
        console.error('文件读取失败:', e.target.error);
        showToast('文件读取失败！', 'error');
    };
    
    reader.readAsText(file, 'utf-8');
}

// 加载默认单词
export async function loadDefaultWords() {
    const selectedLibraryId = document.getElementById('selectedLibrary').value;
    
    if (!selectedLibraryId) {
        showToast('请先选择词库！', 'error');
        return;
    }
    
    try {
        // 增量添加默认单词，避免重复
        const addedCount = await addWordsToLibrary(parseInt(selectedLibraryId), defaultWords);
        showToast(`成功加载 ${addedCount} 个默认单词到词库！`, 'success');
        
        // 更新词库列表
        await refreshLibraryList();
        await refreshLibrarySelect();
        
        // 如果当前使用的是该词库，更新单词
        if (getCurrentLibraryId() === parseInt(selectedLibraryId)) {
            const words = await getWordsByLibraryId(parseInt(selectedLibraryId));
            setWords(words.map(word => ({
                english: word.english,
                chinese: word.chinese
            })));
        }
    } catch (error) {
        console.error('加载默认单词失败:', error);
        showToast('加载默认单词失败！', 'error');
    }
}

// 加载内置完整单词列表
export async function loadBuiltInWords() {
    const selectedLibraryId = document.getElementById('selectedLibrary').value;
    
    if (!selectedLibraryId) {
        showToast('请先选择词库！', 'error');
        return;
    }
    
    try {
        // 增量添加内置单词，避免重复
        const addedCount = await addWordsToLibrary(parseInt(selectedLibraryId), builtInWords);
        showToast(`成功加载 ${addedCount} 个内置单词到词库！`, 'success');
        
        // 更新词库列表
        await refreshLibraryList();
        await refreshLibrarySelect();
        
        // 如果当前使用的是该词库，更新单词
        if (getCurrentLibraryId() === parseInt(selectedLibraryId)) {
            const words = await getWordsByLibraryId(parseInt(selectedLibraryId));
            setWords(words.map(word => ({
                english: word.english,
                chinese: word.chinese
            })));
        }
    } catch (error) {
        console.error('加载内置单词失败:', error);
        showToast('加载内置单词失败！', 'error');
    }
}