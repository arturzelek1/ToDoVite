import React, { useState, FormEvent, ChangeEvent } from "react";

// Definiujemy interfejs dla propów komponentu `TodoForm`
interface TodoFormProps {
  addTodo: (todo: { text: string; category: string }) => void;
}

function TodoForm({ addTodo }: TodoFormProps) {
  const [value, setValue] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categoryError, setCategoryError] = useState<string>("");

  const categories = ["Work", "Home", "Study", "Other"];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return; // Jeśli wartość jest pusta, nie rób nic

    if (!category) {
      setCategoryError("Please select a category."); // Ustaw komunikat o błędzie, jeśli nie wybrano kategorii
      return;
    }

    addTodo({ text: value, category: category });
    setValue("");
    setCategory("");
    setCategoryError(""); // Wyczyść błąd kategorii po udanym dodaniu
  };

  return (
    <div className="inputText">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          placeholder="Add Todo..."
        />
        <select
          className="category-select"
          value={category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setCategory(e.target.value);
            setCategoryError(""); // Wyczyść błąd kategorii po wybraniu nowej kategorii
          }}
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        {categoryError && <span className="error">{categoryError}</span>}
        <button type="submit" className="add-button">
          Add
        </button>
      </form>
    </div>
  );
}

export default TodoForm;
