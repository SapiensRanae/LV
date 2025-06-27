import apiClient from './client';

export interface SlotsSpinRequest {
    userId: number;
    betAmount: number;
}

export interface SlotsSpinResult {
    reels: Array<{ name: string; color: string; suit: string }>;
    combination: string;
    multiplier: number;
    betAmount: number;
    winnings: number;
}

export const spinSlots = async (data: SlotsSpinRequest): Promise<SlotsSpinResult> => {
    const response = await apiClient.post<SlotsSpinResult>('/slots/spin', data);
    return response.data;
};