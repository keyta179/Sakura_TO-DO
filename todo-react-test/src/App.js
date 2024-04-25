// App.js
import React, { useState, useEffect } from 'react';
import './style/App.css';
import TodoItem from './components/TodoItem';
import { Tabs } from './components/CreateTab';
import Favorite from './components/Favorite';
import SettingsPopup from './components/SettingPopup'; // 新しいコンポーネントをインポート
function App() {
  const [todo, setTodo] = useState({
    title: '',
    contents: '',
    date: '',
    duration: '',
    position: { x: 0, y: 0 }
  });
  const [todos, setTodos] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favoriteTodos, setFavoriteTodos] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // 1. マウスの位置を追跡する state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
  const [bodyWidth, setBodyWidth] = useState(800); // ボディの幅
  const [bodyHeight, setBodyHeight] = useState(600); // ボディの高さ

  // ローカルストレージから todos を取得してセットする関数
  const loadTodosFromLocalStorage = () => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  };

  // ローカルストレージに todos を保存する関数
  const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const openSettingsPopup = () => {
    setIsSettingsPopupOpen(true);
  };

  const closeSettingsPopup = () => {
    setIsSettingsPopupOpen(false);
  };

  const addFavoriteTodo = (newFavoriteTodo) => {
    const updatedFavoriteTodo = { ...newFavoriteTodo };
    setFavoriteTodos([...favoriteTodos, updatedFavoriteTodo]);
  };

  useEffect(() => {
    loadTodosFromLocalStorage();
  }, []);

  useEffect(() => {
    saveTodosToLocalStorage(todos);
  }, [todos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodo(prevTodo => ({
      ...prevTodo,
      [name]: value
    }));
  };

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);

    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    if (!todo.title) return;
    setTodos([...todos, todo]);
    setTodo({
      title: '',
      contents: '',
      date: '',
      duration: '',
      position: { x: 0, y: 0 }
    });
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const clearTodos = () => {
    setTodos([]);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const changeBodySize = (width, height) => {
    setBodyWidth(width);
    setBodyHeight(height);
  };

  return (
    <div className="App"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const newPosition = { x: e.clientX, y: e.clientY };
        const todo = JSON.parse(e.dataTransfer.getData('text/plain'));
        setTodos([...todos, { ...todo, position: newPosition }]);
      }}
      style={{ width: bodyWidth, height: bodyHeight }}>

      <h1>ToDo List</h1>
      <Tabs onChange={(tab) => console.log(tab)} />
      <button type="button" className={"setting-button"} onClick={openSettingsPopup}>
        Settings
      </button>

      {isSettingsPopupOpen && (
        <SettingsPopup
          bodyWidth={bodyWidth}
          bodyHeight={bodyHeight}
          changeBodySize={changeBodySize}
          closeSettingsPopup={closeSettingsPopup}
        />
      )}

      <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <button type="button" className={"toggle-button"} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
        <form onSubmit={addTodo}>
          <input value={todo.title} type="text" name="title" onChange={handleChange} placeholder="Title" />
          <input value={todo.contents} type="text" name="contents" onChange={handleChange} placeholder="Contents" />
          <input value={todo.date} type="datetime-local" name="date" onChange={handleChange} />
          <input value={todo.duration} type='time' name="duration" onChange={handleChange} />
          <button type="submit">Add ToDo</button>
        </form>
        {favoriteTodos.length > 0 && (
          <Favorite favoriteTodos={favoriteTodos}
            setFavoriteTodos={setFavoriteTodos}
            onDragStart={(event, todo) => {
              event.dataTransfer.setData('text/plain', JSON.stringify(todo));
              toggleMenu();
            }} />
        )}
      </div>

      {todos.map((todo, index) => (
        <TodoItem
          key={index}
          index={index}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          onDelete={() => deleteTodo(index)}
          onAddFavorite={() => addFavoriteTodo(todo)}
        />
      ))}
    </div>
  );
}

export default App;
