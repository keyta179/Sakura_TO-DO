import React, { useState } from "react";
import './../style/CreateTab.css'

export const Tabs = ({ onChange }) => {
  const [contents, setContents] = useState([
    { text: "Tab1", path: "/tab1" },
  ]);
  const [tab, setTab] = useState(0);

  // 新しいタブを追加する関数
  const addTab = () => {
    const newTab = {
      text: `Tab${contents.length + 1}`,
      path: `/tab${contents.length + 1}`,
    };
    setContents([...contents, newTab]);
    setTab(contents.length); // 新しいタブが追加されたらそのタブを選択する
    onChange(tab);
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
      <div className={"contents-tab-button-wrapper"}>
        {contents.map((content, index) => (
          <div
            key={index}
            onClick={() => {
              setTab(index);
              onChange(index); // タブがクリックされたときにonChangeを呼び出す
            }}
            onContextMenu={(e) => {
              e.preventDefault(); // デフォルトの右クリックメニューを無効にする
              removeTab(index); // 右クリックでタブを削除する
            }}
            className={
              index === tab
                ? "contents-tab-button-selected"
                : "contents-tab-button"
            }
          >
            {content.text}
          </div>
        ))}
      </div>

      <div className={"contents-tab-underline"} />
      <button onClick={addTab} className="add-tab-button">Add Tab</button> {/* 新しいタブを追加するボタン */}
    </div>
  );
};
