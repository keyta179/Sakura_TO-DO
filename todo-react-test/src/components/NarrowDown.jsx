import React, { useState } from "react";
import './../style/NarrowDown.css'

export const FilterTodosByCategory = ({ todos, category }) => {
  if(category === "all"){
      return todos;
  } else {
      return todos.filter(todo => todo.category === category);
  }
}


const NarrowDown = ({ todos, selectedCategory, setSelectedCategory, onChange }) => {
  // todosからユニークなカテゴリを抽出
  const categories = [...new Set(todos.map(todo => todo.category))];

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    onChange(selectedValue); // 選択したカテゴリを親コンポーネントに渡す
  };

  return (
    <div className={"menu.open"}>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">カテゴリを選択</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NarrowDown;