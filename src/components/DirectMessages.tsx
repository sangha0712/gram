import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Send } from 'lucide-react';
import { Chat, User } from '../types';

export default function DirectMessages({ onUserClick }: { onUserClick: (userId: string) => void }) {
  const { chats, users, currentUser, sendMessage, markChatAsRead } = useAppContext();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find(c => c.userId === selectedChatId);
  const otherUser = users.find(u => u.id === selectedChatId);

  useEffect(() => {
    if (selectedChatId) {
      const chat = chats.find(c => c.userId === selectedChatId);
      if (chat && chat.unreadCount > 0) {
        markChatAsRead(selectedChatId);
      }
    }
  }, [selectedChatId, chats]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChatId) return;
    sendMessage(selectedChatId, messageInput.trim());
    setMessageInput('');
  };

  const getUser = (id: string) => users.find(u => u.id === id);

  return (
    <div className="flex justify-center max-w-5xl mx-auto pt-4 sm:pt-8 px-0 sm:px-4 h-[calc(100vh-56px)] md:h-screen">
      <div className="flex w-full bg-white border border-gray-200 rounded-xl overflow-hidden h-[85vh] shadow-sm">
        
        {/* Chat List */}
        <div className={`w-full md:w-[350px] border-r border-gray-200 flex flex-col ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="h-16 border-b border-gray-200 flex items-center justify-center font-bold text-lg px-4">
            {currentUser.username}
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                <p>메시지가 없습니다.</p>
              </div>
            ) : (
              chats.slice().sort((a, b) => {
                const aLast = a.messages[a.messages.length - 1]?.timestamp || 0;
                const bLast = b.messages[b.messages.length - 1]?.timestamp || 0;
                return bLast - aLast;
              }).map(chat => {
                const u = getUser(chat.userId);
                if (!u) return null;
                const lastMsg = chat.messages[chat.messages.length - 1];
                
                return (
                  <div 
                    key={chat.userId}
                    onClick={() => setSelectedChatId(chat.userId)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChatId === chat.userId ? 'bg-gray-100' : ''}`}
                  >
                    <img referrerPolicy="no-referrer" src={u.avatar} alt={u.username} className="w-14 h-14 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{u.username}</div>
                      <div className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-semibold text-black' : 'text-gray-500'}`}>
                        {lastMsg ? lastMsg.text : '메시지 없음'}
                      </div>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-white ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
          {selectedChatId && otherUser ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-gray-200 flex items-center px-4 gap-4">
                <button className="md:hidden" onClick={() => setSelectedChatId(null)}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <img referrerPolicy="no-referrer" src={otherUser.avatar} alt={otherUser.username} className="w-8 h-8 rounded-full object-cover cursor-pointer" onClick={() => onUserClick(otherUser.id)} />
                <div className="font-semibold cursor-pointer hover:underline" onClick={() => onUserClick(otherUser.id)}>
                  {otherUser.username}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {(selectedChat?.messages || []).map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[70%] flex flex-col">
                        <div className={`px-4 py-2 rounded-2xl ${isMe ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-gray-100 text-black rounded-bl-sm'}`}>
                          {msg.text}
                        </div>
                        {isMe && (
                          <div className="text-[10px] text-gray-400 mt-1 self-end">
                            {msg.read ? '읽음' : '전송됨'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSend} className="flex items-center gap-2 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="메시지 입력..."
                    className="w-full border border-gray-300 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-gray-400 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="absolute right-2 p-2 text-blue-500 disabled:text-blue-200 font-semibold transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mb-4">
                <Send className="w-12 h-12 text-black ml-2" />
              </div>
              <h2 className="text-xl text-black font-semibold mb-2">내 메시지</h2>
              <p>친구나 그룹에 비공개 사진과 메시지를 보내보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
