export default function formatDate(date: string) {
    if (!date || isNaN(new Date(date).getTime())) return '';

    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(date));
}

export function formatTime(time: string | number[]) {
    if (!time) return '';
    
    if (Array.isArray(time)) {
        const hours = time[0].toString().padStart(2, '0');
        const minutes = (time[1] || 0).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    if (typeof time === 'string') {
        return time.slice(0, 5);
    }
    
    return '';
}