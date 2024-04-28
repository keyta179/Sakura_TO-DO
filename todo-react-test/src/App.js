import React, { useState, useEffect, useCallback } from 'react';
import './style/App.css';
import TodoItem from './components/TodoItem';
import NarrowDown from './components/NarrowDown';
import Favorite from './components/Favorite';
import SettingsPopup from './components/SettingPopup';
import { Sidebar } from './components/Sidebar';
import { v4 as uuidv4 } from 'uuid';

import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from './settingsUtils';

function App() {
  const [todo, setTodo] = useState({
    id: uuidv4(),
    title: '',
    category: '',
    contents: '',
    date: '',
    duration: '',
    position: { x: 0, y: 0 },
    hide: false
  });
  let todoWidth = 200;
  let todoHeight = 150;
  const [todos, setTodos] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favoriteTodos, setFavoriteTodos] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [settings, setSettings] = useState({
    bodyWidth: loadSettingsFromLocalStorage().bodyWidth,
    bodyHeight: loadSettingsFromLocalStorage().bodyHeight,
    todoWidth: loadSettingsFromLocalStorage().todoWidth,
    todoHeight: loadSettingsFromLocalStorage().todoHeight
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // 選択されたカテゴリの state
  const [filteredTodos, setFilteredTodos] = useState([]); // フィルタリングされた ToDo の配列

  const loadTodosFromLocalStorage = useCallback(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  const saveTodosToLocalStorage = useCallback((todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, []);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen(prevState => !prevState);
  }, []);

  const openSettingsPopup = useCallback(() => {
    setIsSettingsPopupOpen(true);
  }, []);

  const closeSettingsPopup = useCallback(() => {
    setIsSettingsPopupOpen(false);
  }, []);

  const addFavoriteTodo = useCallback((newFavoriteTodo) => {
    setFavoriteTodos(prevFavoriteTodos => [...prevFavoriteTodos, newFavoriteTodo]);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTodo(prevTodo => ({
      ...prevTodo,
      [name]: value
    }));
  }, []);

  const addTodo = useCallback((e) => {
    e.preventDefault();
    if (!todo.title || !todo.date) return;
    setTodos(prevTodos => [...prevTodos, todo]);
    setTodo({
      id: uuidv4(),
      title: '',
      category: '',
      contents: '',
      date: '',
      duration: '',
      position: { x: 0, y: 0 },
      hide: false
    });
  }, [todo]);

  const deleteTodo = useCallback((deletedTodo) => {
    console.log("deletedTodo");
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== deletedTodo.id));
    
  }, []);

  const clearTodos = useCallback(() => {
    setTodos([]);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prevState => !prevState);
  }, []);

  const getNextAvailableDate = (targetDate, existingDates) => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayIndex = new Date(targetDate).getDay();
    let nextAvailableDate = new Date(targetDate);

    // If the targetDate is today
    if (nextAvailableDate.toDateString() === new Date().toDateString()) {
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 7);
    }
    // If the targetDate is in the past
    else if (nextAvailableDate < new Date()) {
      nextAvailableDate = new Date();
      nextAvailableDate.setDate(nextAvailableDate.getDate() + (7 + targetDayIndex - new Date().getDay()) % 7);
    }

    // Move to the next occurrence of the same weekday that is not in existingDates
    while (existingDates.includes(nextAvailableDate.toISOString())) {
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 7);
    }

    return nextAvailableDate; // 時間情報を保持したまま返す
  };

  useEffect(() => {
    loadTodosFromLocalStorage();
  }, [loadTodosFromLocalStorage]);

  useEffect(() => {
    saveTodosToLocalStorage(todos);
   
  }, [saveTodosToLocalStorage, todos]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('settings'));
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // カテゴリが選択されたときの処理
  useEffect(() => {
    // カテゴリが選択されていない場合はすべての ToDo を表示
    if (selectedCategory === "") {
      setFilteredTodos(todos);
    } else {
      // カテゴリが選択された場合はそのカテゴリに一致する ToDo のみを表示
      const filteredTodos = todos.filter(todo => todo.category === selectedCategory);
      setFilteredTodos(filteredTodos);
    }
  }, [todos, selectedCategory]);

  // console.log(selectedCategory);

  return (
    <div>
      <header>
        <div className='title'>ToDo List</div>
      {isSettingsPopupOpen && (
        <SettingsPopup
          settings={settings}
          setSettings={setSettings}
          closeSettingsPopup={closeSettingsPopup}
        />
      )}
      </header>
      <div className="App"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const newPosition = { x: e.clientX, y: e.clientY };
        const todo = JSON.parse(e.dataTransfer.getData('text/plain'));
        const existingDates = todos.map(todo => todo.date); // Get array of existing dates
        const nextAvailableDate = getNextAvailableDate(todo.date, existingDates); // Calculate next available date
        setTodos(prevTodos => [...prevTodos, { ...todo,id: uuidv4(), date: nextAvailableDate, position: newPosition }]);
      }}
      style={{ width: settings.bodyWidth, height: settings.bodyHeight }}>

    
      <NarrowDown todos={todos} selectedCategory={selectedCategory} setSelectedCategory={selectedCategory} onChange={(category) => setSelectedCategory(category)} /> {/* NarrowDown コンポーネントで選択されたカテゴリを渡す */}
      <button type="button" className={"setting-button"} onClick={openSettingsPopup}>
        Settings
      </button>

      <Sidebar todo={todo} setTodo={setTodo} favoriteTodos={favoriteTodos} setFavoriteTodos={setFavoriteTodos} todos={todos} setTodos={setTodos} />


      {filteredTodos.map((todo, index) => (
        <TodoItem
          key={index}
          index={index}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          todoWidth={settings.todoWidth}
          todoHeight={settings.todoHeight}
          onDelete={() => deleteTodo(todo)}
          onAddFavorite={() => addFavoriteTodo(todo)}
        />
      ))}
    </div>
    </div>
    
  );
}

export default App;
