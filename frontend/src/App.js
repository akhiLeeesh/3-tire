import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:8080/api/tasks');
    setTasks(res.data);
  };

  const createTask = async () => {
    await axios.post('http://localhost:8080/api/tasks', newTask);
    fetchTasks();
    setNewTask({ title: '', description: '' });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task Manager</h1>
      <input placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
      <input placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
      <button onClick={createTask}>Add Task</button>
      <ul>
        {tasks.map((task) => <li key={task._id}>{task.title} - {task.description}</li>)}
      </ul>
    </div>
  );
}

export default App;
