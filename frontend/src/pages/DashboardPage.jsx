import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI, authAPI } from '../services/api';
import { useAuth } from '../services/useAuth';
import './Dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      await authAPI.getCurrentUser();

      const projectsRes = await projectAPI.getProjects();
      setProjects(projectsRes.data.projects || []);

      const tasksRes = await taskAPI.getTasks();
      const allTasks = tasksRes.data.tasks || [];
      setTasks(allTasks);

      const completed = allTasks.filter(t => t.status === 'Completed').length;
      const overdue = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

      setStats({
        total: allTasks.length,
        completed,
        inProgress: allTasks.filter(t => t.status === 'In Progress').length,
        overdue
      });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Your session expired. Please log in again.');
        logout();
        navigate('/login');
        return;
      }

      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">Ethara</div>
          <div className="navbar-menu">
            <a href="/projects">Projects</a>
            <a href="/dashboard">Dashboard</a>
          </div>
          <div className="navbar-user">
            <span>{user?.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <h1 className="page-title">Dashboard</h1>
        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#10b981' }}>{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#ef4444' }}>{stats.overdue}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>

            <div className="dashboard-grid">
              <section className="dashboard-section">
                <h2>Recent Projects</h2>
                <div className="projects-list">
                  {projects.length === 0 ? (
                    <p className="empty-state">No projects yet. <a href="/projects">Create one</a></p>
                  ) : (
                    projects.slice(0, 5).map(project => (
                      <div key={project._id} className="project-item">
                        <div>
                          <h4>{project.name}</h4>
                          <p className="project-meta">{project.members.length} members</p>
                        </div>
                        <button 
                          className="btn btn-outline"
                          onClick={() => navigate(`/projects/${project._id}`)}
                        >
                          View
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="dashboard-section">
                <h2>Recent Tasks</h2>
                <div className="tasks-list">
                  {tasks.length === 0 ? (
                    <p className="empty-state">No tasks assigned yet</p>
                  ) : (
                    tasks.slice(0, 5).map(task => (
                      <div key={task._id} className="task-item">
                        <div className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </div>
                        <div>
                          <h4>{task.title}</h4>
                          <p className="task-meta">{task.project?.name || 'Unknown Project'}</p>
                        </div>
                        <span className="status-badge">{task.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
