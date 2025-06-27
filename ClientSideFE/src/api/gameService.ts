import apiClient from './client';
import { Game, GameWithRatio } from '../types';

// Fetches all games
export const getGames = async (): Promise<Game[]> => {
    const response = await apiClient.get<Game[]>('/games');
    return response.data;
};

// Fetches a game by its ID
export const getGameById = async (id: number): Promise<Game> => {
    const response = await apiClient.get<Game>(`/games/${id}`);
    return response.data;
};

// Creates a new game
export const createGame = async (game: Omit<Game, 'gameID'>): Promise<Game> => {
    const response = await apiClient.post<Game>('/games', game);
    return response.data;
};

// Updates an existing game by ID
export const updateGame = async (id: number, game: Game): Promise<void> => {
    await apiClient.put(`/games/${id}`, game);
};

// Deletes a game by ID
export const deleteGame = async (id: number): Promise<void> => {
    await apiClient.delete(`/games/${id}`);
};

// Fetches all games with their ratio
export const getGamesWithRatio = async (): Promise<GameWithRatio[]> => {
    const response = await apiClient.get<GameWithRatio[]>('/gameswithratio');
    return response.data;
};