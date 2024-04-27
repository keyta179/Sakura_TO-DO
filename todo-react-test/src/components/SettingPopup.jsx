import React from 'react';

const SettingsPopup = ({ settings, setSettings, closeSettingsPopup }) => {
    const changeBodySize = (width, height) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            bodyWidth: Math.max(500, Math.min(width, 800)),
            bodyHeight: Math.max(280, Math.min(height, 565))
        }));
    };

    const changeTodoSize = (width, height) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            todoWidth: Math.max(170, Math.min(width, 300)),
            todoHeight: Math.max(110, Math.min(height,300))
        }));
    };

    return (
        <div className="setting-popup">
            <h2>Settings</h2>
            <div className="setting-group">
                <div className="setting-pair">
                    <h3>Adjust Body Size</h3>
                    <div className="setting-row">
                        <label htmlFor="bodyWidth">Width:</label>
                        <input
                            type="number"
                            id="bodyWidth"
                            min="200"
                            max="800"
                            step="5"
                            value={settings.bodyWidth}
                            onChange={(e) => changeBodySize(Number(e.target.value), settings.bodyHeight)}
                        />
                    </div>
                    <div className="setting-row">
                        <label htmlFor="bodyHeight">Height:</label>
                        <input
                            type="number"
                            id="bodyHeight"
                            min="200"
                            max="565"
                            step="5"
                            value={settings.bodyHeight}
                            onChange={(e) => changeBodySize(settings.bodyWidth, Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="setting-pair">
                    <h3>Adjust Todo Size</h3>
                    <div className="setting-row">
                        <label htmlFor="todoWidth">Width:</label>
                        <input
                            type="number"
                            id="todoWidth"
                            min="170"
                            max="300"
                            step="10"
                            value={settings.todoWidth}
                            onChange={(e) => changeTodoSize(Number(e.target.value), settings.todoHeight)}
                        />
                    </div>
                    <div className="setting-row">
                        <label htmlFor="todoHeight">Height:</label>
                        <input
                            type="number"
                            id="todoHeight"
                            min="110"
                            max="300"
                            step="10"
                            value={settings.todoHeight}
                            onChange={(e) => changeTodoSize(settings.todoWidth, Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>
            <button onClick={closeSettingsPopup}>Close</button>
        </div>
    );
};

export default SettingsPopup;
