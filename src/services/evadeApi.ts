import { EvadeResponse } from '../types/evade';

const EVADE_API_BASE = 'https://api.lanyard.rest/v1';

export const fetchEvadeData = async (userId: string): Promise<EvadeResponse> => {
  try {
    const response = await fetch(`${EVADE_API_BASE}/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Evade data:', error);
    throw error;
  }
};

export const getAvatarUrl = (userId: string, avatar: string, discriminator: string): string => {
  if (avatar) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;
  }
  // Fallback to default avatar based on discriminator
  const defaultAvatarId = parseInt(discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarId}.png`;
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'online':
      return 'Online';
    case 'idle':
      return 'Idle';
    case 'dnd':
      return 'Do Not Disturb';
    case 'offline':
      return 'Offline';
    default:
      return 'Unknown';
  }
};

export const getStatusClass = (status: string): string => {
  return `status-${status}`;
};

export const fetchGuildInfo = async (userId: string): Promise<any> => {
  try {
    // Try to fetch guild information from a different endpoint
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}/guilds`);
    
    if (!response.ok) {
      console.log('Guild info not available:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('Guild info response:', data);
    return data;
  } catch (error) {
    console.log('Error fetching guild info:', error);
    return null;
  }
}; 
