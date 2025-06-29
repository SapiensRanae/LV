import apiClient from './client';

// Sends a spin request to the roulette API with bet data
export async function spinRoulette(data: { bets: any[]; userId: number }) {
    const response = await apiClient.post('/Roulette/spin', data);
    return response.data;
}