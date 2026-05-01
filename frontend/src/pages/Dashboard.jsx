import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await taskService.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
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
      <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <div className="value">{stats?.total || 0}</div>
        </div>
        
        <div className="stat-card completed">
          <h3>Completed</h3>
          <div className="value">{stats?.completed || 0}</div>
        </div>
        
        <div className="stat-card in-progress">
          <h3>In Progress</h3>
          <div className="value">{stats?.inProgress || 0}</div>
        </div>
        
        <div className="stat-card overdue">
          <h3>Overdue</h3>
          <div className="value">{stats?.overdue || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;