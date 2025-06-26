import apiClient from './client';

export async function spinRoulette(betData: {
    userId: number;
    betAmount: number;
    betType: string;
    betNumber: number | null;
    betColor: string;
    columnType: string | null;
    dozenType: string | null;
}) {
    const response = await apiClient.post('/Roulette/spin', betData);
    return response.data;
}