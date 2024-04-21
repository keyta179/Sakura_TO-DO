import React, { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = (e) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    if (!input) return; // 入力が空の場合は追加しない
    setTodos([...todos, input]);
    setInput('');
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((todo, i) => i !== index);
    setTodos(newTodos);
  };

  const clearTodos = () => {
    setTodos([]);
  };

  return (
    <div className="App">
      <h1>ToDo List</h1>
      <form onSubmit={addTodo}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Add ToDo</button>
        <button type="button" onClick={clearTodos}>Clear All ToDos</button>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} onClick={() => deleteTodo(index)}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

