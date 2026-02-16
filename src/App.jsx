import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [online, setOnline] = useState(navigator.onLine);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, done: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header>
        <h1>📱 PWA Demo</h1>
        <div className="status">
          <span className={`badge ${online ? 'online' : 'offline'}`}>
            {online ? '🟢 Online' : '🔴 Offline'}
          </span>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main>
        <div className="add-task">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a task..."
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <div className="stats">
          <div>Total: {todos.length}</div>
          <div>Done: {todos.filter(t => t.done).length}</div>
        </div>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={todo.done ? 'done' : ''}>
              <span onClick={() => toggleTodo(todo.id)}>
                {todo.done ? '✅' : '◻️'} {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="empty">✨ Add your first task!</p>
        )}
      </main>

      <footer>
        <p>PWA • Works Offline • Installable</p>
      </footer>
    </div>
  );
}

export default App;