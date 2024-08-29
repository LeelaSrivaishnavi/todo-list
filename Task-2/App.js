import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App(){
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editing, setEditing] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    axios.get('/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;

    axios.post('/api/tasks', { text: newTask, completed: false })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      })
      .catch(error => console.error(error));
  };

  const deleteTask = (id) => {
    axios.delete(`/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch(error => console.error(error));
  };

  const toggleComplete = (id) => {
    const task = tasks.find(task => task._id === id);
    axios.put(`/api/tasks/${id}`, { completed: !task.completed })
      .then(response => {
        setTasks(tasks.map(task => task._id === id ? response.data : task));
      })
      .catch(error => console.error(error));
  };

  const editTask = (id) => {
    const task = tasks.find(task => task._id === id);
    axios.put(`/api/tasks/${id}`, { text: editingText })
      .then(response => {
        setTasks(tasks.map(task => task._id === id ? response.data : task));
        setEditing(null);
        setEditingText('');
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input 
        type="text" 
        value={newTask} 
        onChange={e => setNewTask(e.target.value)} 
        placeholder="Add a new task..." 
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {editing === task._id ? (
              <input 
                type="text" 
                value={editingText} 
                onChange={e => setEditingText(e.target.value)} 
              />
            ) : (
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </span>
            )}
            <button onClick={() => toggleComplete(task._id)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            {editing === task._id ? (
              <button onClick={() => editTask(task._id)}>Save</button>
            ) : (
              <button onClick={() => { setEditing(task._id); setEditingText(task.text); }}>Edit</button>
            )}
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
