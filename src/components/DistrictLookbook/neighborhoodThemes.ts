// ==============================================================================
// NEIGHBORHOOD THEMES - Dynamic Color Themes for SF Neighborhoods
// ==============================================================================

import type { NeighborhoodTheme } from '../../types/components';

export const neighborhoodThemes: Record<string, NeighborhoodTheme> = {
  'mission-district': {
    primary: '#FF6B35', // Mission Orange
    secondary: '#FFB800',
    gradient: 'linear-gradient(135deg, #FF6B35, #FBBF24)',
    icon: '🎨'
  },
  'noe-valley': {
    primary: '#FFB800', // Sunshine Yellow
    secondary: '#FEF3C7',
    gradient: 'linear-gradient(135deg, #FFB800, #FEF3C7)',
    icon: '☀️'
  },
  'castro': {
    primary: '#B8A9E5', // Rainbow Purple
    secondary: '#FF8B7B',
    gradient: 'linear-gradient(135deg, #B8A9E5, #FF8B7B)',
    icon: '🌈'
  },
  'marina': {
    primary: '#60A5FA', // Bay Blue
    secondary: '#93C5FD',
    gradient: 'linear-gradient(135deg, #60A5FA, #93C5FD)',
    icon: '⛵'
  },
  'presidio': {
    primary: '#52C41A', // Presidio Green
    secondary: '#A7C957',
    gradient: 'linear-gradient(135deg, #52C41A, #A7C957)',
    icon: '🌲'
  },
  'pacific-heights': {
    primary: '#D4AF37', // Gold
    secondary: '#FFF8DC',
    gradient: 'linear-gradient(135deg, #D4AF37, #FFF8DC)',
    icon: '👑'
  },
  'russian-hill': {
    primary: '#8B4513', // Saddle Brown
    secondary: '#DEB887',
    gradient: 'linear-gradient(135deg, #8B4513, #DEB887)',
    icon: '🏔️'
  },
  'sunset-inner': {
    primary: '#FF8C42', // Sunset Orange
    secondary: '#FFD166',
    gradient: 'linear-gradient(135deg, #FF8C42, #FFD166)',
    icon: '🌅'
  },
  'haight-ashbury': {
    primary: '#9B59B6', // Psychedelic Purple
    secondary: '#E74C3C',
    gradient: 'linear-gradient(135deg, #9B59B6, #E74C3C)',
    icon: '☮️'
  },
  'financial-district': {
    primary: '#34495E', // Business Gray
    secondary: '#95A5A6',
    gradient: 'linear-gradient(135deg, #34495E, #95A5A6)',
    icon: '🏢'
  },
  'north-beach': {
    primary: '#E74C3C', // Italian Red
    secondary: '#F39C12',
    gradient: 'linear-gradient(135deg, #E74C3C, #F39C12)',
    icon: '🍝'
  },
  'chinatown': {
    primary: '#C0392B', // Lantern Red
    secondary: '#F39C12',
    gradient: 'linear-gradient(135deg, #C0392B, #F39C12)',
    icon: '🏮'
  },
  'soma': {
    primary: '#2C3E50', // Industrial Steel
    secondary: '#7F8C8D',
    gradient: 'linear-gradient(135deg, #2C3E50, #7F8C8D)',
    icon: '🏭'
  },
  'potrero-hill': {
    primary: '#16A085', // Hill Green
    secondary: '#1ABC9C',
    gradient: 'linear-gradient(135deg, #16A085, #1ABC9C)',
    icon: '⛰️'
  },
  'richmond': {
    primary: '#3498DB', // Ocean Blue
    secondary: '#85C1E2',
    gradient: 'linear-gradient(135deg, #3498DB, #85C1E2)',
    icon: '🌊'
  },
  'bernal-heights': {
    primary: '#16A085', // Hilltop Teal
    secondary: '#48C9B0',
    gradient: 'linear-gradient(135deg, #16A085, #48C9B0)',
    icon: '⛰️'
  },
  'inner-sunset': {
    primary: '#FF8C42',
    secondary: '#FFD166',
    gradient: 'linear-gradient(135deg, #FF8C42, #FFD166)',
    icon: '🌅'
  },
  'outer-sunset': {
    primary: '#FF6B6B',
    secondary: '#FFA726',
    gradient: 'linear-gradient(135deg, #FF6B6B, #FFA726)',
    icon: '🌊'
  },
  'inner-richmond': {
    primary: '#5DADE2',
    secondary: '#AED6F1',
    gradient: 'linear-gradient(135deg, #5DADE2, #AED6F1)',
    icon: '🌊'
  },
  'outer-richmond': {
    primary: '#3498DB',
    secondary: '#85C1E2',
    gradient: 'linear-gradient(135deg, #3498DB, #85C1E2)',
    icon: '🌁'
  },
  'excelsior': {
    primary: '#E67E22',
    secondary: '#F39C12',
    gradient: 'linear-gradient(135deg, #E67E22, #F39C12)',
    icon: '🏘️'
  },
  'bayview': {
    primary: '#3498DB',
    secondary: '#5DADE2',
    gradient: 'linear-gradient(135deg, #3498DB, #5DADE2)',
    icon: '🌊'
  },
  'dogpatch': {
    primary: '#34495E',
    secondary: '#7F8C8D',
    gradient: 'linear-gradient(135deg, #34495E, #7F8C8D)',
    icon: '🏭'
  },
  'western-addition': {
    primary: '#9B59B6',
    secondary: '#BB8FCE',
    gradient: 'linear-gradient(135deg, #9B59B6, #BB8FCE)',
    icon: '🎵'
  },
  'glen-park': {
    primary: '#27AE60',
    secondary: '#52C41A',
    gradient: 'linear-gradient(135deg, #27AE60, #52C41A)',
    icon: '🌳'
  },
  'twin-peaks': {
    primary: '#8E44AD',
    secondary: '#A569BD',
    gradient: 'linear-gradient(135deg, #8E44AD, #A569BD)',
    icon: '🗻'
  }
};

// Fallback theme for unmapped neighborhoods
export const defaultTheme: NeighborhoodTheme = {
  primary: '#1e3a8a',
  secondary: '#ff6b35',
  gradient: 'linear-gradient(135deg, #1e3a8a, #ff6b35)',
  icon: '📍'
};
