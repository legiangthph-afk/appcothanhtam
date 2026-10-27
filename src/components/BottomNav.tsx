import React from 'react';
import { Home, Clock, MessageSquare, Camera, BarChart2 } from 'lucide-react';

export type TabType = 'home' | 'session' | 'chat' | 'camera' | 'math' | 'vietnamese' | 'tips' | 'progress' | 'teacher';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Trang chủ', icon: Home },
    { id: 'session' as TabType, label: 'Kèm 10 phút', icon: Clock },
    { id: 'chat' as TabType, label: 'Hỏi AI', icon: MessageSquare, highlight: true },
    { id: 'camera' as TabType, label: 'Chụp bài', icon: Camera },
    { id: 'progress' as TabType, label: 'Tiến độ', icon: BarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] max-w-5xl mx-auto">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="flex flex-col items-center justify-center -mt-5 focus:outline-none group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform transform active:scale-95 ${
                    isActive
                      ? 'bg-[#20B8A6] text-white ring-4 ring-teal-100'
                      : 'bg-[#173A63] text-white hover:bg-slate-800 ring-2 ring-white'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[11px] font-bold mt-1 ${
                    isActive ? 'text-[#20B8A6]' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative ${
                isActive ? 'text-[#173A63]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#20B8A6] rounded-full"></span>
              )}
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] ${isActive ? 'font-bold text-[#173A63]' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
