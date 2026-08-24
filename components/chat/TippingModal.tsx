import React, { useState } from 'react';
import { X, Send, Coins } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface TippingModalProps {
    recipientUsername: string;
    senderUsername: string;
    onClose: () => void;
    onSuccess: (amount: number) => void;
}

export default function TippingModal({ recipientUsername, senderUsername, onClose, onSuccess }: TippingModalProps) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;
        setLoading(true);
        try {
            // In a real app, this would deduct from user balance and add to recipient.
            // For now, we simulate success and insert a chat message.
            const { error } = await supabase.from('tv_chat').insert({
                user_id: 'system',
                username: 'Sistem',
                message: `[TIP] ${senderUsername} sent ${val}₺ to ${recipientUsername}!`,
                channel_id: 'global',
                role: 'system_announcement'
            });
            if (!error) {
                onSuccess(val);
                onClose();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#111318] border border-[#10B981]/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(16,185,129,0.15)] relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] p-[2px] mb-3 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <div className="w-full h-full rounded-full bg-[#111318] flex items-center justify-center">
                            <span className="text-2xl font-black text-white">{recipientUsername.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-white">@{recipientUsername}</h3>
                    <p className="text-zinc-400 text-sm mt-1">Kullanıcıya Bahşiş Gönder</p>
                </div>

                <div className="mb-6 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Coins className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Miktar (₺)"
                        className="w-full bg-[#0b0c10] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-black text-lg focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all"
                    />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                    {[50, 100, 500].map(val => (
                        <button 
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            className="bg-white/5 hover:bg-[#10B981]/20 border border-white/5 hover:border-[#10B981]/40 text-zinc-300 hover:text-[#10B981] rounded-lg py-2 text-sm font-bold transition-all"
                        >
                            {val}₺
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleSend}
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                    className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl py-3.5 font-black text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Gönderiliyor...' : 'Bahşiş Gönder'} <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
