import React from 'react';
import {
  MessageSquare,
  Camera,
  Clock,
  Calculator,
  BookOpen,
  Lightbulb,
  BarChart2,
  ShieldCheck,
  Sparkles,
  Heart,
  School,
  Moon,
  Gamepad2,
} from 'lucide-react';
import { TabType } from './BottomNav';
import { getChildNickname } from '../utils/storage';

interface HomeScreenProps {
  onNavigate: (tab: TabType) => void;
  onOpenShiftModal: () => void;
  onOpenSurveyModal: () => void;
  onOpenTeacherCorner: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenShiftModal,
  onOpenSurveyModal,
  onOpenTeacherCorner,
}) => {
  const childName = getChildNickname();

  const mainButtons = [
    {
      id: 'chat' as TabType,
      title: '1. HỎI AI NGAY',
      subtitle: 'Trợ lý Bạn Đồng Hành AI giải đáp sư phạm 24/7',
      icon: MessageSquare,
      bgColor: 'bg-gradient-to-br from-[#173A63] to-[#1f4e85]',
      textColor: 'text-white',
      badge: 'Chức năng cốt lõi',
      badgeColor: 'bg-[#FFBE45] text-slate-950',
    },
    {
      id: 'camera' as TabType,
      title: '2. CHỤP BÀI CON CHƯA HIỂU',
      subtitle: 'Chụp ảnh bài tập, AI hướng dẫn phương pháp dạy',
      icon: Camera,
      bgColor: 'bg-gradient-to-br from-[#20B8A6] to-[#0f9488]',
      textColor: 'text-white',
      badge: 'Thị giác AI',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      id: 'session' as TabType,
      title: '3. KÈM CON TRONG 10 PHÚT',
      subtitle: '5, 10 hoặc 15 phút có đồng hồ đếm ngược',
      icon: Clock,
      bgColor: 'bg-gradient-to-br from-[#FFBE45] to-[#f59e0b]',
      textColor: 'text-slate-950',
      badge: 'Khuyên dùng',
      badgeColor: 'bg-[#173A63] text-white',
    },
    {
      id: 'math' as TabType,
      title: '4. KHO HỌC LIỆU TOÁN',
      subtitle: '12 chủ đề chuẩn lớp 1: Đếm số, tách gộp, cộng trừ',
      icon: Calculator,
      bgColor: 'bg-white',
      textColor: 'text-slate-800',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-50 text-[#20B8A6]',
      badge: '12 bài mẫu',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'vietnamese' as TabType,
      title: '5. KHO HỌC LIỆU TIẾNG VIỆT',
      subtitle: '12 bài: Chữ cái, b/d, âm vần, đọc câu, kể chuyện',
      icon: BookOpen,
      bgColor: 'bg-white',
      textColor: 'text-slate-800',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-50 text-blue-600',
      badge: '3 bộ sách GK',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'tips' as TabType,
      title: '6. MẸO ĐỒNG HÀNH CÙNG CON',
      subtitle: '15 bài học thực tế cho cha mẹ bận rộn, làm ca',
      icon: Lightbulb,
      bgColor: 'bg-white',
      textColor: 'text-slate-800',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600',
      badge: '15 mẹo ngắn',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'progress' as TabType,
      title: '7. TIẾN ĐỘ CỦA GIA ĐÌNH',
      subtitle: 'Nhật ký học tập & các bài con cần ôn lại',
      icon: BarChart2,
      bgColor: 'bg-white',
      textColor: 'text-slate-800',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-50 text-purple-600',
      badge: 'Hành trình',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'teacher' as TabType,
      title: '8. GÓC GIÁO VIÊN',
      subtitle: 'Quản trị học liệu, FAQ chuẩn & Báo cáo đề tài',
      icon: ShieldCheck,
      bgColor: 'bg-white',
      textColor: 'text-slate-800',
      borderColor: 'border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      badge: 'Cô Thanh Tâm',
      badgeColor: 'bg-slate-200 text-slate-800',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Friendly Hero Banner */}
      <div className="bg-gradient-to-br from-[#173A63] via-[#1b4372] to-[#0d7377] rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full text-xs text-amber-300 font-semibold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#FFBE45]" />
            <span>Ít thời gian – Đúng phương pháp – Con tiến bộ mỗi ngày</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Chào bố mẹ! Hôm nay mình cùng <span className="text-[#FFBE45] underline decoration-wavy decoration-teal-400">{childName}</span> học gì nhé?
          </h2>

          <p className="text-xs sm:text-sm text-teal-100 max-w-xl leading-relaxed">
            Chỉ cần <strong>10 phút mỗi ngày</strong>, bố mẹ không cần lo lắng mình chưa nắm phương pháp sư phạm hay không có thời gian. Ứng dụng sẽ đồng hành cùng gia đình từng bước nhỏ nhẹ nhàng!
          </p>

          {/* Quick CTA banner */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('session')}
              className="bg-[#FFBE45] hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Clock className="w-4 h-4" />
              <span>BẮT ĐẦU 10 PHÚT VỚI CON</span>
            </button>

            <button
              onClick={onOpenShiftModal}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all border border-white/10 flex items-center gap-1.5"
            >
              <Moon className="w-4 h-4 text-amber-300" />
              <span>Lịch cho Bố mẹ làm ca</span>
            </button>

            <button
              onClick={onOpenSurveyModal}
              className="bg-[#20B8A6] hover:bg-teal-500 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Khảo sát ý kiến</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 BIG ACTION BUTTONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
            Chọn chức năng bố mẹ cần dùng:
          </h3>
          <span className="text-xs text-slate-400">8 nút bấm lớn</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {mainButtons.map((btn) => {
            const Icon = btn.icon;
            const isWhite = btn.bgColor === 'bg-white';

            return (
              <button
                key={btn.id}
                onClick={() => {
                  if (btn.id === 'teacher') {
                    onOpenTeacherCorner();
                  } else {
                    onNavigate(btn.id);
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl text-left transition-all relative overflow-hidden group shadow-2xs hover:shadow-md transform active:scale-[0.98] ${
                  btn.bgColor
                } ${isWhite ? `border ${btn.borderColor}` : 'border border-white/10'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs transition-transform group-hover:scale-105 ${
                        isWhite ? btn.iconBg : 'bg-white/15 text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2px]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-black text-sm sm:text-base ${btn.textColor}`}>
                          {btn.title}
                        </h4>
                      </div>
                      <p
                        className={`text-xs mt-1 leading-snug line-clamp-2 ${
                          isWhite ? 'text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {btn.subtitle}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 ${btn.badgeColor}`}
                  >
                    {btn.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Educational Philosophy Highlight */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-teal-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h4 className="font-bold text-sm sm:text-base text-slate-900">
            Triết lý đồng hành sư phạm của ứng dụng
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700">
          <div className="bg-[#EFF9F8] p-3 rounded-xl border border-teal-100">
            <span className="font-bold text-teal-900 block mb-1">❌ Không làm bài hộ</span>
            Ứng dụng giúp bố mẹ biết cách đặt câu hỏi để con tự suy nghĩ và tự tìm ra kết quả.
          </div>
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <span className="font-bold text-amber-900 block mb-1">🥣 Dùng vật thật trong nhà</span>
            Nắp chai, que tính, hạt đậu, ngón tay... Không yêu cầu mua đồ dùng đắt tiền.
          </div>
          <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200">
            <span className="font-bold text-purple-900 block mb-1">⏱️ Chỉ 5 đến 15 phút</span>
            Ngắn gọn, không áp lực, kết thúc bằng nụ cười và lời khen nỗ lực của con.
          </div>
        </div>
      </div>

      {/* Credit & School information */}
      <div className="bg-slate-100 rounded-2xl p-4 text-center text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800 flex items-center justify-center gap-1.5">
          <School className="w-4 h-4 text-teal-600" />
          Đề tài ứng dụng giáo dục lớp 1 • Cô Nguyễn Thị Thanh Tâm
        </p>
        <p className="text-[11px] text-slate-500">
          Trường Tiểu học Hoà Sơn • Phường Hoà Khánh, TP. Đà Nẵng
        </p>
        <p className="text-[10px] text-slate-400 pt-1">
          Ứng dụng thiết kế vì cộng đồng phụ huynh học sinh tiểu học • Bảo mật và tích cực
        </p>
      </div>
    </div>
  );
};
