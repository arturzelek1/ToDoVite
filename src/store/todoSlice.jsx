import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    completedCount: {
      Home: 0,
      Work: 0,
      Study: 0,
      Other: 0,
    },
  },
  reducers: {
    setTodos(state, action) {
      state.items = action.payload;
    },
    addTodo(state, action) {
      state.items.push(action.payload);
    },
    updateTodo(state, action) {
      const index = state.items.findIndex(
        (todo) => todo._id === action.payload._id
      );
      if (index !== -1) {
        // Sprawdzamy, czy zadanie jest już ukończone
        if (state.items[index].isCompleted && action.payload.isCompleted) {
          return; // Nie aktualizuj zadania, jeśli jest już ukończone
        }
        state.items[index] = action.payload;
      }
    },
    deleteTodo(state, action) {
      state.items = state.items.filter((todo) => todo._id !== action.payload);
    },
    setCompletedCount(state, action) {
      state.completedCount = action.payload;
    },
  },
});

export const { setTodos, addTodo, updateTodo, deleteTodo, setCompletedCount } =
  todoSlice.actions;

export default todoSlice.reducer;
