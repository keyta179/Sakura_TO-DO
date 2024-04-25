// SettingsPopup.js
import React from 'react';

const SettingsPopup = ({ bodyWidth, bodyHeight, changeBodySize, closeSettingsPopup }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                {/* ポップアップの内容 */}
                <h2>Settings</h2>
                <h3>ボディサイズを調整</h3>
                <label htmlFor="width">幅:</label>
                <input
                    type="range"
                    id="width"
                    min="400"
                    max="800"
                    step="10"
                    value={bodyWidth}
                    onChange={(e) => changeBodySize(Number(e.target.value), bodyHeight)}
                />
                <label htmlFor="height">高さ:</label>
                <input
                    type="range"
                    id="height"
                    min="300"
                    max="600"
                    step="10"
                    value={bodyHeight}
                    onChange={(e) => changeBodySize(bodyWidth, Number(e.target.value))}
                />
                <button onClick={closeSettingsPopup}>Close</button>
            </div>
        </div>
    );
};

export default SettingsPopup;
