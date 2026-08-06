import React, { useState, useEffect, useRef } from 'react';
import { Crown, Shield, Star, Smile, Send } from 'lucide-react';
import SportBetCard from './SportBetCard';
import { supabase } from '../../utils/supabase';
import { generateRandomChat } from './fakeChatGenerator';

interface ChatChannelProps {
    server: string; // 'tr', 'br', 'ar', 'global'
    channelType: 'general' | 'sports';
    siteUser: any;
}

export default function ChatChannel({ server, channelType, siteUser }: ChatChannelProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const chatRef = useRef<HTMLDivElement>(null);

    // Mock initial data based on channel
    useEffect(() => {
        if (channelType === 'general') {
            if (server) { // generate for all servers, not just global
                // Initialize with 10 random messages to look active
                const initialMsgs = Array.from({ length: 10 }).map((_, idx) => {
                    const msg = generateRandomChat(server);
                    return {
                        ...msg,
                        created_at: new Date(Date.now() - (10 - idx) * 5000).toISOString()
                    };
                });
                setMessages(initialMsgs);

                const delay = server === 'global' ? 800 : 4000;
                const interval = setInterval(() => {
                    const newChat = generateRandomChat(server);
                    
                    setMessages(prev => {
                        const newMsgs = [...prev, newChat];
                        // Keep last 100 messages max to prevent lag
                        return newMsgs.length > 100 ? newMsgs.slice(newMsgs.length - 100) : newMsgs;
                    });
                }, delay); // Faster for global
                
                return () => clearInterval(interval);
            } else {
                setMessages([
                    { id: '1', username: 'Alex', role: 'VIP', message: 'Herkese selam! Bugün şansım yaver gidiyor.', created_at: new Date(Date.now() - 50000).toISOString() },
                    { id: '2', username: 'Admin', role: 'ADMIN', message: 'Hoş geldin Alex, bol şans!', created_at: new Date(Date.now() - 30000).toISOString() },
                ]);
            }
        } else {
            setMessages([
                { id: 'b1', type: 'bet', username: 'Kral_Alex', role: 'ADMIN', badge: 'hot_streak', title: 'Real Madrid vs. Barcelona', amount: '5.000', odds: '2.45', time: '20:45', pick: 'Maç Sonucu 1', copyCount: 14, reactions: { fire: 8, rocket: 2, money: 5, clown: 0 } },
                { id: 'b3', type: 'bet', username: 'ProBettor', role: 'VIP', badge: 'sniper', title: 'Avrupa Ligi Kombinesi', amount: '10.000', odds: '65.40', time: '12:15', isCombo: true, copyCount: 42, reactions: { fire: 24, rocket: 12, money: 18, clown: 0 }, matches: [
                    { title: 'Galatasaray vs. Lazio', pick: 'Maç Sonucu 1', odds: '2.10' },
                    { title: 'Fenerbahçe vs. Sevilla', pick: 'Karşılıklı Gol Var', odds: '1.75' },
                    { title: 'Beşiktaş vs. Porto', pick: '2.5 Üst', odds: '1.95' },
                    { title: 'Ajax vs. Roma', pick: 'Maç Sonucu 1', odds: '2.55' },
                    { title: 'Liverpool vs. Milan', pick: 'Karşılıklı Gol Var', odds: '1.80' }
                ]},
                { id: 'b4', type: 'bet', username: 'GhostBettor', role: 'VIP', title: 'Gece Kombinesi', amount: '25.000', odds: '14.50', time: '23:45', isCombo: true, isBlurred: true, copyCount: 0, reactions: { fire: 1, rocket: 0, money: 0, clown: 0 }, matches: [
                    { title: 'NBA Gizli Maç 1', pick: 'Üst', odds: '1.90' },
                    { title: 'NBA Gizli Maç 2', pick: 'Alt', odds: '1.90' }
                ]},
                { id: 'b2', type: 'bet', username: 'Veli_Can', role: 'USER', title: 'Chelsea vs. Arsenal', amount: '1.200', odds: '1.85', time: '45+', pick: 'Karşılıklı Gol Var', isLive: true, copyCount: 3, reactions: { fire: 1, rocket: 0, money: 2, clown: 0 } },
            ]); 
        }
    }, [server, channelType]);

    // Scroll to bottom
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    // Listen to external send events from ChatContainer
    useEffect(() => {
        const handleSendChat = (e: any) => {
            const text = e.detail;
            if (!text) return;

            const newMsg = {
                id: `user_${Math.random().toString(36).substring(7)}`,
                username: siteUser?.username || 'Siz',
                role: siteUser?.role || 'USER',
                message: text,
                created_at: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, newMsg]);
        };

        window.addEventListener('sendChatMessage', handleSendChat);
        return () => window.removeEventListener('sendChatMessage', handleSendChat);
    }, [siteUser]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        const newMsg = {
            id: Math.random().toString(36).substring(7),
            username: siteUser?.username || 'Misafir',
            role: siteUser?.role || 'USER',
            message: newMessage,
            created_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
    };

    const getUserColor = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 85%, 70%)`; // Pastel Neon Color
    };
    
    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

    if (channelType === 'sports') {
        return (
            <div className="flex flex-col w-full h-full bg-[#06080C] relative">
                <div 
                    ref={chatRef}
                    className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}
                >
                    {messages.map(bet => {
                        if (bet.type === 'system') {
                            return (
                                <div key={bet.id} className="flex justify-center my-2 animate-fade-in">
                                    <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                                        ⚡ {bet.message}
                                    </div>
                                </div>
                            );
                        }
                        return <SportBetCard key={bet.id} bet={bet} siteUser={siteUser} />
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full bg-[#06080C] relative">
            <div 
                ref={chatRef}
                className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}
            >
                {messages.map((msg) => {
                    const isAdmin = msg.role?.toUpperCase() === 'ADMIN';
                    const isMod = msg.role?.toUpperCase() === 'MODERATOR' || msg.role?.toUpperCase() === 'MOD';
                    const isVip = msg.role?.toUpperCase() === 'VIP';
                    const userColor = isAdmin ? '#ef4444' : isMod ? '#00E5FF' : getUserColor(msg.username);

                    return (
                        <div key={msg.id} className="flex items-start gap-3 w-full group">
                            {/* Avatar Removed */}

                            {/* Message Body */}
                            <div className="flex-1 min-w-0 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-xl border border-white/[0.04] rounded-2xl rounded-tl-sm px-4 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)]">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    {isAdmin && (
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600/20 to-transparent text-red-400 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest border border-red-500/30 uppercase shadow-[inset_0_1px_3px_rgba(239,68,68,0.2)]">
                                            <Crown className="w-3 h-3" /> KRAL
                                        </span>
                                    )}
                                    {isVip && (
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest border border-amber-500/20 uppercase">
                                            <Star className="w-3 h-3 fill-amber-400" /> VIP
                                        </span>
                                    )}
                                    
                                    <div className="flex items-center gap-1.5">
                                        {/* Roman Numeral Level Badge */}
                                        <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-white/10 to-transparent text-white/70 text-[9px] font-black border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] shrink-0">
                                            {isAdmin ? 'V' : isMod ? 'IV' : isVip ? 'III' : (msg.username.length % 2 === 0 ? 'II' : 'I')}
                                        </div>

                                        <span 
                                            className={`font-bold text-[14px] hover:underline decoration-white/20 underline-offset-4 tracking-wide ${isAdmin ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}`}
                                            style={{ color: isAdmin ? '#ef4444' : isVip ? '#FFD700' : userColor, textShadow: `0 0 15px ${userColor}40` }}
                                        >
                                            {msg.username}
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-semibold text-zinc-600 ml-auto tracking-wider">
                                        {new Date(msg.created_at).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <div className="text-[13px] leading-relaxed font-medium text-zinc-300 break-words drop-shadow-sm">
                                    {msg.message}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* General Channel Input is handled in ChatContainer or here, 
                let's handle it in ChatContainer to keep it sticky globally */}
        </div>
    );
}
