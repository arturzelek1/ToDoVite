import React, { useState, useEffect, useRef } from "react";
import Todo from "./ToDo";
import TodoForm from "./ToDoForm";
import "./App.css";
import Chart from "chart.js/auto";
import { DatePicker } from "antd";

function App() {
  const [todos, setTodos] = useState([]);
  const [completedCount, setCompletedCount] = useState({
    Home: 0,
    Personal: 0,
    Study: 0,
    Other: 0,
  });

  useEffect(() => {
    // Pobierz zadania z backendu
    fetch("/api/todos")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        const count = data.reduce(
          (acc, todo) => {
            if (todo.isCompleted) acc[todo.category]++;
            return acc;
          },
          { Home: 0, Personal: 0, Study: 0, Other: 0 }
        );
        setCompletedCount(count);
      });
  }, []);

  const addTodo = ({ text, category }) => {
    fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, category }),
    })
      .then((response) => response.json())
      .then((todo) => setTodos([...todos, todo]));
  };

  const completeTodo = (index, category) => {
    const todo = todos[index];
    fetch(`/api/todos/${todo._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...todo, isCompleted: true }),
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        const newTodos = [...todos];
        newTodos[index] = updatedTodo;
        setTodos(newTodos);
        updateCompletedCount(category, 1);
      });
  };

  const undoTodo = (index, category) => {
    const todo = todos[index];
    fetch(`/api/todos/${todo._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...todo, isCompleted: false }),
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        const newTodos = [...todos];
        newTodos[index] = updatedTodo;
        setTodos(newTodos);
        updateCompletedCount(category, -1);
      });
  };

  const removeTodo = (index, category) => {
    const todo = todos[index];
    fetch(`/api/todos/${todo._id}`, {
      method: "DELETE",
    }).then(() => {
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
      updateCompletedCount(category, -1);
    });
  };

  const updateCompletedCount = (category, delta) => {
    setCompletedCount((prevCount) => ({
      ...prevCount,
      [category]: prevCount[category] + delta,
    }));
  };

  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("myChart").getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(completedCount),
        datasets: [
          {
            label: "Completed Tasks",
            data: Object.values(completedCount),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            align: "center",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
  }, [completedCount]);

  return (
    <div className="app">
      <div className="containter-fluid">
        {todos.map((todo, index) => (
          <Todo
            key={index}
            index={index}
            todo={todo}
            completeTodo={() => completeTodo(index, todo.category)}
            undoTodo={() => undoTodo(index, todo.category)}
            removeTodo={() => removeTodo(index, todo.category)}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
      <div className="chart-container">
        <DatePicker />
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>
    </div>
  );
}

export default App;
