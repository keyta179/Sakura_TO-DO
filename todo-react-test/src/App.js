import React, { useState, useEffect, useCallback } from 'react';
import './style/App.css';
import TodoItem from './components/TodoItem';
import NarrowDown from './components/NarrowDown';
import Favorite from './components/Favorite';
import SettingsPopup from './components/SettingPopup';
import { FilterTodosByCategory } from './components/NarrowDown';
import { Sidebar } from './components/Sidebar';

import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from './settingsUtils';

function App() {
  // コンポーネントの定義
  // Todo
  const [todo, setTodo] = useState({
    title: '',
    category: '',
    contents: '',
    date: '',
    duration: '',
    position: { x: 0, y: 0 }
  });
  // Todo の配列
  const [todos, setTodos] = useState([]);
  // お気に入り登録されたTodoの配列
  const [favoriteTodos, setFavoriteTodos] = useState([]);
  // 選択されたcategoryのみのTodoの配列
  const [filteredTodos, setFilteredTodos] = useState([]);
  // 選択されたcategoryの状態
  const [selectedCategory, setSelectedCategory] = useState("all"); 
  // todosに入っているuniqueなcategoryの配列
  const categories = [...new Set(todos.map(todo => todo.category))];
  // 付箋の初期位置
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // 付箋の大きさ初期値
  let todoWidth = 200;
  let todoHeight = 150;
  // 付箋の設定
  const [settings, setSettings] = useState({
    bodyWidth: loadSettingsFromLocalStorage().bodyWidth,
    bodyHeight: loadSettingsFromLocalStorage().bodyHeight,
    todoWidth: loadSettingsFromLocalStorage().todoWidth,
    todoHeight: loadSettingsFromLocalStorage().todoHeight
  });
  // 付箋の設定が開かれているかどうか
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // 付箋のポップアップが開かれているかどうか
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);

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

  

  const deleteTodo = useCallback((index) => {
    setTodos(prevTodos => prevTodos.filter((_, i) => i !== index));
  }, []);

  const clearTodos = useCallback(() => {
    setTodos([]);
  }, []);



// -----

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

  // 選択したcategoryを取得する
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const filtered = FilterTodosByCategory({ todos, category }); // フィルタリングされた配列を取得
    setFilteredTodos(filtered); // フィルタリングされた配列をセット
  };

// -----

  return (
    <div className="App"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const newPosition = { x: e.clientX, y: e.clientY };
        const todo = JSON.parse(e.dataTransfer.getData('text/plain'));
        const existingDates = todos.map(todo => todo.date); // Get array of existing dates
        const nextAvailableDate = getNextAvailableDate(todo.date, existingDates); // Calculate next available date
        setTodos(prevTodos => [...prevTodos, { ...todo, date: nextAvailableDate, position: newPosition }]);
      }}
      style={{ width: settings.bodyWidth, height: settings.bodyHeight }}>

      <h1>ToDo List</h1>
      <button type="button" className={"setting-button"} onClick={openSettingsPopup}>
        Settings
      </button>

      {isSettingsPopupOpen && (
        <SettingsPopup
          settings={settings}
          setSettings={setSettings}
          closeSettingsPopup={closeSettingsPopup}
        />
      )}

      <Sidebar todo={todo} />
      {filteredTodos.map((todo, index) => (
        <TodoItem
          key={index}
          index={index}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          todoWidth={settings.todoWidth}
          todoHeight={settings.todoHeight}
          onDelete={() => deleteTodo(index)}
          onAddFavorite={() => addFavoriteTodo(todo)}
          selectedCategory={selectedCategory}
        />
      ))}

      <div className={"contents-tab"}>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">カテゴリを選択</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
            </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default App;
