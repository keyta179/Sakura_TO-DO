// TodoItem.js
import React, { useState } from 'react';

const TodoItem = ({ todo, onDelete }) => {
  const [dragging, setDragging] = useState(false); // ドラッグ中かどうかの状態
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 図形の位置

  // ドラッグ開始時の処理
  const handleDragStart = (event) => {
    setDragging(true);
  };

  // ドラッグ中の処理
  const handleDrag = (event) => {
    if (dragging) {
      setPosition({
        x: position.x + event.movementX,
        y: position.y + event.movementY,
      });
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (event) => {
    setDragging(false);
  };
  const changeDateColor = (todo) => {
    const todoDate = new Date(todo.date);
    const currentDate = new Date();
    const timeDiff = todoDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    let colorIntensity = 0;
  
    if (daysDiff <= 3) {
      colorIntensity = Math.min(Math.abs(daysDiff) / 3, 1);
    } else {
      colorIntensity = Math.min((Math.abs(daysDiff) - 3) / 2, 1);
    }
  
    const red = Math.round(255 * (1 - colorIntensity));
    const green = Math.round(255 * colorIntensity);
    const bgColor = `rgb(${red}, ${green}, 0)`;
    return bgColor;
  };
  return (
    <div 
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      className="todo-item" 
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div className="todo-info">
        <div className="todo-title">Title: {todo.title}</div>
        <div className="todo-date" style={{ color: changeDateColor(todo) }}>Date: {todo.date}</div>
        <div className="todo-contents">Contents: {todo.contents}</div>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TodoItem;
