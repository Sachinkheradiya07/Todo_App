import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "../App.css";

export default function TodoApp() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  const url = "https://jsonplaceholder.typicode.com/todos?_limit=10";
  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(url);
        const fetchedTodos = res.data.map((todo) => ({
          task: todo.title,
          id: uuidv4(),
          completed: false,
        }));
        setTodos(fetchedTodos);
      } catch (error) {
        console.error(error);
      }
    }
    getData();
  }, []);

  const addInput = (e) => {
    setInput(e.target.value);
  };

  const Add = () => {
    if (input.trim() === "") {
      setError("Task cannot be empty!");
      return;
    }
    const newTask = { task: input, id: uuidv4(), completed: false };
    setTodos([...todos, newTask]);
    setInput("");
    setError("");
  };

  const deleteItem = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (id) => {
    setIsEditing(id);
    setEditInput(taskEdit.task);
  };

  const saveEdit = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task: editInput } : todo
    );
    setTodos(updatedTodos);
    setIsEditing(null);
    setEditInput("");
  };

  const markAsDone = (id) => {
    const taskDone = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: true };
      }
      return todo;
    });
    setTodos(taskDone);
  };

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const getFilteredTodos = () => {
    if (filter === "Completed") {
      return todos.filter((todo) => todo.completed);
    }
    if (filter === "Pending") {
      return todos.filter((todo) => !todo.completed);
    }
    return todos;
  };

  return (
    <>
      <h2>TodoApp</h2>
      <input
        type="text"
        value={input}
        onChange={addInput}
        placeholder="Enter a new task"
      />
      <button onClick={Add}>Add Task</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <button onClick={() => handleFilterChange("All")}>All</button>
        <button onClick={() => handleFilterChange("Completed")}>
          Completed
        </button>
        <button onClick={() => handleFilterChange("Pending")}>Pending</button>
      </div>
      <ul>
        {getFilteredTodos().map((todo) => (
          <li key={todo.id}>
            {isEditing === todo.id ? (
              <>
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  placeholder="Edit task"
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
              </>
            ) : (
              <>
                <span
                  style={
                    todo.completed ? { textDecorationLine: "line-through" } : {}
                  }
                >
                  <h3> {todo.task} </h3>
                </span>
                <button onClick={() => deleteItem(todo.id)}>Delete</button>
                <button onClick={() => startEditing(todo.id)}>Edit</button>
                <button onClick={() => markAsDone(todo.id)}>
                  Mark AS Done
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
