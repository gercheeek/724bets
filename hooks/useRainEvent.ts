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

export const useRainEvent = () => {
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
        setActiveEvent(data);
        calculateTimeLeft(data.ends_at);
        fetchParticipants(data.id);
      }
    };

    fetchActiveEvent();

    // 2. Realtime Abonelikler
    const rainChannelId = 'rain_events_' + Math.random().toString(36).substr(2, 9);
    const rainChannel = supabase.channel(rainChannelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rain_events' }, (payload) => {
        const newEvent = payload.new as RainEvent;
        if (newEvent.status === 'active') {
          setActiveEvent(newEvent);
          setHasClaimed(false);
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
  }, []);

  // Zamanlayıcı
  useEffect(() => {
    if (!activeEvent || !timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
      if (timeLeft <= 1) setActiveEvent(null); // Süre bitti
    }, 1000);
    return () => clearInterval(interval);
  }, [activeEvent, timeLeft]);

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
      return data;
    } catch (err: any) {
      console.error("Rain Claim Error:", err.message);
      throw err;
    }
  };

  return { activeEvent, timeLeft, participantsCount, hasClaimed, claimRain };
};
