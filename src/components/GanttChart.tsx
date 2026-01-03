import { useRef, Fragment, useEffect } from 'react';
import { format, parseISO, startOfToday } from 'date-fns';
import { motion } from 'framer-motion';
import type { Goal, TimelineConfig } from '../types';
import { getTimelineIntervals, getBarPosition, getTimelineWidth } from '../utils/dateUtils';
import './GanttChart.css';

interface GanttChartProps {
    goals: Goal[];
    config: TimelineConfig;
    onEditGoal: (goal: Goal) => void;
    onDeleteGoal: (id: string) => void;
    onUpdateDates: (id: string, start: string, end: string) => void;
}

const GanttChart = ({
    goals,
    config,
    onEditGoal,
    onDeleteGoal: _onDeleteGoal,
    onUpdateDates: _onUpdateDates
}: GanttChartProps) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const timelineStart = parseISO(config.startDate);
    const timelineEnd = parseISO(config.endDate);

    const intervals = getTimelineIntervals(timelineStart, timelineEnd, config.zoom);
    const totalWidth = getTimelineWidth(timelineStart, timelineEnd, config.zoom);

    // Today indicator position
    const today = startOfToday();
    const todayPos = getBarPosition(today, today, timelineStart, config.zoom).left;

    useEffect(() => {
        if (viewportRef.current) {
            const scrollAmount = todayPos - viewportRef.current.clientWidth / 2;
            viewportRef.current.scrollLeft = Math.max(0, scrollAmount);
        }
    }, [config.zoom, config.startDate]); // Scroll whenever zoom or range changes

    const getFlattenedGoals = () => {
        const result: { goal: Goal; depth: number }[] = [];
        const flatten = (gs: Goal[], depth: number) => {
            gs.forEach(g => {
                result.push({ goal: g, depth });
                flatten(goals.filter(child => child.parentId === g.id), depth + 1);
            });
        };
        flatten(goals.filter(g => !g.parentId), 0);
        return result;
    };

    const flattenedGoals = getFlattenedGoals();
    const getGoalRowIndex = (id: string) => flattenedGoals.findIndex(f => f.goal.id === id);

    const handleDragEnd = (goal: Goal, info: any) => {
        const { pxPerDay } = getBarPosition(parseISO(goal.startDate), parseISO(goal.endDate), timelineStart, config.zoom);
        const daysMoved = Math.round(info.offset.x / pxPerDay);

        if (daysMoved === 0) return;

        const newStart = new Date(parseISO(goal.startDate));
        newStart.setDate(newStart.getDate() + daysMoved);

        const newEnd = new Date(parseISO(goal.endDate));
        newEnd.setDate(newEnd.getDate() + daysMoved);

        _onUpdateDates(goal.id, newStart.toISOString().split('T')[0], newEnd.toISOString().split('T')[0]);
    };

    const renderGoalRow = (goal: Goal, depth = 0) => {
        const { left, width } = getBarPosition(
            parseISO(goal.startDate),
            parseISO(goal.endDate),
            timelineStart,
            config.zoom
        );

        const childGoals = goals.filter(g => g.parentId === goal.id);

        return (
            <Fragment key={goal.id}>
                <div className="gantt-row">
                    <div className="gantt-label-cell" style={{ paddingLeft: `${depth * 20 + 12}px` }}>
                        <span className="goal-title" onClick={() => onEditGoal(goal)}>{goal.title}</span>
                    </div>
                    <div className="gantt-timeline-cell">
                        <motion.div
                            className="gantt-bar-container"
                            style={{ left, width }}
                            drag="x"
                            dragMomentum={false}
                            onDragEnd={(_e, info) => handleDragEnd(goal, info)}
                            layoutId={goal.id}
                        >
                            <div
                                className="gantt-bar"
                                style={{ backgroundColor: goal.color }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditGoal(goal);
                                }}
                            >
                                <div className="bar-progress" style={{ width: `${goal.progress}%` }} />
                                <span className="bar-label">{goal.title}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
                {childGoals.map(child => renderGoalRow(child, depth + 1))}
            </Fragment>
        );
    };

    const rootGoals = goals.filter(g => !g.parentId);

    return (
        <div className="gantt-container">
            <div className="gantt-sidebar-header glass">Goal</div>

            <div className="gantt-viewport" ref={viewportRef}>
                {/* Header */}
                <div className="gantt-header" style={{ width: totalWidth }}>
                    {intervals.map((date, i) => (
                        <div
                            key={i}
                            className="gantt-header-cell"
                            style={{
                                left: getBarPosition(date, date, timelineStart, config.zoom).left,
                                width: getBarPosition(date, date, timelineStart, config.zoom).pxPerDay * (
                                    config.zoom === 'month' ? 30 : config.zoom === 'quarter' ? 90 : 365
                                )
                            }}
                        >
                            {format(date, config.zoom === 'year' ? 'yyyy' : 'MMM yyyy')}
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="gantt-content" style={{ width: totalWidth }}>
                    {/* Grid Lines */}
                    <div className="gantt-grid">
                        {intervals.map((date, i) => (
                            <div
                                key={i}
                                className="grid-line"
                                style={{ left: getBarPosition(date, date, timelineStart, config.zoom).left }}
                            />
                        ))}
                        {todayPos >= 0 && todayPos <= totalWidth && (
                            <div className="today-line" style={{ left: todayPos }}>
                                <span className="today-label">Today</span>
                            </div>
                        )}
                    </div>

                    {/* Dependency Lines */}
                    <svg className="gantt-svg-layer" style={{ width: totalWidth, height: '100%' }}>
                        {goals.map(goal => {
                            if (!goal.dependencies || goal.dependencies.length === 0) return null;

                            const targetPos = getBarPosition(parseISO(goal.startDate), parseISO(goal.endDate), timelineStart, config.zoom);

                            return goal.dependencies.map(depId => {
                                const depGoal = goals.find(g => g.id === depId);
                                if (!depGoal) return null;

                                const sourcePos = getBarPosition(parseISO(depGoal.startDate), parseISO(depGoal.endDate), timelineStart, config.zoom);

                                // Better Y calculation using pre-calculated row indices
                                const startX = sourcePos.left + sourcePos.width;
                                const startY = getGoalRowIndex(depGoal.id) * 44 + 22;
                                const endX = targetPos.left;
                                const endY = getGoalRowIndex(goal.id) * 44 + 22;

                                return (
                                    <path
                                        key={`${depId}-${goal.id}`}
                                        d={`M ${startX} ${startY} L ${startX + 10} ${startY} L ${startX + 10} ${endY} L ${endX} ${endY}`}
                                        className="dependency-line"
                                        markerEnd="url(#arrowhead)"
                                    />
                                );
                            });
                        })}
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary)" />
                            </marker>
                        </defs>
                    </svg>

                    {/* Goals */}
                    <div className="gantt-rows">
                        {rootGoals.map(goal => renderGoalRow(goal))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
