import apiClient from './client';
import { Game, GameWithRatio } from '../types';

export const getGames = async (): Promise<Game[]> => {
    const response = await apiClient.get<Game[]>('/games');
    return response.data;
};

export const getGameById = async (id: number): Promise<Game> => {
    const response = await apiClient.get<Game>(`/games/${id}`);
    return response.data;
};

export const createGame = async (game: Omit<Game, 'gameID'>): Promise<Game> => {
    const response = await apiClient.post<Game>('/games', game);
    return response.data;
};

export const updateGame = async (id: number, game: Game): Promise<void> => {
    await apiClient.put(`/games/${id}`, game);
};

export const deleteGame = async (id: number): Promise<void> => {
    await apiClient.delete(`/games/${id}`);
};

export const getGamesWithRatio = async (): Promise<GameWithRatio[]> => {
    const response = await apiClient.get<GameWithRatio[]>('/gameswithratio');
    return response.data;
};
