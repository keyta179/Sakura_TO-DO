// App.js
import React, { useState } from 'react';
import './App.css';
import TodoItem from './TodoItem';

function App() {
  const [todo, setTodo] = useState({
    title: '',
    contents: '',
    date: '',
    duration:''
  });
  const [todos, setTodos] = useState([]);

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
      date: ''
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
        <input value={todo.duration} type='time'name="duration"onChange={handleChange}/>
        <button type="submit">Add ToDo</button>
        <button type="button" onClick={clearTodos}>Clear All ToDos</button>
      </form>

      {todos.map((todo, index) => (
        <TodoItem 
          key={index} 
          index={index}
          todo={todo} 
          onDelete={() => deleteTodo(index)} 
           
        />
      ))}
    </div>
  );
}

export default App;
