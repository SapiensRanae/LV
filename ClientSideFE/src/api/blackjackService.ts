import apiClient from './client';

// Create a new blackjack lobby
export const createLobby = async (isPrivate: boolean): Promise<{ lobbyCode: string }> => {
    const response = await apiClient.post('/Blackjack/create-lobby', { IsPrivate: isPrivate });
    return response.data;
};

// Join an existing blackjack lobby
export const joinLobby = async (lobbyCode: string): Promise<{ message: string; lobbyCode: string }> => {
    const response = await apiClient.post('/Blackjack/join-lobby', { LobbyCode: lobbyCode });
    return response.data;
};

// Start a blackjack game in a lobby
export const startGame = async (lobbyCode: string): Promise<any> => {
    const response = await apiClient.post(`/Blackjack/start-game/${lobbyCode}`);
    return response.data;
};

// Player action: bet, call, raise, fold (endpoint must be implemented on backend)
export const playerAction = async (
    lobbyCode: string,
    action: 'bet' | 'call' | 'raise' | 'fold',
    amount?: number
): Promise<any> => {
    // You may need to adjust this endpoint if your backend expects a different path or body
    const response = await apiClient.post(`/Blackjack/${action}`, {
        LobbyCode: lobbyCode,
        ...(amount !== undefined ? { Amount: amount } : {})
    });
    return response.data;
};

// Leave a blackjack lobby
export const leaveLobby = async (lobbyCode: string): Promise<any> => {
    const response = await apiClient.post(`/Blackjack/leave-lobby/${lobbyCode}`);
    return response.data;
};

// Get a player's blackjack profile
export const getPlayerProfile = async (userId: number): Promise<{
    Username: string;
    Description?: string;
    UserIcon?: string;
    History: Array<{
        GameTransactionID: number;
        CashAmount: number;
        Date: string;
        TransactionType: string;
    }>;
}> => {
    const response = await apiClient.get(`/Blackjack/profile/${userId}`);
    return response.data;
};