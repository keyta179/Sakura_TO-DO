import React from 'react';

const SettingsPopup = ({ settings, setSettings, closeSettingsPopup }) => {
    const changeBodySize = (width, height) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            bodyWidth: width,
            bodyHeight: height
        }));
    };
    const changeTodoSize = (width, height) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            todoWidth: width,
            todoHeight: height
        }));
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Settings</h2>
                <h3>Adjust Body Size</h3>
                <label htmlFor="width">Width:</label>
                <input
                    type="range"
                    id="width"
                    min="400"
                    max="800"
                    step="10"
                    value={settings.bodyWidth}
                    onChange={(e) => changeBodySize(Number(e.target.value), settings.bodyHeight)}

                />
                <label htmlFor="height">Height:</label>
                <input
                    type="range"
                    id="height"
                    min="300"
                    max="600"
                    step="10"
                    value={settings.bodyHeight}
                    onChange={(e) => changeBodySize(settings.bodyWidth, Number(e.target.value))}
                />
                <p></p>
                <label htmlFor="todoWidth">Todo Width:</label>
                <input
                    type="range"
                    id="todoWidth"
                    min="170"
                    max="300"
                    step="10"
                    value={settings.todoWidth}
                    onChange={(e) => changeTodoSize(Number(e.target.value), settings.todoHeight)}
                />

                <label htmlFor="todoHeight">Todo Height:</label>
                <input
                    type="range"
                    id="todoHeight"
                    min="110"
                    max="300"
                    step="10"
                    value={settings.todoHeight}
                    onChange={(e) => changeTodoSize(settings.todoWidth, Number(e.target.value))}
                />

                <button onClick={closeSettingsPopup}>Close</button>
            </div>
        </div>
    );
};

export default SettingsPopup;
