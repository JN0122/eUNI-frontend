export default function (date) {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)); // Liczba dni od początku roku

    return Math.ceil((days + startDate.getDay()) / 7);
}
