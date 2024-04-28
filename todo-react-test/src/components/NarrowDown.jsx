import React, { useState } from "react";
import './../style/App.css'

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
   
      <select className={"menu-contentstab"} value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Filter</option>
        {categories.map((category, index) => (
          <option  key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    
  );
};

export default NarrowDown;