// Favorite.js

import React from 'react';
import './Favorite.css';
const Favorite = ({ favoriteTodos }) => {
    const onDeleteFavorite = () => {
        console.log('delete');
    };
    return (
        <div className="favorite-list-container">
            <h2>Favorite Todos</h2>
            <div className="favorite-list">
                {favoriteTodos.map((todo, index) => (
                    <div className="favorite-item" key={index}>
                        <div className="favorite-info">
                            <div className="favorite-title">{todo.title}</div>
                            <div className="favorite-date">Date: {todo.date}</div>
                            <div className="favorite-deleteButton" onClick={onDeleteFavorite}>×</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Favorite;
