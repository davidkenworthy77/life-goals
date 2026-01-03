import React, { useState } from 'react';
import { Home, Car, Plane, Heart, Briefcase, Plus, TrendingUp, AlertCircle, CheckCircle2, Clock, ChevronDown, ChevronRight, Check, Trash2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Goal } from '../types';
import { calculateGoalHealth, calculateTimeProgress } from '../utils/goalUtils';
import './Dashboard.css';

interface DashboardProps {
    goals: Goal[];
    onAddGoal: (template?: Partial<Goal>) => void;
    onEditGoal: (goal: Goal) => void;
    onToggleComplete: (id: string) => void;
    onResetData: () => void;
    onLoadSampleData: () => void;
}

const TEMPLATES = [
    { title: 'Buy a House', icon: <Home size={20} />, color: '#6366f1', durationMonths: 60 },
    { title: 'Buy a Car', icon: <Car size={20} />, color: '#ec4899', durationMonths: 36 },
    { title: 'Dream Vacation', icon: <Plane size={20} />, color: '#10b981', durationMonths: 12 },
    { title: 'Health & Fitness', icon: <Heart size={20} />, color: '#ef4444', durationMonths: 6 },
    { title: 'Career Growth', icon: <Briefcase size={20} />, color: '#f59e0b', durationMonths: 24 },
];

const Dashboard: React.FC<DashboardProps> = ({ goals, onAddGoal, onEditGoal, onToggleComplete, onResetData, onLoadSampleData }) => {
    const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});

    const rootGoals = goals.filter(g => !g.parentId && !g.completed);
    const completedGoals = goals.filter(g => g.completed);

    // Statistics calculation
    const stats = {
        total: goals.length,
        onTrack: goals.filter(g => !g.completed && calculateGoalHealth(g).status === 'on-track').length,
        atRisk: goals.filter(g => !g.completed && calculateGoalHealth(g).status === 'at-risk').length,
        completed: completedGoals.length
    };

    const handleTemplateClick = (template: typeof TEMPLATES[0]) => {
        const start = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + template.durationMonths);

        onAddGoal({
            title: template.title,
            color: template.color,
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            progress: 0
        });
    };

    const toggleExpand = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setExpandedGoals(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleComplete = (e: React.MouseEvent, goal: Goal) => {
        e.stopPropagation();
        if (!goal.completed) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: [goal.color, '#ffffff', '#6366f1']
            });
        }
        onToggleComplete(goal.id);
    };

    const renderGoalCard = (goal: Goal, isSubGoal = false) => {
        const timeProgress = calculateTimeProgress(goal.startDate, goal.endDate);
        const health = calculateGoalHealth(goal);
        const subGoals = goals.filter(g => g.parentId === goal.id && !g.completed);
        const isExpanded = expandedGoals[goal.id];

        return (
            <div key={goal.id} className={`goal-card-wrapper ${isSubGoal ? 'sub-goal-wrapper' : ''} ${goal.completed ? 'completed' : ''}`}>
                <div className={`goal-card glass ${isSubGoal ? 'sub-goal' : ''}`} onClick={() => onEditGoal(goal)}>
                    <div className="goal-card-header">
                        <div className="goal-card-title">
                            {!isSubGoal && subGoals.length > 0 && (
                                <button className="expand-btn" onClick={(e) => toggleExpand(e, goal.id)}>
                                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                            )}
                            <div className="color-indicator" style={{ backgroundColor: goal.color }} />
                            <h3>{goal.title}</h3>
                        </div>
                        <div className="header-actions">
                            {health.status !== 'not-started' && health.status !== 'completed' && (
                                <div className="health-badge" style={{ backgroundColor: `${health.color}20`, color: health.color }}>
                                    {health.status === 'on-track' && <CheckCircle2 size={14} />}
                                    {health.status === 'behind' && <Clock size={14} />}
                                    {health.status === 'at-risk' && <AlertCircle size={14} />}
                                    <span>{health.label}</span>
                                </div>
                            )}
                            <button
                                className={`complete-btn ${goal.completed ? 'active' : ''}`}
                                onClick={(e) => handleComplete(e, goal)}
                                title={goal.completed ? "Mark as Active" : "Mark as Completed"}
                            >
                                <Check size={18} />
                            </button>
                        </div>
                    </div>

                    {!goal.completed && (
                        <>
                            <div className="progress-section">
                                <div className="progress-label">
                                    <span>Completion</span>
                                    <span className="progress-value">{goal.progress}%</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: `${goal.progress}%`, backgroundColor: goal.color }} />
                                </div>
                            </div>

                            <div className="progress-section">
                                <div className="progress-label">
                                    <span>Time Elapsed</span>
                                    <span className="progress-value">{timeProgress}%</span>
                                </div>
                                <div className="progress-bar-container time-bar">
                                    <div className="progress-bar" style={{ width: `${timeProgress}%` }} />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="goal-card-footer">
                        <span className="date-range">
                            {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {isExpanded && subGoals.length > 0 && (
                    <div className="sub-goals-container">
                        {subGoals.map(subGoal => renderGoalCard(subGoal, true))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            <section className="stats-overview">
                <div className="stat-card glass">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Goals</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <CheckCircle2 size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">On Track</span>
                        <span className="stat-value">{stats.onTrack}</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <AlertCircle size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">At Risk</span>
                        <span className="stat-value">{stats.atRisk}</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <Briefcase size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{stats.completed}</span>
                    </div>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2>🚀 Active Goals</h2>
                </div>
                <div className="goal-cards-grid">
                    {rootGoals.length === 0 ? (
                        <div className="empty-state glass">
                            <TrendingUp size={48} className="empty-icon" />
                            <h3>No active goals</h3>
                            <p>All goals completed? Great job! Or start something new.</p>
                        </div>
                    ) : (
                        rootGoals.map(goal => renderGoalCard(goal))
                    )}
                </div>
            </section>

            {completedGoals.length > 0 && (
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>🏆 Completed Goals</h2>
                    </div>
                    <div className="goal-cards-grid completed-grid">
                        {completedGoals.map(goal => renderGoalCard(goal))}
                    </div>
                </section>
            )}

            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Quick Start</h2>
                    <button className="btn-primary" onClick={() => onAddGoal()}>
                        <Plus size={18} />
                        <span>Custom Goal</span>
                    </button>
                </div>
                <div className="template-grid">
                    {TEMPLATES.map((t, i) => (
                        <button key={i} className="template-card glass" onClick={() => handleTemplateClick(t)}>
                            <div className="template-icon" style={{ backgroundColor: t.color }}>{t.icon}</div>
                            <span className="template-label">{t.title}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="dashboard-section settings-section">
                <div className="section-header">
                    <h2>⚙️ Data Management</h2>
                </div>
                <div className="settings-grid glass">
                    <div className="settings-info">
                        <p>Data is stored locally in your browser. Deploying new code will not overwrite your goals.</p>
                        <p className="settings-hint">Use these tools for development testing or to start fresh.</p>
                    </div>
                    <div className="settings-actions">
                        <button className="btn-secondary" onClick={onLoadSampleData}>
                            <RefreshCw size={16} />
                            <span>Load Sample Data</span>
                        </button>
                        <button className="btn-danger" onClick={onResetData}>
                            <Trash2 size={16} />
                            <span>Clear All Data</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
