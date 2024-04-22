import React, { useState, useEffect } from 'react';

const TodoItem = ({ todo, todos, setTodos, onDelete }) => {
    const [dragging, setDragging] = useState(false); // ドラッグ中かどうかの状態
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // マウス位置

    // ドラッグ開始時の処理
    const handleDragStart = (event) => {
        setDragging(true);
        setMousePos({ x: event.clientX, y: event.clientY });
    };

    // ドラッグ中の処理
    const handleDrag = (event) => {
        if (dragging) {
            const deltaX = event.clientX - mousePos.x;
            const deltaY = event.clientY - mousePos.y;

            // ドラッグ中の ToDo アイテムの位置を更新
            const updatedTodos = todos.map((item) => {
                if (item === todo) {
                    return {
                        ...item,
                        position: {
                            x: item.position.x + deltaX,
                            y: item.position.y + deltaY,
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

    useEffect(() => {
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
    }, [dragging, todos, todo, setTodos]);

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
                left: todo.position.x,
                top: todo.position.y,
                cursor: dragging ? 'grabbing' : 'grab',
                zIndex: dragging ? 1 : 0,
            }}
            className="todo-item"
            onMouseDown={handleDragStart}
        >   
            <div className="todo-info">
                <div className="todo-title">{todo.title}</div>
                <div className="todo-date" style={{ color: changeDateColor(todo) }}>Date: {todo.date}</div>
                <div className="todo-contents">Contents<br/> {todo.contents}</div>
                <div className='todo-duration'>所要時間 {todo.duration}</div>
                <button className="todo-deleteButton" onClick={onDelete}>×</button>
            </div>
        </div>
    );
};

export default TodoItem;
