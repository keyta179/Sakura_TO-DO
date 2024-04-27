import React, { useState } from "react";
import './../style/CreateTab.css'

export const Tabs = ({ todos, onChange }) => {
  const [contents, setContents] = useState([
    { text: "all", path: "/all" },
  ]);
  const [tab, setTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(""); // 選択されたカテゴリを格納するstate

  // todosからユニークなカテゴリを抽出
  const categories = [...new Set(todos.map(todo => todo.category))];

  // 新しいタブを追加する関数
  const addTab = () => {
    if (selectedCategory) { // 選択されたカテゴリがある場合のみタブを追加
      const newTab = {
        text: selectedCategory, // カテゴリ名をタブのテキストとする
        path: `/${selectedCategory.toLowerCase()}`, // カテゴリ名を小文字化してパスにする
      };
      setContents([...contents, newTab]);
      setTab(contents.length); // 新しいタブが追加されたらそのタブを選択する
      onChange(tab);
    }
  };

  // タブを削除する関数
  const removeTab = (indexToRemove) => {
    const confirmation = window.confirm("このタブを削除しますか？"); // 確認ダイアログを表示
    if (confirmation) {
      setContents(contents.filter((_, index) => index !== indexToRemove));
      if (tab === indexToRemove) {
        setTab(0); // 削除されたタブが選択されていた場合、最初のタブを選択する
        onChange(0); // インデックスを変更
      } else if (tab > indexToRemove) {
        setTab(tab - 1); // 削除されたタブより後のタブが選択されていた場合、選択されたタブのインデックスを更新する
        onChange(tab - 1); // インデックスを変更
      }
    }
  };

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
