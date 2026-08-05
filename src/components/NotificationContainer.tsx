import React, { useEffect } from 'react';
import { useAppContext, AppNotification } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X } from 'lucide-react';

interface NotificationBannerProps {
  key?: React.Key;
  notification: AppNotification;
  onDismiss: (id: string) => void;
}

function NotificationBanner({ 
  notification, 
  onDismiss 
}: NotificationBannerProps) {
  // Auto dismiss after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onClick={() => onDismiss(notification.id)}
      className="w-full max-w-[380px] bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-3.5 flex items-start gap-3 cursor-pointer pointer-events-auto hover:bg-white transition-colors group relative"
    >
      {/* App Badge Indicator */}
      <div className="absolute top-3.5 right-4 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-gray-400 font-medium">Gram • 지금</span>
      </div>

      {/* Avatar or Icon */}
      <div className="relative shrink-0">
        <img referrerPolicy="no-referrer"
          src={notification.senderAvatar}
          alt={notification.senderName}
          className="w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm"
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
          <MessageSquare className="w-2.5 h-2.5 fill-current" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6 pt-0.5">
        <p className="text-[13.5px] font-bold text-gray-900 leading-none mb-1.5">
          {notification.senderName}
        </p>
        <p className="text-[13px] text-gray-600 leading-normal line-clamp-2 break-all">
          {notification.text}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
        className="shrink-0 p-1 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function NotificationContainer() {
  const { notifications, dismissNotification, phoneState } = useAppContext();

  // If phone is shutting down or off, don't show notifications
  if (phoneState !== 'on' && phoneState !== 'warning') return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-[60] flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <NotificationBanner
            key={notif.id}
            notification={notif}
            onDismiss={dismissNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
