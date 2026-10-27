import React, { useState } from 'react';
import { Sparkles, Clock, Heart, BookOpen, ShieldCheck, UserCheck, Moon, Sun, Smartphone } from 'lucide-react';
import { getChildNickname, saveChildNickname } from '../utils/storage';

interface NavbarProps {
  onOpenShiftModal: () => void;
  onOpenSurveyModal: () => void;
  onOpenTeacherCorner: () => void;
  currentTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenShiftModal,
  onOpenSurveyModal,
  onOpenTeacherCorner,
}) => {
  const [childName, setChildName] = useState(getChildNickname());
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(childName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      saveChildNickname(tempName.trim());
      setChildName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#173A63] text-white shadow-md">
      {/* Upper subtle bar */}
      <div className="bg-[#0f2845] px-3 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-[#20B8A6] animate-pulse"></span>
          <span className="truncate">Ít thời gian – Đúng phương pháp – Con tiến bộ mỗi ngày</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenShiftModal}
            className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded text-[11px]"
            title="Chế độ phụ huynh làm theo ca"
          >
            <Clock className="w-3 h-3" />
            <span className="hidden sm:inline">Bố mẹ làm ca</span>
            <span className="sm:hidden">Ca kíp</span>
          </button>

          <button
            onClick={onOpenTeacherCorner}
            className="flex items-center gap-1 text-teal-200 hover:text-white transition-colors bg-[#20B8A6]/20 px-2 py-0.5 rounded text-[11px]"
            title="Khu vực quản trị dành cho giáo viên"
          >
            <ShieldCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Góc Giáo viên</span>
            <span className="sm:hidden">Cô Tâm</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20B8A6] to-[#0d9488] flex items-center justify-center text-white font-black text-xl shadow-inner border border-teal-300/30">
            10'
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                CÙNG CON 10 PHÚT AI
              </h1>
              <span className="bg-[#FFBE45] text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Lớp 1
              </span>
            </div>
            <p className="text-xs text-teal-200 hidden sm:block">
              Trường Tiểu học Hoà Sơn • Đà Nẵng
            </p>
          </div>
        </div>

        {/* Child Profile chip */}
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Tên/biệt danh bé"
                className="w-24 px-1.5 py-0.5 text-xs bg-white text-slate-900 rounded outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button
                onClick={handleSaveName}
                className="text-[11px] bg-[#20B8A6] px-2 py-0.5 rounded font-medium hover:bg-teal-500"
              >
                Lưu
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempName(childName);
                setIsEditingName(true);
              }}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-all px-2.5 py-1.5 rounded-full text-xs text-white border border-white/10"
              title="Nhấn để đổi tên gọi thân mật của con"
            >
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
              <span className="font-semibold max-w-[80px] sm:max-w-[120px] truncate">{childName}</span>
            </button>
          )}

          <button
            onClick={onOpenSurveyModal}
            className="hidden md:flex items-center gap-1 bg-[#FFBE45] hover:bg-amber-400 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khảo sát ý kiến</span>
          </button>
        </div>
      </div>
    </header>
  );
};
