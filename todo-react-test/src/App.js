// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import TodoItem from './TodoItem';

function App() {
  const [todo, setTodo] = useState({
    title: '',
    contents: '',
    date: '',
    duration: '',
    position: { x: 0, y: 0 }
  });
  const [todos, setTodos] = useState([]);

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

  const addTodo = (e) => {
    e.preventDefault();
    if (!todo.title ) return;
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

  return (
    <div className="App">
      <h1>ToDo List</h1>

      <form onSubmit={addTodo}>
        <input value={todo.title} type="text" name="title" onChange={handleChange} placeholder="Title" />
        <input value={todo.contents} type="text" name="contents" onChange={handleChange} placeholder="Contents" />
        <input value={todo.date} type="datetime-local" name="date" onChange={handleChange} />
        <input value={todo.duration} type='time' name="duration" onChange={handleChange} />
        <button type="submit">Add ToDo</button>
        <button type="button" onClick={clearTodos}>Clear All ToDos</button>
      </form>

      {todos.map((todo, index) => (
        <TodoItem 
          key={index} 
          index={index}
          todo={todo} 
          todos={todos}
          setTodos={setTodos}
          onDelete={() => deleteTodo(index)} 
        />
      ))}
    </div>
  );
}

export default App;
