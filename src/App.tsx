import { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar, LayoutDashboard, GanttChart as GanttIcon } from 'lucide-react';
import type { Goal, ZoomLevel, TimelineConfig } from './types';
import GanttChart from './components/GanttChart';
import Dashboard from './components/Dashboard';
import GoalModal from './components/GoalModal';
import { addMonths, subMonths, startOfToday } from 'date-fns';
import './App.css';

const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Personal Growth 2026',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    color: '#6366f1',
    dependencies: [],
    progress: 10,
    description: 'Overall growth goals for the year'
  },
  {
    id: '2',
    title: 'Learn Advanced AI',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    parentId: '1',
    color: '#ec4899',
    dependencies: [],
    progress: 25,
    description: 'Master agentic workflows'
  },
  {
    id: '3',
    title: 'Build SaaS MVP',
    startDate: '2026-07-01',
    endDate: '2026-11-30',
    parentId: '1',
    color: '#10b981',
    dependencies: ['2'],
    progress: 0,
    description: 'Launch the life planner app'
  }
];

function App() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('life-goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [activeTab, setActiveTab] = useState<'timeline' | 'dashboard'>('dashboard');
  const [zoom, setZoom] = useState<ZoomLevel>('year');
  const [viewDate] = useState(startOfToday());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem('life-goals', JSON.stringify(goals));
  }, [goals]);

  const timelineConfig: TimelineConfig = useMemo(() => {
    // Expand the range significantly to allow scrolling backwards and far into the future
    let start, end;
    if (zoom === 'month') {
      start = subMonths(viewDate, 12);
      end = addMonths(viewDate, 12);
    } else if (zoom === 'quarter') {
      start = subMonths(viewDate, 24);
      end = addMonths(viewDate, 48);
    } else {
      start = subMonths(viewDate, 60); // 5 years back
      end = addMonths(viewDate, 120); // 10 years forward
    }
    return {
      zoom,
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  }, [zoom, viewDate]);

  const handleAddGoal = (template?: Partial<Goal>) => {
    if (template) {
      setEditingGoal({
        id: Math.random().toString(36).substr(2, 9),
        title: template.title || '',
        startDate: template.startDate || new Date().toISOString().split('T')[0],
        endDate: template.endDate || new Date().toISOString().split('T')[0],
        color: template.color || '#6366f1',
        progress: 0,
        dependencies: [],
        description: ''
      });
    } else {
      setEditingGoal(undefined);
    }
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id && g.parentId !== id));
    setIsModalOpen(false);
  };

  const handleSaveGoal = (goal: Goal) => {
    if (goals.find(g => g.id === goal.id)) {
      setGoals(prev => prev.map(g => g.id === goal.id ? goal : g));
    } else {
      setGoals(prev => [...prev, goal]);
    }
    setIsModalOpen(false);
  };

  const handleUpdateGoalDates = (id: string, start: string, end: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, startDate: start, endDate: end } : g));
  };

  const handleToggleComplete = (id: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        return { ...goal, completed: !goal.completed, progress: !goal.completed ? 100 : goal.progress };
      }
      return goal;
    }));
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear all goals? This cannot be undone.')) {
      setGoals([]);
    }
  };

  const handleLoadSampleData = () => {
    if (window.confirm('Load sample goals? This will overwrite your current data.')) {
      setGoals(INITIAL_GOALS);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header glass">
        <div className="header-left">
          <Calendar className="logo-icon" />
          <h1>Life Goals</h1>
        </div>

        <div className="header-center">
          <nav className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <GanttIcon size={18} />
              <span>Timeline</span>
            </button>
          </nav>
        </div>

        <div className="header-right">
          {activeTab === 'timeline' && (
            <div className="zoom-controls">
              <button
                className={`zoom-btn ${zoom === 'month' ? 'active' : ''}`}
                onClick={() => setZoom('month')}
              >Month</button>
              <button
                className={`zoom-btn ${zoom === 'quarter' ? 'active' : ''}`}
                onClick={() => setZoom('quarter')}
              >Quarter</button>
              <button
                className={`zoom-btn ${zoom === 'year' ? 'active' : ''}`}
                onClick={() => setZoom('year')}
              >Year</button>
            </div>
          )}
          <button className="btn-primary" onClick={() => handleAddGoal()}>
            <Plus size={18} />
            <span>Add Goal</span>
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'timeline' ? (
          <GanttChart
            goals={goals}
            config={timelineConfig}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
            onUpdateDates={handleUpdateGoalDates}
            onToggleComplete={handleToggleComplete}
          />
        ) : (
          <Dashboard
            goals={goals}
            onAddGoal={handleAddGoal}
            onEditGoal={handleEditGoal}
            onToggleComplete={handleToggleComplete}
            onResetData={handleResetData}
            onLoadSampleData={handleLoadSampleData}
          />
        )}
      </main>

      {isModalOpen && (
        <GoalModal
          goal={editingGoal}
          goals={goals}
          onSave={handleSaveGoal}
          onDelete={handleDeleteGoal}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
