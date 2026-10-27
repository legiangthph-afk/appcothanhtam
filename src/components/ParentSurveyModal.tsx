import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  HelpCircle,
  Star,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PRE_SURVEY_QUESTIONS, POST_SURVEY_QUESTIONS } from '../data/surveyQuestions';
import { saveSurvey, getChildNickname } from '../utils/storage';

interface ParentSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentSurveyModal: React.FC<ParentSurveyModalProps> = ({ isOpen, onClose }) => {
  const [surveyType, setSurveyType] = useState<'pre' | 'post'>('post');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [participantCode] = useState(() => 'PH-' + Math.floor(1000 + Math.random() * 9000));

  if (!isOpen) return null;

  const currentQuestions = surveyType === 'pre' ? PRE_SURVEY_QUESTIONS : POST_SURVEY_QUESTIONS;

  const handleSelectOption = (questionId: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSurvey({
      type: surveyType,
      participantCode,
      answers,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-100 text-amber-700 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Khảo sát ý kiến Phụ huynh Lớp 1
              </h3>
              <p className="text-[11px] text-slate-500">
                Mã tham gia ẩn danh: <span className="font-mono font-bold text-slate-700">{participantCode}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Survey Type Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setSurveyType('pre');
                  setAnswers({});
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  surveyType === 'pre' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                1. Khảo sát ĐẦU VÀO
              </button>
              <button
                type="button"
                onClick={() => {
                  setSurveyType('post');
                  setAnswers({});
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  surveyType === 'post' ? 'bg-[#20B8A6] text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                2. Đánh giá SAU KHI DÙNG
              </button>
            </div>

            <p className="text-xs text-slate-600 bg-teal-50/70 p-2.5 rounded-xl border border-teal-200">
              {surveyType === 'pre'
                ? 'Bố mẹ vui lòng dành 1 phút chia sẻ những khó khăn ban đầu khi kèm con học tại nhà.'
                : 'Bố mẹ đánh giá mức độ hữu ích của ứng dụng sau khi đã trải nghiệm đồng hành cùng con.'}
            </p>

            {/* Questions list */}
            <div className="space-y-4">
              {currentQuestions.map((q) => (
                <div key={q.id} className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">
                    {q.question}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {q.options.map((opt, idx) => {
                      const isSelected = answers[q.id] === opt.score;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.score)}
                          className={`p-2 rounded-xl text-left text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-300'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Đã trả lời: {Object.keys(answers).length}/{currentQuestions.length} câu
              </span>
              <button
                type="submit"
                disabled={Object.keys(answers).length < currentQuestions.length}
                className="bg-[#173A63] hover:bg-slate-900 disabled:opacity-40 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                GỬI PHIẾU KHẢO SÁT
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Trân trọng cảm ơn quý phụ huynh!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Ý kiến quý báu của bố/mẹ đã được ghi nhận vào kho dữ liệu thực nghiệm đề tài giáo dục của Cô Nguyễn Thị Thanh Tâm (Trường TH Hoà Sơn) để tiếp tục hoàn thiện ứng dụng phục vụ cộng đồng.
            </p>
            <button
              onClick={onClose}
              className="bg-[#20B8A6] hover:bg-teal-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              Quay lại ứng dụng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
