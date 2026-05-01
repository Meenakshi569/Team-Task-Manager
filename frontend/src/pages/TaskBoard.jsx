import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await taskService.update(taskId, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? response.data : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Task Board</h1>
        {isAdmin && (
          <Link to="/tasks/new" className="btn btn-primary">
            Create Task
          </Link>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="task-board">
        <div className="task-column">
          <h3>To Do ({todoTasks.length})</h3>
          {todoTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
        
        <div className="task-column">
          <h3>In Progress ({inProgressTasks.length})</h3>
          {inProgressTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
        
        <div className="task-column">
          <h3>Done ({doneTasks.length})</h3>
          {doneTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onStatusChange, onDelete, isAdmin }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  return (
    <div className="task-item">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <p>Project: {task.project?.name}</p>
        <p>Assigned to: {task.assignedTo?.name}</p>
        <p style={{ color: isOverdue ? 'var(--danger)' : 'inherit' }}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          style={{ padding: '4px', borderRadius: '4px', flex: '1' }}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        {isAdmin && (
          <button onClick={() => onDelete(task._id)} className="btn btn-danger" style={{ padding: '4px 8px' }}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;