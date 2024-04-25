// Favorite.js
import React from 'react';
import { useState } from 'react';
import './../style/Favorite.css';
import { useEffect } from 'react';
const Favorite = ({ favoriteTodos, setFavoriteTodos, onDragStart }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupIndex, setPopupIndex] = useState(null);
    const loadFavoriteTodosFromLocalStorage = () => {
        const savedFavoriteTodos = localStorage.getItem('favoriteTodos');
        if (savedFavoriteTodos) {
            return JSON.parse(savedFavoriteTodos);
        }
        return [];
    };
    const saveFavoriteTodosToLocalStorage = (favoriteTodos) => {
        localStorage.setItem('favoriteTodos', JSON.stringify(favoriteTodos));
    };

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
    // 初期化時にローカルストレージからお気に入りToDoを読み込む
    useEffect(() => {
        const savedFavoriteTodos = loadFavoriteTodosFromLocalStorage();
        setFavoriteTodos(savedFavoriteTodos);
    }, []);

    // お気に入りToDoが変更されたときにローカルストレージに保存する
    useEffect(() => {
        saveFavoriteTodosToLocalStorage(favoriteTodos);
    }, [favoriteTodos]);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]; // 曜日を取得
        return `(${weekday}) ${hours}:${minutes}`;
      };
    return (
        <div className="favorite-list-container">
            <h2>Favorite Todos</h2>
            {showPopup && (
                <div className="popup-container">
                    <div className="popup-favorite">
                        <div className="popup-content">
                        <p>{`"${favoriteTodos[popupIndex].title}" を削除しますか？`}</p>


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
                            <div className="favorite-date">締め切り{formatDate(todo.date)}</div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Favorite;
