import React, { useState, useEffect } from 'react';
import './style/App.css';
import TodoItem from './components/TodoItem';
import { Tabs } from './components/CreateTab';
import Favorite from './components/Favorite';

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

  const addFavoriteTodo = (newFavoriteTodo) => {
    // 新しいオブジェクトを作成し、favoriteTodo の値をコピーする
    const updatedFavoriteTodo = { ...newFavoriteTodo };
    // 新しいオブジェクトを favoriteTodos に追加する
    setFavoriteTodos([...favoriteTodos, updatedFavoriteTodo]);
  };
  
  

  useEffect(() => {
    loadTodosFromLocalStorage(); // コンポーネントがマウントされたときにローカルストレージから読み込み
  }, []);

  useEffect(() => {
    saveTodosToLocalStorage(todos); // todos が変更されるたびにローカルストレージに保存
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

  return (
    <div className="App"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const newPosition = { x: e.clientX, y: e.clientY };
        const todo = JSON.parse(e.dataTransfer.getData('text/plain'));
        setTodos([...todos, { ...todo, position: newPosition }]);
      }}>

      <h1>ToDo List</h1>
      <Tabs onChange={(tab) => console.log(tab)} />

      <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
        {/* メニューの中身 */}
        <button type="button" className={"toggle-button"} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>

        {/* ここにメニューの内容を追加 */}
        <form onSubmit={addTodo}>
          <input value={todo.title} type="text" name="title" onChange={handleChange} placeholder="Title" />
          <input value={todo.contents} type="text" name="contents" onChange={handleChange} placeholder="Contents" />
          <input value={todo.date} type="datetime-local" name="date" onChange={handleChange} />
          <input value={todo.duration} type='time' name="duration" onChange={handleChange} />
          <button type="submit">Add ToDo</button>
          {/* <button type="button" onClick={clearTodos}>Clear All ToDos</button> */}
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
