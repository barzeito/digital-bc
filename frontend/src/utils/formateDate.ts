function formatDate(dateTimeString: string) {
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toLocaleDateString('en-GB');
    const formattedTime = dateTime.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${formattedDate} ${formattedTime}`;
}
export default formatDate;