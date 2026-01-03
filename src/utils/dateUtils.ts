import {
    addQuarters,
    addYears,
    differenceInDays,
    endOfMonth,
    endOfQuarter,
    endOfYear,
    startOfMonth,
    startOfQuarter,
    startOfYear,
    eachMonthOfInterval
} from 'date-fns';
import type { ZoomLevel } from '../types';

export const CELL_WIDTH = 40; // width in pixels for a single day/unit

export const getUnitDays = (date: Date, zoom: ZoomLevel) => {
    switch (zoom) {
        case 'month':
            return differenceInDays(endOfMonth(date), startOfMonth(date)) + 1;
        case 'quarter':
            return differenceInDays(endOfQuarter(date), startOfQuarter(date)) + 1;
        case 'year':
            return differenceInDays(endOfYear(date), startOfYear(date)) + 1;
    }
};

export const getTimelineIntervals = (start: Date, end: Date, zoom: ZoomLevel) => {
    switch (zoom) {
        case 'month':
            return eachMonthOfInterval({ start, end });
        case 'quarter':
            // Roughly simulate quarters since date-fns doesn't have eachQuarterOfInterval natively in old versions, 
            // but in newer ones it might. Let's stick to simple logic.
            const intervals: Date[] = [];
            let current = startOfQuarter(start);
            while (current <= end) {
                intervals.push(current);
                current = addQuarters(current, 1);
            }
            return intervals;
        case 'year':
            const years: Date[] = [];
            let curYear = startOfYear(start);
            while (curYear <= end) {
                years.push(curYear);
                curYear = addYears(curYear, 1);
            }
            return years;
    }
};

export const getBarPosition = (
    startDate: Date,
    endDate: Date,
    timelineStart: Date,
    zoom: ZoomLevel
) => {
    const dayDiffFromStart = differenceInDays(startDate, timelineStart);
    const durationDays = differenceInDays(endDate, startDate) + 1;

    // We need a scale. Let's say in 'month' view, 1 day = 40px?
    // No, that's too wide. Let's make it responsive to zoom.

    let pxPerDay = 1.0;
    if (zoom === 'month') pxPerDay = 40; // 1 day = 40px
    if (zoom === 'quarter') pxPerDay = 10; // 1 day = 10px
    if (zoom === 'year') pxPerDay = 2; // 1 day = 2px

    return {
        left: dayDiffFromStart * pxPerDay,
        width: durationDays * pxPerDay,
        pxPerDay
    };
};

export const getTimelineWidth = (start: Date, end: Date, zoom: ZoomLevel) => {
    const days = differenceInDays(end, start) + 1;
    let pxPerDay = 1.0;
    if (zoom === 'month') pxPerDay = 40;
    if (zoom === 'quarter') pxPerDay = 10;
    if (zoom === 'year') pxPerDay = 2;
    return days * pxPerDay;
};
