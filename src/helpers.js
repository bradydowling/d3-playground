export const margin = { top: 30, right: 30, bottom: 30, left: 30 };
export const height = 200;
export const width = 1200;
export const barSpacing = 1;

export const hoursToMinutes = (timeString) => {
    if (!timeString) {
        return null;
    }
    const [ hours, minutes ] = timeString.split(":");
    const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    return totalMinutes;
}

export const getPastDays = (pastDaysNum, currentDayIndex, daysData) => {
    const pastDays = daysData.sort((a, b) => a.date > b.date).filter((innerItem, innerIndex) => innerIndex > (currentDayIndex - pastDaysNum) && innerIndex < currentDayIndex).concat(daysData[currentDayIndex]);
    const pastDaysValues = pastDays.map(item => hoursToMinutes(item["Usage time"]));
    const pastDaysTotal = pastDaysValues.reduce((total, dayValue) => total + dayValue);
    return {
        days: pastDays,
        totalValue: pastDaysTotal,
        avgValue: pastDaysTotal / pastDays.length,
    };
};

export const getBandwidth = (chartWidth, data, barSpace) => {
    return chartWidth / data.length - barSpace
};