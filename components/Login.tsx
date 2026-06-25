
import React, { useState } from 'react';
import { Lock, User, X } from 'lucide-react';

interface LoginProps {
  onLogin: (role: string) => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const uname = username.toLowerCase().trim();
    if (uname === 'admin' && password === '123456') {
      onLogin('admin');
    } else if (['editor1', 'editor2', 'editor3'].includes(uname) && password === '123456') {
      onLogin(uname);
    } else {
      setError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-primary/20 rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-black text-white">YÖNETİM PANELİ</h2>
          <p className="text-zinc-500 text-sm">Lütfen giriş yapın</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary transition-colors outline-none"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary transition-colors outline-none"
                placeholder="••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-black font-black py-4 rounded-2xl transition-all glow-button active:scale-95"
          >
            GİRİŞ YAP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
