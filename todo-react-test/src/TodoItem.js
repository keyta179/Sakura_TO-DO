import React, { useState, useEffect } from 'react';
import './TodoItem.css';



const TodoItem = ({ todo, todos, setTodos, onDelete,onAddFavorite }) => {
    const [dragging, setDragging] = useState(false); // ドラッグ中かどうかの状態
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // マウス位置

    // ドラッグ開始時の処理
    const handleDragStart = (event) => {
        setDragging(true);
        setMousePos({ x: event.clientX, y: event.clientY });
    };
    const addFavorite = () => {
        console.log(todo);
        onAddFavorite(todo);
      };


    useEffect(() => {
        const handleDrag = (event) => {
            if (dragging) {
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const deltaX = event.clientX - mousePos.x;
                const deltaY = event.clientY - mousePos.y;

                let newPositionX = todo.position.x + deltaX;
                let newPositionY = todo.position.y + deltaY;

                // 画面外に出ないように位置を制限
                newPositionX = Math.max(0, Math.min(newPositionX, windowWidth));
                newPositionY = Math.max(0, Math.min(newPositionY, windowHeight));

                const updatedTodos = todos.map((item) => {
                    if (item === todo) {
                        return {
                            ...item,
                            position: {
                                x: newPositionX,
                                y: newPositionY,
                            },
                        };
                    }
                    return item;
                });

                setTodos(updatedTodos);
                setMousePos({ x: event.clientX, y: event.clientY });
            }
        };

        // ドラッグ終了時の処理
        const handleDragEnd = () => {
            setDragging(false);
        };
        if (dragging) {
            window.addEventListener('mousemove', handleDrag);
            window.addEventListener('mouseup', handleDragEnd);
        } else {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
        };
    }, [dragging, mousePos, todo, todos, setTodos]);

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
    

    // ...


    return (
        <div
            style={{
                left: todo.position.x,
                top: todo.position.y,
            }}
            className="todo-item"
            onMouseDown={handleDragStart}
        >   
            <div className="todo-info">
                <div className="todo-title">{todo.title}</div>
                <div className="todo-date" style={{ color: changeDateColor(todo) }}>Date: {todo.date}</div>
                <div className="todo-contents">Contents<br /> {todo.contents}</div>
                <div className='todo-duration'>所要時間 {todo.duration}</div>
                <div className="todo-deleteButton" onClick={onDelete}>×</div>
                <div className="todo-favoriteButton" onClick={addFavorite}>☆</div>
            </div>
        </div>
    );
};

export default TodoItem;
