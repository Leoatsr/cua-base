/**
 * Discord 通知 helper · 通过 Supabase Edge Function 转发
 * webhook URL 存 Supabase secrets · 不暴露在前端
 */
import { getSupabase } from './supabase';

type EventType = 'player_joined' | 'level_up' | 'task_complete';

async function notify(event_type: EventType, payload: Record<string, any>) {
  try {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase.functions.invoke('notify-discord', {
      body: { event_type, payload },
    });
    if (error) console.warn('[discord] notify failed:', error);
  } catch (err) {
    console.warn('[discord] notify exception:', err);
  }
}

export function notifyPlayerJoined(username: string, totalCount: number) {
  return notify('player_joined', { username, totalCount });
}

export function notifyLevelUp(
  username: string,
  fromLevel: number,
  toLevel: number,
  levelName: string,
  currentCV: number
) {
  return notify('level_up', { username, fromLevel, toLevel, levelName, currentCV });
}

export function notifyTaskComplete(
  username: string,
  taskName: string,
  cvAmount: number,
  workshop?: string
) {
  return notify('task_complete', { username, taskName, cvAmount, workshop });
}