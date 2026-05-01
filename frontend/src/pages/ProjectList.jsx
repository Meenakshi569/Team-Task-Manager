import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectService.delete(id);
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete project');
    }
  };

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
        <h1>Projects</h1>
        {isAdmin && (
          <Link to="/projects/new" className="btn btn-primary">
            Create Project
          </Link>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.map(project => (
          <div key={project._id} className="card">
            <h3 style={{ marginBottom: '8px' }}>{project.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {project.description || 'No description'}
            </p>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <p>Created by: {project.createdBy?.name}</p>
              <p>Members: {project.members?.length || 0}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to={`/projects/${project._id}`} className="btn btn-outline">
                View
              </Link>
              {isAdmin && (
                <button onClick={() => handleDelete(project._id)} className="btn btn-danger">
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          No projects found
        </p>
      )}
    </div>
  );
};

export default ProjectList;