import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export interface RainEvent {
  id: string;
  status: 'active' | 'completed' | 'cancelled';
  total_amount: number;
  duration_seconds: number;
  ends_at: string;
  max_participants: number;
}

export const useRainEvent = (currentUserId?: string) => {
  const [activeEvent, setActiveEvent] = useState<RainEvent | null>(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    // 1. İlk yüklemede aktif etkinliği çek
    const fetchActiveEvent = async () => {
      const { data, error } = await supabase
        .from('rain_events')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        const diff = Math.floor((new Date(data.ends_at).getTime() - Date.now()) / 1000);
        if (diff <= 0) {
            setActiveEvent(null);
            return;
        }
        
        setActiveEvent(data);
        setTimeLeft(diff);
        fetchParticipants(data.id);
        
        // Check local storage for instant frontend persistence
        if (localStorage.getItem('rain_claimed_' + data.id) === 'true') {
            setHasClaimed(true);
        } else if (currentUserId && currentUserId !== 'guest') {
            const { data: claimData } = await supabase
                .from('rain_participants')
                .select('id')
                .eq('event_id', data.id)
                .eq('user_id', currentUserId)
                .single();
            if (claimData) setHasClaimed(true);
        }
      }
    };

    fetchActiveEvent();

    // 2. Realtime Abonelikler
    const rainChannelId = 'rain_events_' + Math.random().toString(36).substr(2, 9);
    const rainChannel = supabase.channel(rainChannelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rain_events' }, (payload) => {
        const newEvent = payload.new as RainEvent;
        if (newEvent.status === 'active') {
          setActiveEvent(prev => {
            if (!prev || prev.id !== newEvent.id) {
               if (localStorage.getItem('rain_claimed_' + newEvent.id) === 'true') {
                   setHasClaimed(true);
               } else {
                   setHasClaimed(false);
               }
            }
            return newEvent;
          });
          calculateTimeLeft(newEvent.ends_at);
        } else {
          setActiveEvent(null);
          setTimeLeft(null);
        }
      })
      .subscribe();

    const participantsChannelId = 'rain_participants_' + Math.random().toString(36).substr(2, 9);
    const participantsChannel = supabase.channel(participantsChannelId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rain_participants' }, () => {
        setParticipantsCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(rainChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [currentUserId]);

  // Zamanlayıcı
  useEffect(() => {
    if (!activeEvent) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
            setActiveEvent(null); // Auto-hide when time is up
            return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeEvent]);

  const calculateTimeLeft = (endsAt: string) => {
    const diff = Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000);
    setTimeLeft(diff > 0 ? diff : 0);
  };

  const fetchParticipants = async (eventId: string) => {
    const { count } = await supabase
      .from('rain_participants')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);
    setParticipantsCount(count || 0);
  };

  const claimRain = async (userId: string) => {
    if (!activeEvent || hasClaimed) return;
    try {
      const { data, error } = await supabase.rpc('claim_rain_event', {
        p_event_id: activeEvent.id,
        p_user_id: userId
      });

      if (error) throw error;
      setHasClaimed(true);
      localStorage.setItem('rain_claimed_' + activeEvent.id, 'true');
      return data;
    } catch (err: any) {
      console.error("Rain Claim Error:", err.message);
      throw err;
    }
  };

  return { activeEvent, timeLeft, participantsCount, hasClaimed, claimRain };
};
