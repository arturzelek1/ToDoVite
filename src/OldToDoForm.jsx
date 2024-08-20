//import React, { useState } from "react";
//
//function TodoForm({ addTodo }) {
//  const [value, setValue] = useState("");
//  const [category, setCategory] = useState("");
//  const [categoryError, setCategoryError] = useState("");
//
//  const categories = ["Work", "Home", "Study", "Other"];
//
//  const handleSubmit = (e) => {
//    e.preventDefault();
//    if (!value) return; // If value is empty, do nothing
//
//    if (!category) {
//      setCategoryError("Please select a category."); // Set error message if category is not selected
//      return;
//    }
//
//    addTodo({ text: value, category: category });
//    setValue("");
//    setCategory("");
//    setCategoryError(""); // Clear category error after successful submission
//  };
//
//  return (
//    <div className="inputText">
//      <form onSubmit={handleSubmit}>
//        <input
//          type="text"
//          className="input"
//          value={value}
//          onChange={(e) => setValue(e.target.value)}
//          placeholder="Add Todo..."
//        />
//        <select
//          className="category-select"
//          value={category}
//          onChange={(e) => {
//            setCategory(e.target.value);
//            setCategoryError(""); // Clear category error when a category is selected
//          }}
//        >
//          <option value="">Select Category</option>
//          {categories.map((category, index) => (
//            <option key={index} value={category}>
//              {category}
//            </option>
//          ))}
//        </select>
//        {categoryError && <span className="error">{categoryError}</span>}
//        <button type="submit" className="add-button">
//          Add
//        </button>
//      </form>
//    </div>
//  );
//}
//
//export default TodoForm;
