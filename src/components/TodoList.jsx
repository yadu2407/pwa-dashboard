import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  Plus,
  Sun,
  Moon,
  ListTodo,
  Calendar
} from 'lucide-react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const savedTodos = localStorage.getItem('pwa-todos');
    if (savedTodos) setTodos(JSON.parse(savedTodos));
  }, []);

  useEffect(() => {
    localStorage.setItem('pwa-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date().toISOString()
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Background */}
      <div className="background">
        <div className="gradient-orb"></div>
        <div className="gradient-orb-2"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <ListTodo size={32} />
            <div>
              <h1>PWA Task Manager</h1>
              <span className="badge">Offline Ready</span>
            </div>
          </div>
          <div className="header-actions">
            <div className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '🟢 Live' : '🔴 Offline'}
            </div>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <ListTodo size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{todos.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <Circle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Active</span>
              <span className="stat-value">{activeCount}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{completedCount}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon progress">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Progress</span>
              <span className="stat-value">
                {todos.length ? Math.round((completedCount / todos.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Add Todo */}
        <div className="add-card">
          <h3>Add New Task </h3>
          <div className="input-group">
            <input
              type="text"
              className="input"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button className="add-button" onClick={addTodo}>
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({todos.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
          {completedCount > 0 && (
            <button className="clear-button" onClick={clearCompleted}>
              <Trash2 size={16} />
              Clear Completed
            </button>
          )}
        </div>

        {/* Todo List */}
        <div className="list-card">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={48} />
              <h3>  All done! 🎉</h3>
              <p>No tasks in {filter} view</p>
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map(todo => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <button className="toggle-btn" onClick={() => toggleTodo(todo.id)}>
                    {todo.completed ? 
                      <CheckCircle size={24} color="#10b981" /> : 
                      <Circle size={24} color="#94a3b8" />
                    }
                  </button>
                  <span className="todo-text">{todo.text}</span>
                  <div className="todo-actions">
                    <span className="todo-date">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>✓ Works offline • Syncs with localStorage • PWA Ready</p>
      </footer>
    </div>
  );
};

export default TodoList;