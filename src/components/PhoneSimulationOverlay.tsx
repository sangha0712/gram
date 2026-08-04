import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { AlertTriangle, Thermometer, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PhoneSimulationOverlay() {
  const { phoneState, setPhoneState, triggerShutdown, turnOnPhone } = useAppContext();
  const [showThermometerAlert, setShowThermometerAlert] = useState(false);
  const thermometerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Automatically trigger shutdown 2.5 seconds after warning state is reached
  useEffect(() => {
    if (phoneState !== 'warning') return;

    const timer = setTimeout(() => {
      triggerShutdown();
    }, 2500);

    return () => clearTimeout(timer);
  }, [phoneState]);

  // Handle clicking the black screen in 'off' state
  const handleOffScreenClick = () => {
    if (phoneState !== 'off') return;

    // Show overheat/thermometer caution animation for 3 seconds
    setShowThermometerAlert(true);
    
    if (thermometerTimeoutRef.current) {
      clearTimeout(thermometerTimeoutRef.current);
    }
    
    thermometerTimeoutRef.current = setTimeout(() => {
      setShowThermometerAlert(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (thermometerTimeoutRef.current) clearTimeout(thermometerTimeoutRef.current);
    };
  }, []);

  if (phoneState === 'on') return null;

  return (
    <div className="fixed inset-0 z-[1000] select-none font-sans overflow-hidden">
      <AnimatePresence>
        {/* 1. WARNING POPUP (Samsung One UI 6 Overheat Dialog) */}
        {phoneState === 'warning' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-5"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 370 }}
              className="bg-white w-full max-w-[350px] rounded-[32px] overflow-hidden shadow-2xl flex flex-col pt-8 border border-gray-100"
            >
              {/* Thermometer Icon Container */}
              <div className="w-[84px] h-[84px] bg-[#FFF0EF] rounded-full flex items-center justify-center relative mb-6 mx-auto animate-pulse">
                {/* Thermometer Icon */}
                <svg className="w-[42px] h-[42px] text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 14.76V3.5C14 2.39543 13.1046 1.5 12 1.5C10.8954 1.5 10 2.39543 10 3.5V14.76C8.83538 15.4293 8 16.6666 8 18C8 20.2091 9.79086 22 12 22C14.2091 22 16 20.2091 16 18C16 16.6666 15.1646 15.4293 14 14.76Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M12 6V18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="12" cy="18" r="2" fill="currentColor" />
                </svg>
                {/* Exclamation Badge */}
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-red-600 rounded-full border-[3px] border-white flex items-center justify-center text-white text-[14px] font-black shadow-sm">
                  !
                </div>
              </div>

              {/* Title */}
              <h2 className="text-[21px] font-bold text-[#111] tracking-tight mb-3 text-center px-6">
                휴대전화가 과열되었습니다
              </h2>

              {/* Content */}
              <div className="text-[15.5px] text-[#5F6368] leading-relaxed text-center px-6 mb-7 flex flex-col gap-1">
                <p>휴대전화를 보호하기 위해 전원이 끼집니다.</p>
                <p>은도가 내려간 후 다시 켜 주세요</p>
              </div>

              {/* Divider */}
              <div className="w-full border-t border-[#EAEAEA]" />

              {/* Actions (One UI Blue confirmation button) */}
              <button 
                className="w-full py-4 text-center text-[#1A57DB] hover:bg-gray-50 active:bg-gray-100 font-semibold text-[17.5px] tracking-wide transition-colors outline-none rounded-b-[32px]"
                onClick={triggerShutdown}
              >
                확언
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* 2. SHUTTING DOWN SCREEN */}
        {phoneState === 'shutting_down' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Spinning Loader & Powering off status */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400 mt-4 tracking-wider animate-pulse">전원 끄는 중...</p>
              </div>
              
              {/* Subtle Galaxy branding fade-in */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-center absolute bottom-16 flex flex-col items-center"
              >
                <span className="text-sm tracking-[0.3em] font-semibold text-white">SAMSUNG</span>
                <span className="text-xs text-gray-400 tracking-wider font-light mt-1">Galaxy</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* 3. PHONE IS OFF (PITCH BLACK SCREEN with Overheat interactions) */}
        {phoneState === 'off' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOffScreenClick}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white cursor-pointer"
          >
            {/* Overheating indicator on click */}
            <AnimatePresence mode="wait">
              {showThermometerAlert && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="flex flex-col items-center justify-center p-6 text-center max-w-xs"
                >
                  <div className="w-16 h-16 bg-red-950/40 border border-red-500/30 rounded-full flex items-center justify-center mb-4 text-red-500 animate-bounce">
                    <Thermometer className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">과열로 기기를 켤 수 없음</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    휴대전화 온도가 여전히 위험 수준입니다. 충분히 식기 전까지는 기기를 켤 수 없습니다.
                  </p>
                  <div className="mt-3 text-xs text-red-500 bg-red-950/20 px-3 py-1 rounded-full border border-red-900/30">
                    심각한 기기 손상 방지 활성화됨
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showThermometerAlert && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="text-center text-gray-600 text-xs tracking-wider absolute bottom-12"
              >
                화면을 탭하면 기기 상태를 확인합니다
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 4. BOOTING SCREEN (Galaxy Boot Sequence) */}
        {phoneState === 'booting' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white"
          >
            <div className="flex flex-col items-center text-center max-w-sm">
              {/* Samsung Galaxy Logo */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center mb-4"
              >
                <h1 className="text-xl tracking-[0.3em] font-bold text-white mb-1">SAMSUNG</h1>
                <p className="text-sm text-gray-300 font-light tracking-widest">Galaxy</p>
              </motion.div>

              {/* Glowing active animation with Framer Motion */}
              <div className="w-40 h-1 bg-gray-800 rounded-full overflow-hidden mt-6">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "150%" }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="h-full w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
                />
              </div>

              <p className="text-xs text-gray-500 mt-4 tracking-wider animate-pulse">시스템 최적화 중...</p>

              {/* Secured by Knox */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1 }}
                className="absolute bottom-16 flex flex-col items-center"
              >
                <span className="text-[10px] tracking-wider text-gray-400 uppercase font-semibold">Secured by Knox</span>
                <span className="text-[11px] text-gray-500 font-light mt-1.5">Powered by android</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
