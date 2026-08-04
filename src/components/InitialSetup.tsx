import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function InitialSetup({ onComplete }: { onComplete: () => void }) {
  const { updateCurrentUser } = useAppContext();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && fullName.trim()) {
      updateCurrentUser(username.trim(), fullName.trim());
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">환영합니다</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">계속하려면 계정 정보를 입력해주세요.</p>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사용자 이름</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="예: minji_01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="예: 김민지"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={!username.trim() || !fullName.trim()}
            className="mt-2 w-full py-3 bg-blue-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}
