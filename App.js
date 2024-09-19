import React, { useState } from 'react';
import Switch from 'react-switch';
import TaskList from './TaskList';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`App ${theme}`}>
      <label>
        <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
        <Switch
          onChange={toggleTheme}
          checked={theme === 'dark'}
          offColor="#888"
          onColor="#000"
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </label>
      <TaskList />
    </div>
  );
}

export default App;
