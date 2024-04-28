import React, { useState, useEffect, useCallback } from 'react';
import './../style/TodoItem.css';

const TodoItem = ({ index,todo, todos, setTodo, setTodos, todoWidth, todoHeight, onDelete, onAddFavorite }) => {
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
        setTimeout(() => {
         setShow(true); // Set show to true initially
        }, 100);
        
        return;
    }, [todo]);

    const changeDateColor = (todo) => {
        const todoDate = new Date(todo.date);
        const currentDate = new Date();
        const timeDiff = todoDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // 各日付の背景色を定義
        const colors = {
            '-1': '#ff2b2b',   // 当日及び当日より前
            '0': '#ff2b2b',    // 当日及び当日より前
            '1': '#ff8080',    // 二日前
            '2': '#ffd5d5',    // 三日前
            '3': '#e9e9e9',    // 四日前及びそれ以上
        };

        // daysDiffが0未満の場合はすべて当日と同じ色に設定
        const colorIndex = daysDiff < 0 ? 0 : Math.min(daysDiff, 3);

        return colors[colorIndex.toString()];
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]; // 曜日を取得
        return `${year}/ ${month}/ ${day}/ (${weekday}) ${hours}:${minutes}`;
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
    function convertNewlinesToBr(text) {
        // 改行文字を <br> タグに変換して返す
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                {index !== text.split('\n').length - 1 && <br />}
            </span>
        ));
    }
    const onDeleteWait = () => {
        todo.hide = true; // hideをtrueに設定
    };
    useEffect(() => {
        console.log(`todo-item ${todo.hide ? 'hide' : show ? 'show' : ''}`);
        if (!todo.hide) return;
        
        setTimeout(() => {
            console.log(`todo-item ${todo.hide ? 'hide' : show ? 'show' : ''}`);
            onDelete(todo);
            
        }, 3000);
        
    }, [todo.hide]);
    
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
                    backgroundColor: changeDateColor(todo), // 背景色を設定
                    width: todoWidth,
                    height: todoHeight,
                }}
                className={`todo-item ${todo.hide ? 'hide' : show ? 'show' : ''}`}
                
                onMouseDown={handleDragStart}
                onContextMenu={(e) => {
                    e.preventDefault();
                    openTodoMenu(todo);
                }}
            >
                <div className="todo-info">
                    <div className="todo-title">{todo.title}:{todo.category}</div>
                    <div className="todo-date">{formatDate(todo.date)}   </div>
                    <div className="todo-duration">所要時間 {todo.duration}</div>
                    <div style={{
                    height: todoHeight - 60,
                }}className="todo-contents"> {convertNewlinesToBr(todo.contents)}</div>
                    
                    <div className="todo-deleteButton" onClick={onDeleteWait}>×</div>
                    <div className={`todo-favoriteButton ${isFavoriteClicked ? 'clicked' : ''}`} onClick={addFavorite} onAnimationEnd={handleAnimationEnd}>★</div>
                </div>
            </div>
        </div>
    );

};
export default TodoItem;