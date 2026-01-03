import { useState } from 'react';
import type { FormEvent } from 'react';
import { X, Save, Calendar, Trash } from 'lucide-react';
import type { Goal } from '../types';
import './GoalModal.css';

interface GoalModalProps {
    goal?: Goal;
    goals: Goal[];
    onSave: (goal: Goal) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

const GoalModal = ({ goal, goals, onSave, onDelete, onClose }: GoalModalProps) => {
    const [title, setTitle] = useState(goal?.title || '');
    const [description, setDescription] = useState(goal?.description || '');
    const [startDate, setStartDate] = useState(goal?.startDate || new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(goal?.endDate || new Date().toISOString().split('T')[0]);
    const [color, setColor] = useState(goal?.color || '#6366f1');
    const [progress, setProgress] = useState(goal?.progress || 0);
    const [parentId, setParentId] = useState(goal?.parentId || '');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave({
            id: goal?.id || Math.random().toString(36).substr(2, 9),
            title,
            description,
            startDate,
            endDate,
            color,
            progress,
            parentId: parentId || undefined,
            dependencies: goal?.dependencies || []
        });
    };

    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    return (
        <div className="modal-overlay glass" onClick={onClose}>
            <div className="modal-content glass" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{goal ? 'Edit Goal' : 'New Goal'}</h2>
                    <button className="btn-icon" onClick={onClose}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="What do you want to achieve?"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Add some details..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <div className="input-with-icon">
                                <Calendar size={16} />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <div className="input-with-icon">
                                <Calendar size={16} />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Parent Goal (Optional)</label>
                        <select value={parentId} onChange={e => setParentId(e.target.value)}>
                            <option value="">None (Top Level)</option>
                            {goals.filter(g => g.id !== goal?.id).map(g => (
                                <option key={g.id} value={g.id}>{g.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Progress ({progress}%)</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={e => setProgress(Number(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Color</label>
                        <div className="color-picker">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`color-swatch ${color === c ? 'active' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        {goal && (
                            <button
                                type="button"
                                className="btn-icon"
                                onClick={() => onDelete(goal.id)}
                                style={{ color: '#ef4444', borderColor: '#ef444420' }}
                            >
                                <Trash size={18} />
                            </button>
                        )}
                        <button type="submit" className="btn-primary">
                            <Save size={18} />
                            <span>Save Goal</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoalModal;
