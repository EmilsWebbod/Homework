
export function formatTime(date: string): string {
    return new Intl.DateTimeFormat('nb-NO', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}
