import React, { useState } from "react";
import './../style/NarrowDown.css'

const NarrowDown = ({ todos, onChange }) => {
  
  const [selectedCategory, setSelectedCategory] = useState(""); // 選択されたカテゴリを格納するstate

  // todosからユニークなカテゴリを抽出
  const categories = [...new Set(todos.map(todo => todo.category))];


  return (
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
  );
};

export default NarrowDown;