// src/EditTodo.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTodo } from "./store/todoSlice";

const EditTodo = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Home");
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch todos from API or use a selector
    fetch("http://localhost:5000/api/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const handleEditTodo = () => {
    if (selectedTodo) {
      fetch(`http://localhost:5000/api/todos/${selectedTodo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedTodo, text, category }),
      })
        .then((response) => response.json())
        .then((updatedTodo) => {
          dispatch(updateTodo(updatedTodo));
          setSelectedTodo(null);
          setText("");
          setCategory("Home");
        })
        .catch((error) => console.error("Error updating todo:", error));
    }
  };

  return (
    <div>
      <h2>Edit Todo</h2>
      <select
        onChange={(e) => {
          const selected = todos.find((todo) => todo._id === e.target.value);
          setSelectedTodo(selected);
          setText(selected.text);
          setCategory(selected.category);
        }}
      >
        <option value="">Select Todo</option>
        {todos.map((todo) => (
          <option key={todo._id} value={todo._id}>
            {todo.text}
          </option>
        ))}
      </select>
      {selectedTodo && (
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Study">Study</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={handleEditTodo}>Update Todo</button>
        </div>
      )}
    </div>
  );
};

export default EditTodo;
