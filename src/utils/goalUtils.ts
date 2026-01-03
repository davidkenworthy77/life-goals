import {
    differenceInDays,
    parseISO,
    isAfter,
    isBefore,
    startOfToday
} from 'date-fns';
import type { Goal } from '../types';

export interface GoalHealth {
    status: 'on-track' | 'behind' | 'at-risk' | 'completed' | 'not-started';
    label: string;
    color: string;
}

export const calculateTimeProgress = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const today = startOfToday();

    if (isBefore(today, start)) return 0;
    if (isAfter(today, end)) return 100;

    const totalDays = differenceInDays(end, start) || 1;
    const elapsedDays = differenceInDays(today, start);

    return Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));
};

export const calculateGoalHealth = (goal: Goal): GoalHealth => {
    if (goal.completed) {
        return {
            status: 'completed',
            label: 'Completed',
            color: '#10b981' // Green
        };
    }
    const timeProgress = calculateTimeProgress(goal.startDate, goal.endDate);
    const completionProgress = goal.progress;

    if (completionProgress >= 100) {
        return { status: 'completed', label: 'Completed', color: '#10b981' };
    }

    if (timeProgress === 0) {
        return { status: 'not-started', label: 'Not Started', color: '#94a3b8' };
    }

    const gap = timeProgress - completionProgress;

    if (gap <= 5) {
        return { status: 'on-track', label: 'On Track', color: '#10b981' };
    } else if (gap <= 20) {
        return { status: 'behind', label: 'Behind', color: '#f59e0b' };
    } else {
        return { status: 'at-risk', label: 'At Risk', color: '#ef4444' };
    }
};
