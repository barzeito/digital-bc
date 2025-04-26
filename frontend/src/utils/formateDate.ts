function formatDate(dateTimeString: string) {
    const dateTime = new Date(dateTimeString);

    const formattedDate = dateTime.toLocaleDateString('he-IL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const hasExplicitTime = dateTimeString.includes("T") || dateTime.getHours() !== 0 || dateTime.getMinutes() !== 0;

    if (hasExplicitTime) {
        dateTime.toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${formattedDate}`;
    } else {
        return formattedDate;
    }
}

export function cardFormatDate(dateTimeString: string) {
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toLocaleDateString('en-GB');
    return `${formattedDate}`;
}

export default formatDate;