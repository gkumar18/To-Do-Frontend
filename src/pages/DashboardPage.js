import React, { useEffect, useState } from 'react';
import API from '../services/api';

function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({});
    const [formData, setFormData] = useState({
        taskName: '',
        description: '',
        expectedTime: ''
    });
    const [editingTask, setEditingTask] = useState(null);
    const [actualTime, setActualTime] = useState('');


    const fetchTasks = async () => {
        const res = await API.get('/tasks');
        setTasks(res.data);
    };

    const fetchStats = async () => {
        const res = await API.get('/performance');
        setStats(res.data);
    };

    const completeTask = async (taskId) => {
        const input = prompt('Enter actual time taken (in minutes):');
        if (!input) return;

        await API.put(`/tasks/${taskId}/complete`, { actualTime: input });
        fetchTasks();
        fetchStats();
    };

    const deleteTask = async (taskId) => {
        if (window.confirm('Are you sure?')) {
            await API.delete(`/tasks/${taskId}`);
            fetchTasks();
            fetchStats();
        }
    };

    const startEdit = (task) => {
        setEditingTask(task);
        setFormData({
            taskName: task.taskName,
            description: task.description,
            expectedTime: task.expectedTime
        });
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingTask) {
            await API.put(`/tasks/${editingTask._id}`, formData);
            setEditingTask(null);
        } else {
            await API.post('/tasks', formData);
        }

        setFormData({ taskName: '', description: '', expectedTime: '' });
        fetchTasks();
        fetchStats();
    };


    useEffect(() => {
        fetchTasks();
        fetchStats();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="container">
          <h1>📋 Dashboard</h1>
          <button onClick={logout}>Logout</button>
      
          <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
          <form onSubmit={handleSubmit}>
            <input name="taskName" placeholder="Task Name" value={formData.taskName} onChange={handleChange} required />
            <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
            <input name="expectedTime" placeholder="Expected Time (mins)" value={formData.expectedTime} onChange={handleChange} required />
            <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
          </form>
      
          <h2>🗂️ Task List</h2>
          <ul>
            {tasks.map(task => (
              <li key={task._id}>
                <strong>{task.taskName}</strong> — {task.description} — <em>{task.status}</em>
                <br />
                {task.status === 'pending' && (
                  <>
                    <button onClick={() => startEdit(task)}>✏️ Edit</button>
                    <button onClick={() => completeTask(task._id)}>✅ Complete</button>
                  </>
                )}
                <button onClick={() => deleteTask(task._id)}>❌ Delete</button>
              </li>
            ))}
          </ul>
      
          <h2>📊 Performance</h2>
          <p>Total Tasks: {stats.totalTasks || 0}</p>
          <p>Completed: {stats.completedCount || 0}</p>
          <p>Avg Expected Time: {stats.averageExpected || 0} min</p>
          <p>Avg Actual Time: {stats.averageActual || 0} min</p>
          <p>Time Difference: {stats.timeDifference || 0} min ({stats.feedback})</p>
        </div>
      );
      
}

export default DashboardPage;
