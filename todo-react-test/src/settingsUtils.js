export const loadSettingsFromLocalStorage = () => {
    const savedSettings = JSON.parse(localStorage.getItem('settings'));
    return savedSettings || { bodyWidth: 800, bodyHeight: 600 };
};

// 設定をローカルストレージに保存する関数
export const saveSettingsToLocalStorage = (settings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
};