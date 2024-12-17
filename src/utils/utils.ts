export function normalizeData(userId: any) {
    // Ensure that userId is a string
    if (typeof userId !== 'string') {
        userId = String(userId); // Convert to string if it's not already
    }
    return userId.toLowerCase().replace(/[^a-z0-9]/g, '');
}  