import React, { useState, useReducer } from "react";
import "./App.css";

const initialState = {
  tasks: [],
  newTask: { title: "", dueDate: "", priority: "Low" },
  searchTerm: "",
};

function taskReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      if (!action.payload.title || !action.payload.dueDate) {
        alert("Title and due date are required");
        return state;
      }
      if (state.tasks.some((task) => task.title === action.payload.title)) {
        alert("Task title must be unique");
        return state;
      }
      if (new Date(action.payload.dueDate) < new Date()) {
        alert("Due date must be today or in the future");
        return state;
      }
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((_, i) => i !== action.index),
      };

    case "EDIT_TASK":
      const updatedTasks = state.tasks.map((task, index) =>
        index === action.index ? action.payload : task
      );
      return { ...state, tasks: updatedTasks };

    case "TOGGLE_COMPLETE":
      const toggledTasks = state.tasks.map((task, index) =>
        index === action.index ? { ...task, completed: !task.completed } : task
      );
      return { ...state, tasks: toggledTasks };

    case "SET_NEW_TASK":
      return { ...state, newTask: { ...state.newTask, ...action.payload } };

    case "SET_SEARCH_QUERY":
      return { ...state, searchTerm: action.payload };

    default:
      return state;
  }
}

function TaskList() {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const addTask = () => {
    const newTask = { ...state.newTask, completed: false };
    dispatch({ type: "ADD_TASK", payload: newTask });
  };

  const editTask = (index) => {
    const task = state.tasks[index];
    dispatch({ type: "SET_NEW_TASK", payload: task });
    setIsEditing(true);
    setCurrentTaskIndex(index);
  };

  const updateTask = () => {
    const updatedTask = {
      ...state.newTask,
      completed: state.tasks[currentTaskIndex].completed,
    };
    dispatch({
      type: "EDIT_TASK",
      payload: updatedTask,
      index: currentTaskIndex,
    });
    setIsEditing(false);
    setCurrentTaskIndex(null);
  };

  const filteredTasks = state.tasks.filter((task) =>
    task.title.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`App ${isDarkMode ? "dark" : ""}`}>
      <header className="header">
        <h1>Task Manager</h1>
        <input
          type="text"
          placeholder="Search Tasks"
          value={state.searchTerm}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })
          }
        />
      </header>

      <div className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={state.newTask.title}
          onChange={(e) =>
            dispatch({
              type: "SET_NEW_TASK",
              payload: { title: e.target.value },
            })
          }
        />
        <input
          type="date"
          value={state.newTask.dueDate}
          onChange={(e) =>
            dispatch({
              type: "SET_NEW_TASK",
              payload: { dueDate: e.target.value },
            })
          }
        />
        <select
          value={state.newTask.priority}
          onChange={(e) =>
            dispatch({
              type: "SET_NEW_TASK",
              payload: { priority: e.target.value },
            })
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {!isEditing ? (
          <button onClick={addTask}>Add Task</button>
        ) : (
          <button onClick={updateTask}>Update Task</button>
        )}
      </div>

      <ul className="task-list">
        {filteredTasks.map((task, index) => (
          <li key={index}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title} - {task.dueDate} - {task.priority}
            </span>
            <button
              onClick={() => dispatch({ type: "TOGGLE_COMPLETE", index })}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => editTask(index)}>Edit</button>
            <button onClick={() => dispatch({ type: "DELETE_TASK", index })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
