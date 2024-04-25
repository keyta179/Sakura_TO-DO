// Favorite.js
import React from 'react';
import { useState } from 'react';
import './../style/Favorite.css';
const Favorite = ({ favoriteTodos, onDragStart }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupIndex, setPopupIndex] = useState(null);

    const onDeleteFavorite = () => {
        console.log('delete');
    };

    const handleDragStart = (event, todo) => {
        onDragStart(event, todo);
    };

    const updateMenu = (index) => {
        // ポップアップを表示する
        setShowPopup(true);
        // ポップアップの対象インデックスを設定する
        setPopupIndex(index);
    };

    const closePopup = () => {
        // ポップアップを非表示にする
        setShowPopup(false);
        // ポップアップの対象インデックスをリセットする
        setPopupIndex(null);
    };

    return (
        <div className="favorite-list-container">
            <h2>Favorite Todos</h2>
            {showPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <div className="popup-content">
                            <p>このタスクを削除しますか？</p>
                            
                            <button onClick={closePopup}>キャンセル</button>
                            <button onClick={() => {
                                // 削除ロジックを追加する
                                favoriteTodos.splice(popupIndex, 1);
                                closePopup();
                            }}>削除</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="favorite-list">
                {favoriteTodos.map((todo, index) => (
                    <div
                        className="favorite-item"
                        key={index}
                        draggable
                        onContextMenu={(e) => {
                            e.preventDefault();
                            updateMenu(index); // 右クリックでタブを削除する
                        }}
                        onDragStart={(e) => handleDragStart(e, todo)}
                    >
                        <div className="favorite-info">
                            <div className="favorite-title">{todo.title}</div>
                            <div className="favorite-date">Date: {todo.date}</div>
                            <div className="favorite-deleteButton" onClick={onDeleteFavorite}>
                                ×
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Favorite;
