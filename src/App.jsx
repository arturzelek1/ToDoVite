import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  setCompletedCount,
} from "./store/todoSlice";
import Todo from "./Todo";
import TodoForm from "./TodoForm";
import Chart from "chart.js/auto";
import { DatePicker } from "antd";
import "./App.css";
import MonthlyTasksChart from "./MonthlyTasksChart";
import EditTodo from "./EditTodo";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);
  const completedCount = useSelector((state) => state.todos.completedCount);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setTodos(data));
        const count = data.reduce(
          (acc, todo) => {
            if (todo.isCompleted) acc[todo.category]++;
            return acc;
          },
          { Home: 0, Work: 0, Study: 0, Other: 0 }
        );
        dispatch(setCompletedCount(count));
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }, [dispatch]);

  const handleAddTodo = ({ text, category }) => {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, category }),
    })
      .then((response) => response.json())
      .then((todo) => dispatch(addTodo(todo)))
      .catch((error) => console.error("Error adding todo:", error));
  };

  const handleCompleteTodo = (index, category) => {
    const todo = todos[index];
    if (!todo.isCompleted) {
      fetch(`${API_URL}/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, isCompleted: true }),
      })
        .then((response) => response.json())
        .then((updatedTodo) => {
          dispatch(updateTodo(updatedTodo));
          updateCompletedCount(category, 1);
        })
        .catch((error) => console.error("Error completing todo:", error));
    }
  };

  const handleUndoTodo = (index, category) => {
    const todo = todos[index];
    if (todo.isCompleted) {
      fetch(`${API_URL}/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, isCompleted: false }),
      })
        .then((response) => response.json())
        .then((updatedTodo) => {
          dispatch(updateTodo(updatedTodo));
          updateCompletedCount(category, -1);
        })
        .catch((error) => console.error("Error undoing todo:", error));
    }
  };

  const handleRemoveTodo = (index, category) => {
    const todo = todos[index];
    fetch(`${API_URL}/${todo._id}`, {
      method: "DELETE",
    })
      .then(() => {
        dispatch(deleteTodo(todo._id));
        updateCompletedCount(category, -1);
      })
      .catch((error) => console.error("Error removing todo:", error));
  };

  const updateCompletedCount = (category, delta) => {
    dispatch(
      setCompletedCount({
        ...completedCount,
        [category]: completedCount[category] + delta,
      })
    );
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
    <Router>
      <div className="app">
        <navbar>
          <Link to="/">Home</Link>
          <Link to="/monthly-tasks">Monthly Tasks Chart</Link>
          <Link to="/edit-todo">Edit Todo</Link>
        </navbar>
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {todos.map((todo, index) => (
                    <Todo
                      key={index}
                      index={index}
                      todo={todo}
                      completeTodo={() =>
                        handleCompleteTodo(index, todo.category)
                      }
                      undoTodo={() => handleUndoTodo(index, todo.category)}
                      removeTodo={() => handleRemoveTodo(index, todo.category)}
                    />
                  ))}
                  <TodoForm addTodo={handleAddTodo} />
                  <div className="chart-container">
                    <DatePicker />
                    <canvas id="myChart" width="600" height="400"></canvas>
                  </div>
                </div>
              }
            />
            <Route path="/monthly-tasks" element={<MonthlyTasksChart />} />
            <Route path="/edit-todo" element={<EditTodo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
