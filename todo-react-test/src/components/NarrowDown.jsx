import React, { useState } from "react";
import './../style/NarrowDown.css'

export const FilterTodosByCategory = ({ todos, category }) => {
  if(category === "all"){
      return todos;
  } else {
      return todos.filter(todo => todo.category === category);
  }
}


// export const NarrowDown = ({ todos, onChange }) => {
  
//   const handleChange = (e) => {
//     const category = e.target.value;
//     setSelectedCategory(category);
//     onChange(category); // 選択されたカテゴリを親コンポーネントに渡す
//   };

//   return selectedCategory;
// };

// export default NarrowDown;