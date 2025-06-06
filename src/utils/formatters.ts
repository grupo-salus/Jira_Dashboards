// Funções utilitárias de formatação para datas, tempo, prioridade, etc.
// Este arquivo é separado dos padrões de cor e fonte (ver themeColors.ts)

import { differenceInSeconds } from 'date-fns';
import { BacklogItem, TimeMetric } from '../types/backlog';

/**
 * Formats seconds into days, hours, minutes and seconds
 */
export const formatTime = (seconds: number): TimeMetric => {
  if (!seconds || isNaN(seconds)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const days = Math.floor(seconds / (24 * 3600));
  seconds -= days * 24 * 3600;
  
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  
  return {
    days,
    hours,
    minutes,
    seconds: Math.floor(seconds)
  };
};

/**
 * Formats time metric object into readable string
 */
export const formatTimeToString = (time: TimeMetric): string => {
  let result = '';
  if (time.days > 0) result += `${time.days}d `;
  if (time.hours > 0) result += `${time.hours}h `;
  if (time.minutes > 0) result += `${time.minutes}m `;
  if (time.seconds > 0 || result === '') result += `${time.seconds}s`;
  return result.trim();
};

/**
 * Calculates time in queue based on creation date
 */
export const calculateTimeInQueue = (creationDate: string): TimeMetric => {
  const created = new Date(creationDate);
  const now = new Date();
  const seconds = differenceInSeconds(now, created);
  return formatTime(seconds);
};

/**
 * Converts estimated time in seconds to human-readable format
 */
export const formatEstimatedTime = (seconds: number): string => {
  if (!seconds) return 'N/A';
  const time = formatTime(seconds);
  return formatTimeToString(time);
};

/**
 * Gets the appropriate color class for priority
 */
export const getPriorityColorClass = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'Highest': 'priority-highest',
    'High': 'priority-high',
    'Medium': 'priority-medium',
    'Low': 'priority-low',
    'Lowest': 'priority-lowest'
  };
  
  return priorityMap[priority] || 'bg-gray-500 text-white';
};

/**
 * Calculates average time in queue for a set of backlog items
 */
export const calculateAverageTime = (items: BacklogItem[]): TimeMetric => {
  if (!items.length) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  const totalSeconds = items.reduce((total, item) => {
    const created = new Date(item['Data de Criação']);
    const now = new Date();
    return total + differenceInSeconds(now, created);
  }, 0);
  
  return formatTime(Math.floor(totalSeconds / items.length));
};

/**
 * Formata um número para porcentagem com 2 casas decimais
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Formata um número para horas com 2 casas decimais
 */
export const formatHours = (value: number): string => {
  return `${value.toFixed(2)}h`;
};

/**
 * Formata uma data para o padrão brasileiro
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};