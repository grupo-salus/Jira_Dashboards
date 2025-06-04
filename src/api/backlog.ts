import { BacklogItem } from '../types/backlog';

const API_URL = 'http://localhost:8000';

export async function fetchBacklogData(): Promise<BacklogItem[]> {
  try {
    const response = await fetch(`${API_URL}/api/backlog`);
    if (!response.ok) {
      throw new Error('Failed to fetch backlog data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching backlog data:', error);
    throw error;
  }
}

export async function fetchSprintData(): Promise<BacklogItem[]> {
  try {
    const response = await fetch(`${API_URL}/api/sprint`);
    if (!response.ok) {
      throw new Error('Failed to fetch sprint data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sprint data:', error);
    throw error;
  }
}