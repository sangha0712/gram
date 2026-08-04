import React from 'react';
import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, Menu, Instagram } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Layout({
  children,
  onNavigate,
  currentView,
  onOpenCreate
}: {
  children: React.ReactNode,
  onNavigate: (view: 'home' | 'profile', userId?: string) => void,
  currentView: string,
  onOpenCreate: () => void
}) {
  const { currentUser } = useAppContext();

  const NavItem = ({ icon: Icon, label, isActive, onClick, className = '' }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full group ${isActive ? 'font-bold' : ''} ${className}`}
    >
      <Icon className={`w-6 h-6 group-hover:scale-105 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
      <span className="hidden xl:block text-base">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar (Desktop) */}
      <nav className="hidden md:flex flex-col border-r border-gray-200 px-3 py-8 w-[72px] xl:w-[244px] fixed h-screen bg-white z-40">
        <div className="px-3 pb-8 pt-2 mb-2 cursor-pointer transition-transform hover:scale-105 inline-block w-fit" onClick={() => onNavigate('home')}>
          <Instagram className="w-6 h-6 xl:hidden" />
          <div className="hidden xl:block font-serif text-2xl font-bold tracking-tight">Gram</div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <NavItem icon={Home} label="홈" isActive={currentView === 'home'} onClick={() => onNavigate('home')} />
          <NavItem icon={Search} label="검색" />
          <NavItem icon={Compass} label="탐색" />
          <NavItem icon={Film} label="릴스" />
          
          <NavItem icon={Heart} label="알림" />
          <NavItem icon={PlusSquare} label="만들기" onClick={onOpenCreate} />
          
          <button
            onClick={() => onNavigate('profile', currentUser.id)}
            className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full mt-2 group`}
          >
            <img referrerPolicy="no-referrer"
              src={currentUser.avatar}
              alt={currentUser.username}
              className={`w-6 h-6 rounded-full object-cover group-hover:scale-105 transition-transform ${currentView === 'profile' ? 'border-2 border-black' : 'border border-gray-300'}`}
            />
            <span className={`hidden xl:block text-base ${currentView === 'profile' ? 'font-bold' : ''}`}>프로필</span>
          </button>
        </div>

        <NavItem icon={Menu} label="더보기" className="mt-auto" />
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-[72px] xl:ml-[244px] pb-16 md:pb-0 min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-gray-200 bg-white sticky top-0 z-40">
          <div className="font-serif text-xl font-bold tracking-tight cursor-pointer" onClick={() => onNavigate('home')}>Gram</div>
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6" />
          </div>
        </header>

        {children}
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full h-12 border-t border-gray-200 bg-white flex items-center justify-around z-40">
        <button onClick={() => onNavigate('home')} className="p-2 transition-transform active:scale-95">
          <Home className={`w-6 h-6 ${currentView === 'home' ? 'stroke-[2.5]' : ''}`} />
        </button>
        <button className="p-2 transition-transform active:scale-95">
          <Search className="w-6 h-6" />
        </button>
        <button onClick={onOpenCreate} className="p-2 transition-transform active:scale-95">
          <PlusSquare className="w-6 h-6" />
        </button>
        <button className="p-2 transition-transform active:scale-95">
          <Film className="w-6 h-6" />
        </button>
        <button onClick={() => onNavigate('profile', currentUser.id)} className="p-2 transition-transform active:scale-95">
          <img referrerPolicy="no-referrer"
            src={currentUser.avatar}
            alt="Profile"
            className={`w-6 h-6 rounded-full object-cover ${currentView === 'profile' ? 'border-2 border-black' : 'border border-gray-300'}`}
          />
        </button>
      </nav>
    </div>
  );
}
