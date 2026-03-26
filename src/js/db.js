// IndexedDB 配置
export const DB_NAME = 'VocabQuizDB';
export const DB_VERSION = 1;
export const LIBRARY_STORE = 'libraries';
export const WORD_STORE = 'words';
let db = null;

// 打开或创建数据库
export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // 创建词库存储
            if (!db.objectStoreNames.contains(LIBRARY_STORE)) {
                const libraryStore = db.createObjectStore(LIBRARY_STORE, { keyPath: 'id', autoIncrement: true });
                libraryStore.createIndex('name', 'name', { unique: false });
                libraryStore.createIndex('createdAt', 'createdAt', { unique: false });
            }
            
            // 创建单词存储
            if (!db.objectStoreNames.contains(WORD_STORE)) {
                const wordStore = db.createObjectStore(WORD_STORE, { keyPath: 'id', autoIncrement: true });
                wordStore.createIndex('libraryId', 'libraryId', { unique: false });
                wordStore.createIndex('english', 'english', { unique: false });
            }
            
            // 创建收藏单词存储
            if (!db.objectStoreNames.contains('favorites')) {
                const favoriteStore = db.createObjectStore('favorites', { keyPath: 'id', autoIncrement: true });
                favoriteStore.createIndex('wordId', 'wordId', { unique: true });
                favoriteStore.createIndex('createdAt', 'createdAt', { unique: false });
            }
        };
        
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        
        request.onerror = (event) => {
            console.error('打开数据库失败:', event.target.error);
            reject(event.target.error);
        };
    });
}

// 执行数据库事务
export function executeTransaction(storeNames, mode, callback) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('数据库未打开'));
            return;
        }
        
        const transaction = db.transaction(storeNames, mode);
        const result = callback(transaction);
        
        // 处理callback返回Promise的情况
        if (result instanceof Promise) {
            result.then(value => {
                transaction.oncomplete = () => resolve(value);
                transaction.onerror = (event) => reject(event.target.error);
            }).catch(error => {
                reject(error);
            });
        } else {
            transaction.oncomplete = () => resolve(result);
            transaction.onerror = (event) => reject(event.target.error);
        }
    });
}

