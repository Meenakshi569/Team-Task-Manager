import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (id === 'new') {
      setLoading(false);
      return;
    }
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectService.getById(id);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskService.getByProject(id);
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to load tasks');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.update(taskId, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      setError('Failed to update task');
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

  if (id === 'new') {
    return <CreateProject />;
  }

  return (
    <div className="container">
      <Link to="/projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '16px', display: 'block' }}>
        ← Back to Projects
      </Link>
      
      {project && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1>{project.name}</h1>
              <p style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
            </div>
            {isAdmin && (
              <Link to={`/projects/${id}/tasks/new`} className="btn btn-primary">
                Add Task
              </Link>
            )}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="task-board">
            <div className="task-column">
              <h3>To Do ({todoTasks.length})</h3>
              {todoTasks.map(task => (
                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
              ))}
            </div>
            
            <div className="task-column">
              <h3>In Progress ({inProgressTasks.length})</h3>
              {inProgressTasks.map(task => (
                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
              ))}
            </div>
            
            <div className="task-column">
              <h3>Done ({doneTasks.length})</h3>
              {doneTasks.map(task => (
                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const TaskCard = ({ task, onStatusChange }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  return (
    <div className="task-item">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <p>Assigned to: {task.assignedTo?.name}</p>
        <p style={{ color: isOverdue ? 'var(--danger)' : 'inherit' }}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        style={{ marginTop: '8px', padding: '4px', borderRadius: '4px' }}
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
};


const CreateProject = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await projectService.create(formData);
      navigate('/projects');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create project');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Create Project</h1>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '500px', marginTop: '20px' }}>
        <div className="form-group">
          <label>Project Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default ProjectDetail;