import React, { useState } from "react";

function TodoForm({ addTodo }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Home");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
      addTodo({
        text,
        category,
      });
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Home">Home</option>
        <option value="Work">Work</option>
        <option value="Study">Study</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
