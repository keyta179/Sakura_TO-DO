import React, { useState, useEffect, useCallback } from 'react';
import './../style/TodoItem.css';

const TodoItem = ({ todo, todos, setTodo, setTodos, onDelete, onAddFavorite }) => {
    const [dragging, setDragging] = useState(false); // ドラッグ中かどうかの状態
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // マウス位置
    const [show, setShow] = useState(false);
    const [isFavoriteClicked, setIsFavoriteClicked] = useState(false);
    const [isTodoMenuOpened, setIsTodoMenuOpened] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    // ドラッグ開始時の処理
    const handleDragStart = (event) => {
        setDragging(true);
        setMousePos({ x: event.clientX, y: event.clientY });
    };
    const [menuTodo, setMenuTodo] = useState({
        title: '',
        contents: '',
        date: '',
        duration: '',
    });

    const addFavorite = () => {
        setIsFavoriteClicked(true); // Mark favorite as clicked
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

    useEffect(() => {
        setShow(true); // Set show to true initially
        return;
    }, [todo]);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]; // 曜日を取得
        return `${year}年 ${month}月 ${day}日 (${weekday}) ${hours}:${minutes}`;
    };

    // Function to handle animation end
    const handleAnimationEnd = () => {
        setIsFavoriteClicked(false); // Reset isFavoriteClicked state to false after animation ends
    };
    const openTodoMenu = (todo) => {
        setSelectedTodo(todo);
        setIsTodoMenuOpened(true);
    }
    const closePopupMenu = () => {
        setIsTodoMenuOpened(false);
    };
    const handleMenuChange = useCallback((e) => {
        const { name, value } = e.target;
        setMenuTodo(prevMenuTodo => ({
            ...prevMenuTodo,
            [name]: value
        }));
    }, []);
    const updateTodo = (e) => {
        e.preventDefault();
        if (!menuTodo.title || !menuTodo.date) return;
        setTodos(prevTodos => prevTodos.map((item) => {
            if (item === selectedTodo) {
                return {
                    ...item,
                    title: menuTodo.title,
                    contents: menuTodo.contents,
                    date: menuTodo.date,
                    duration: menuTodo.duration,
                };
            }
            return item;
        }));
        setMenuTodo({
            title: '',
            contents: '',
            date: '',
            duration: '',
        });
        setIsTodoMenuOpened(false);
    };
    useEffect(() => {
        if (selectedTodo) {
            setMenuTodo({
                title: selectedTodo.title,
                contents: selectedTodo.contents,
                date: selectedTodo.date,
                duration: selectedTodo.duration,
            });
        }
    }, [selectedTodo]);

    return (
        <div>
            <div>
                {isTodoMenuOpened && (
                    <div className="popup-container">
                        <div className="popup-menu">
                            <div className="popup-menu-content">
                                <p>{`"${selectedTodo.title}"の更新 `}</p>
                                <form onSubmit={updateTodo}>
                                    <input value={menuTodo.title} type="text" name="title" onChange={handleMenuChange} placeholder="Title" />
                                    <p><textarea value={menuTodo.contents} type="text" name="contents" onChange={handleMenuChange} placeholder="Contents" /></p>
                                    <p><input value={menuTodo.date} type="datetime-local" name="date" onChange={handleMenuChange} /></p>
                                    <input value={menuTodo.duration} type='time' name="duration" onChange={handleMenuChange} />
                                    <button type="submit">Update ToDo</button>
                                </form>

                                <button onClick={closePopupMenu}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div
                style={{
                    left: todo.position.x,
                    top: todo.position.y,
                }}
                className={`todo-item ${show ? 'show' : ''}`}
                onMouseDown={handleDragStart}
                onContextMenu={(e) => {
                    e.preventDefault();
                    console.log("aaaa");
                    openTodoMenu(todo); // 右クリックでタブを削除する
                }}
            >


                <div className="todo-info">
                    <div className="todo-title">{todo.title}</div>
                    <div className="todo-date" style={{ color: changeDateColor(todo) }}>{formatDate(todo.date)}</div>
                    <div className="todo-contents">Contents<br /> {todo.contents}</div>
                    <div className='todo-duration'>所要時間 {todo.duration}</div>
                    <div className="todo-deleteButton" onClick={onDelete}>×</div>
                    <div className={`todo-favoriteButton ${isFavoriteClicked ? 'clicked' : ''}`} onClick={addFavorite} onAnimationEnd={handleAnimationEnd}>★</div>
                </div>

            </div>
        </div>
    );

};
export default TodoItem;