// 创建词库
export function createLibrary(name, description) {
    return executeTransaction([LIBRARY_STORE], 'readwrite', (transaction) => {
        const store = transaction.objectStore(LIBRARY_STORE);
        const library = {
            name,
            description,
            wordCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const request = store.add(library);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}

// 获取所有词库
export function getAllLibraries() {
    return executeTransaction([LIBRARY_STORE], 'readonly', (transaction) => {
        const store = transaction.objectStore(LIBRARY_STORE);
        const request = store.getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}

// 获取单个词库
export function getLibrary(id) {
    return executeTransaction([LIBRARY_STORE], 'readonly', (transaction) => {
        const store = transaction.objectStore(LIBRARY_STORE);
        const request = store.get(id);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}

// 更新词库
export function updateLibrary(id, updates) {
    return executeTransaction([LIBRARY_STORE], 'readwrite', (transaction) => {
        const store = transaction.objectStore(LIBRARY_STORE);
        const request = store.get(id);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const library = request.result;
                if (library) {
                    const updatedLibrary = {
                        ...library,
                        ...updates,
                        updatedAt: new Date().toISOString()
                    };
                    const putRequest = store.put(updatedLibrary);
                    putRequest.onsuccess = () => resolve(updatedLibrary);
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    reject(new Error('词库不存在'));
                }
            };
            request.onerror = () => reject(request.error);
        });
    });
}

// 删除词库
export function deleteLibrary(id) {
    return executeTransaction([LIBRARY_STORE, WORD_STORE], 'readwrite', (transaction) => {
        const libraryStore = transaction.objectStore(LIBRARY_STORE);
        const wordStore = transaction.objectStore(WORD_STORE);
        const index = wordStore.index('libraryId');
        
        // 删除词库中的所有单词
        const wordRequest = index.openCursor(id);
        wordRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
        
        // 删除词库
        const libraryRequest = libraryStore.delete(id);
        return new Promise((resolve, reject) => {
            libraryRequest.onsuccess = () => resolve(true);
            libraryRequest.onerror = () => reject(libraryRequest.error);
        });
    });
}

// 向词库添加单词
export function addWordsToLibrary(libraryId, words) {
    return executeTransaction([WORD_STORE, LIBRARY_STORE], 'readwrite', (transaction) => {
        const wordStore = transaction.objectStore(WORD_STORE);
        const libraryStore = transaction.objectStore(LIBRARY_STORE);
        let addedCount = 0;
        
        // 获取词库中已有的单词，使用对象存储以确保english和chinese都匹配
        const existingWords = new Set();
        const index = wordStore.index('libraryId');
        const cursorRequest = index.openCursor(libraryId);
        
        return new Promise((resolve, reject) => {
            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    // 使用english和chinese的组合作为唯一标识
                    const wordKey = `${cursor.value.english.toLowerCase()}|${cursor.value.chinese.toLowerCase()}`;
                    existingWords.add(wordKey);
                    cursor.continue();
                } else {
                    // 所有现有单词已加载，开始添加新单词
                    for (const word of words) {
                        if (word && word.english && word.chinese) {
                            const wordKey = `${word.english.toLowerCase()}|${word.chinese.toLowerCase()}`;
                            if (!existingWords.has(wordKey)) {
                                wordStore.add({ ...word, libraryId });
                                existingWords.add(wordKey);
                                addedCount++;
                            }
                        }
                    }
                    
                    // 更新词库的单词数量
                    const libraryRequest = libraryStore.get(libraryId);
                    libraryRequest.onsuccess = (event) => {
                        const library = event.target.result;
                        if (library) {
                            // 新的单词数量是原有数量加上新添加的数量
                            const updatedLibrary = { 
                                ...library, 
                                wordCount: library.wordCount + addedCount, 
                                updatedAt: new Date().toISOString() 
                            };
                            libraryStore.put(updatedLibrary);
                        }
                    };
                    
                    resolve(addedCount);
                }
            };
            
            cursorRequest.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
}

// 从词库获取单词
export function getWordsByLibraryId(libraryId) {
    return executeTransaction([WORD_STORE], 'readonly', (transaction) => {
        const wordStore = transaction.objectStore(WORD_STORE);
        const index = wordStore.index('libraryId');
        const request = index.getAll(libraryId);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}

// 清空词库中的所有单词
export function clearWordsByLibraryId(libraryId) {
    return executeTransaction([WORD_STORE, LIBRARY_STORE], 'readwrite', (transaction) => {
        const wordStore = transaction.objectStore(WORD_STORE);
        const index = wordStore.index('libraryId');
        const libraryStore = transaction.objectStore(LIBRARY_STORE);
        
        // 删除所有单词
        const request = index.openCursor(libraryId);
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
        
        // 更新词库的单词数量
        const libraryRequest = libraryStore.get(libraryId);
        libraryRequest.onsuccess = (event) => {
            const library = event.target.result;
            if (library) {
                const updatedLibrary = { ...library, wordCount: 0, updatedAt: new Date().toISOString() };
                libraryStore.put(updatedLibrary);
            }
        };
    });
}

// 导出词库为JSON
export function exportLibraryToJson(libraryId) {
    return new Promise(async (resolve, reject) => {
        try {
            const library = await getLibrary(libraryId);
            const words = await getWordsByLibraryId(libraryId);
            
            const exportData = {
                library: {
                    name: library.name,
                    description: library.description,
                    wordCount: library.wordCount,
                    createdAt: library.createdAt,
                    updatedAt: library.updatedAt
                },
                words: words.map(word => ({
                    english: word.english,
                    chinese: word.chinese
                }))
            };
            
            resolve(exportData);
        } catch (error) {
            reject(error);
        }
    });
}

// 添加单词到收藏
export function addToFavorites(wordId) {
    // 检查 wordId 是否有效
    if (!wordId) {
        return Promise.resolve(false);
    }
    
    return executeTransaction(['favorites'], 'readwrite', (transaction) => {
        const store = transaction.objectStore('favorites');
        const favorite = {
            wordId,
            createdAt: new Date().toISOString()
        };
        const request = store.add(favorite);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    });
}

// 从收藏中移除单词
export function removeFromFavorites(wordId) {
    // 检查 wordId 是否有效
    if (!wordId) {
        return Promise.resolve(false);
    }
    
    return executeTransaction(['favorites'], 'readwrite', (transaction) => {
        const store = transaction.objectStore('favorites');
        const index = store.index('wordId');
        const request = index.openCursor(wordId);
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            request.onerror = () => reject(request.error);
        });
    });
}

// 检查单词是否已收藏
export function isFavorite(wordId) {
    // 检查 wordId 是否有效
    if (!wordId) {
        return Promise.resolve(false);
    }
    
    return executeTransaction(['favorites'], 'readonly', (transaction) => {
        const store = transaction.objectStore('favorites');
        const index = store.index('wordId');
        const request = index.get(wordId);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result !== undefined);
            request.onerror = () => reject(request.error);
        });
    });
}

// 获取所有收藏单词
export function getFavoriteWords() {
    return executeTransaction(['favorites', 'words'], 'readonly', (transaction) => {
        const favoriteStore = transaction.objectStore('favorites');
        const wordStore = transaction.objectStore('words');
        const favorites = [];
        
        return new Promise((resolve, reject) => {
            const request = favoriteStore.getAll();
            request.onsuccess = (event) => {
                const favoriteItems = event.target.result;
                if (favoriteItems.length === 0) {
                    resolve([]);
                    return;
                }
                
                let completed = 0;
                favoriteItems.forEach(item => {
                    const wordRequest = wordStore.get(item.wordId);
                    wordRequest.onsuccess = (event) => {
                        const word = event.target.result;
                        if (word) {
                            favorites.push(word);
                        }
                        completed++;
                        if (completed === favoriteItems.length) {
                            resolve(favorites);
                        }
                    };
                    wordRequest.onerror = () => {
                        completed++;
                        if (completed === favoriteItems.length) {
                            resolve(favorites);
                        }
                    };
                });
            };
            request.onerror = () => reject(request.error);
        });
    });
}