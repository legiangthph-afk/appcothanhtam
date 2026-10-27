import React, { useState } from 'react';
import {
  Lightbulb,
  Clock,
  Heart,
  BookOpen,
  Volume2,
  VolumeX,
  Bookmark,
  Sparkles,
  MessageCircle,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { PARENT_TIPS } from '../data/parentTips';
import { ParentTip } from '../types';
import { speechManager } from '../utils/speech';

export const ParentTips: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [savedTips, setSavedTips] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'Tất cả 15 mẹo' },
    { id: 'thoi-gian', label: 'Ít thời gian' },
    { id: 'tam-ly', label: 'Tâm lý bé 6 tuổi' },
    { id: 'phuong-phap', label: 'Phương pháp dạy' },
    { id: 'cong-nhan', label: 'Bố mẹ đi làm ca' },
  ];

  const filteredTips = PARENT_TIPS.filter((tip) => {
    return selectedCat === 'all' || tip.category === selectedCat;
  });

  const handleToggleSpeak = (tip: ParentTip) => {
    if (speakingId === tip.id) {
      speechManager.stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(tip.id);
      const textToSpeak = `${tip.title}. ${tip.shortDesc}. Bố mẹ có thể nói: ${tip.parentScript}. Áp dụng ngay: ${tip.applyImmediately}.`;
      speechManager.speak(textToSpeak).finally(() => setSpeakingId(null));
    }
  };

  const handleToggleBookmark = (id: string) => {
    if (savedTips.includes(id)) {
      setSavedTips(savedTips.filter((item) => item !== id));
    } else {
      setSavedTips([...savedTips, id]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Title */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1e4c84] rounded-2xl p-4 sm:p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-[#FFBE45] text-slate-900 rounded-lg">
            <Lightbulb className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">MẸO ĐỒNG HÀNH CÙNG CON</h2>
        </div>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
          "Bố mẹ bận rộn – Vẫn cùng con tiến bộ": 15 bài học ngắn gọn, thực tế, ngôn ngữ gần gũi, không gây cảm giác tội lỗi cho cha mẹ đi làm ca.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
              selectedCat === c.id
                ? 'bg-[#173A63] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tips Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => {
          const isSpeaking = speakingId === tip.id;
          const isBookmarked = savedTips.includes(tip.id);

          return (
            <div
              key={tip.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-[#20B8A6] font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {tip.order}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                      {tip.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleBookmark(tip.id)}
                    className="text-slate-400 hover:text-amber-500 p-1"
                    title="Lưu mẹo này"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`}
                    />
                  </button>
                </div>

                {/* Short description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tip.shortDesc}
                </p>

                {/* Example */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">Ví dụ cụ thể:</span>
                  {tip.example}
                </div>

                {/* Parent Script */}
                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 text-xs text-amber-950">
                  <span className="font-bold block mb-1 flex items-center gap-1 text-amber-800">
                    <MessageCircle className="w-3.5 h-3.5 text-amber-600" />
                    Bố mẹ có thể thủ thỉ với con:
                  </span>
                  <p className="italic font-medium">{tip.parentScript}</p>
                </div>

                {/* 1 thing to apply immediately */}
                <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                  <span className="font-bold block mb-0.5 text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Một việc áp dụng ngay hôm nay:
                  </span>
                  <p className="font-medium">{tip.applyImmediately}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleSpeak(tip)}
                  className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                    isSpeaking
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Nghe mẹo này'}</span>
                </button>

                <span className="text-[10px] text-slate-400 capitalize">
                  {tip.category === 'thoi-gian'
                    ? 'Quản lý thời gian'
                    : tip.category === 'tam-ly'
                    ? 'Tâm lý lớp 1'
                    : tip.category === 'cong-nhan'
                    ? 'Phụ huynh đi làm ca'
                    : 'Phương pháp sư phạm'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
