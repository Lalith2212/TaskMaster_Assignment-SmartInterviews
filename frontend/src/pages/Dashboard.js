import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const StatCard = ({ label, value, color }) => (
  <div className="stat-card card">
    <div className="stat-indicator" style={{ background: color }} />
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.get()
      .then(res => setAnalytics(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dashboard-loading">
      <div className="spinner" />
    </div>
  );

  const statusData = analytics ? [
    { name: 'To Do', value: analytics.pending, color: '#64748b' },
    { name: 'In Progress', value: analytics.inProgress, color: '#2563eb' },
    { name: 'Done', value: analytics.completed, color: '#16a34a' }
  ] : [];

  const priorityData = analytics ? [
    { name: 'High', value: analytics.byPriority?.high || 0, fill: '#dc2626' },
    { name: 'Medium', value: analytics.byPriority?.medium || 0, fill: '#d97706' },
    { name: 'Low', value: analytics.byPriority?.low || 0, fill: '#16a34a' }
  ] : [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Good {getGreeting()}, {user?.name?.split(' ')[0]}.</h1>
          <p>Here is an overview of your tasks.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Tasks" value={analytics?.total ?? 0} color="#2563eb" />
        <StatCard label="Completed" value={analytics?.completed ?? 0} color="#16a34a" />
        <StatCard label="In Progress" value={analytics?.inProgress ?? 0} color="#2563eb" />
        <StatCard label="Pending" value={analytics?.pending ?? 0} color="#d97706" />
        <StatCard label="Overdue" value={analytics?.overdue ?? 0} color="#dc2626" />
        <StatCard label="This Week" value={analytics?.recentTasks ?? 0} color="#7c3aed" />
      </div>

      {analytics?.total > 0 && (
        <div className="card completion-card">
          <div className="completion-header">
            <span>Overall Completion</span>
            <span className="completion-pct">{analytics.completionPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${analytics.completionPercentage}%` }} />
          </div>
        </div>
      )}

      {analytics?.total > 0 ? (
        <div className="charts-grid">
          <div className="card chart-card">
            <h3>Tasks by Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [val, name]}
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    color: 'var(--text)',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {statusData.map((d, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-dot" style={{ background: d.color }} />
                  <span>{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card chart-card">
            <h3>Tasks by Priority</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={priorityData} barSize={36}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    color: 'var(--text)',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="card empty-state">
          <h3>No data available</h3>
          <p>Navigate to <strong>My Tasks</strong> and create your first task to see analytics here.</p>
        </div>
      )}
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
};
export default Dashboard;
