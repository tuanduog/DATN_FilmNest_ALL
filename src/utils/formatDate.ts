export default function formatDate(date: Date) {
    if (!date || isNaN(new Date(date).getTime())) return '';

    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(date));
}