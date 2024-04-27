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
        <div className="setting-popup">
            
                <h2>Settings</h2>
                <h3>Adjust Body Size</h3>
                <label htmlFor="width">Width:</label>
                <p>
                <input
                    type="range"
                    id="width"
                    min="400"
                    max="800"
                    step="5"
                    value={settings.bodyWidth}
                    onChange={(e) => changeBodySize(Number(e.target.value), settings.bodyHeight)}

                /></p>
                <p>
                <label htmlFor="height">Height:</label></p>
                <p>
                <input
                    type="range"
                    id="height"
                    min="300"
                    max="565"
                    step="5"
                    value={settings.bodyHeight}
                    onChange={(e) => changeBodySize(settings.bodyWidth, Number(e.target.value))}
                /></p>
                <p>
                <label htmlFor="todoWidth">Todo Width:</label></p>
                <p>
                <input
                    type="range"
                    id="todoWidth"
                    min="170"
                    max="300"
                    step="10"
                    value={settings.todoWidth}
                    onChange={(e) => changeTodoSize(Number(e.target.value), settings.todoHeight)}
                /></p>
<p>
                <label htmlFor="todoHeight">Todo Height:</label></p>
                <p>
                <input
                    type="range"
                    id="todoHeight"
                    min="110"
                    max="300"
                    step="10"
                    value={settings.todoHeight}
                    onChange={(e) => changeTodoSize(settings.todoWidth, Number(e.target.value))}
                /></p>
                <p>

                <button onClick={closeSettingsPopup}>Close</button></p>
            </div>
        
    );
};

export default SettingsPopup;