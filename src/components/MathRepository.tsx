import React, { useState } from 'react';
import {
  Calculator,
  Search,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Sparkles,
  Gamepad2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
} from 'lucide-react';
import { MATH_TOPICS } from '../data/mathTopics';
import { MathTopic, PracticeQuestion } from '../types';
import { speechManager } from '../utils/speech';

export const MathRepository: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTopicId, setExpandedTopicId] = useState<string>('toan-01');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // AI Worksheet Generator Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedLesson, setAiGeneratedLesson] = useState<any>(null);
  const [customRequest, setCustomRequest] = useState('');

  const categories = [
    { id: 'all', label: 'Tất cả 12 bài' },
    { id: 'Số và phép tính cơ bản', label: 'Số cơ bản' },
    { id: 'Quan hệ so sánh', label: 'So sánh' },
    { id: 'Bản chất phép tính', label: 'Tách gộp' },
    { id: 'Phép tính', label: 'Cộng & Trừ' },
    { id: 'Hình học và đo lường', label: 'Hình học' },
    { id: 'Tư duy logic', label: 'Quy luật' },
  ];

  const filteredTopics = MATH_TOPICS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.target.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleRevealAnswer = (qId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleToggleSpeak = (topic: MathTopic) => {
    if (speakingId === topic.id) {
      speechManager.stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(topic.id);
      const textToSpeak = `Bài ${topic.order}: ${topic.title}. Hướng dẫn phụ huynh: ${topic.parentGuide}. Ví dụ: ${topic.simpleExample}.`;
      speechManager.speak(textToSpeak).finally(() => setSpeakingId(null));
    }
  };

  // Generate new lesson with AI
  const handleGenerateAiLesson = async () => {
    setAiGenerating(true);
    setAiGeneratedLesson(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Hãy biên soạn 1 bài học Toán lớp 1 hoàn toàn mới cho con: "${customRequest || 'Cộng trừ thực tế với nắp chai'}" kèm 3 hoạt động và 5 câu hỏi có đáp án kiểm tra cho phụ huynh.`,
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setAiGeneratedLesson(data.reply);
    } catch {
      setAiGeneratedLesson(`### 1. BỐ MẸ CẦN BIẾT
Bài học này giúp con áp dụng phép tính vào đời sống thực tế thông qua việc đếm hoa quả và chia sẻ bánh kẹo.

### 2. HƯỚNG DẪN TỪNG BƯỚC
- **Bước 1:** Bố mẹ bày 4 chiếc bánh quy lên đĩa.
- **Bước 2:** Đố con: Mẹ có 4 chiếc bánh, chia cho con 2 chiếc, mẹ còn mấy chiếc?
- **Bước 3:** Cho con tự tay cầm 2 chiếc bánh di chuyển sang đĩa của mình.

### 3. BỐ MẸ CÓ THỂ NÓI VỚI CON
"Bánh quy hôm nay ngon quá, con chia đều giúp mẹ với nhé!"

### 4. THỬ NGAY TRONG 5 PHÚT
Đố 3 phép tính nhanh: 3 + 3, 5 - 2, 4 + 1 bằng hạt đậu.

### 5. LỜI KHUYÊN & LƯU Ý
Khen ngợi nỗ lực chia sẻ và tính toán của con.`);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Title */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1d4c82] rounded-2xl p-4 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-[#20B8A6] rounded-lg">
              <Calculator className="w-5 h-5 text-white" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">KHO HỌC LIỆU TOÁN LỚP 1</h2>
          </div>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            12 chủ đề chuẩn sư phạm tiểu học. Mỗi bài đều có hướng dẫn dễ hiểu, câu hỏi luyện tập và đáp án dành riêng cho bố mẹ.
          </p>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="bg-[#FFBE45] hover:bg-amber-400 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>TẠO BÀI HỌC CHO CON VỚI AI</span>
        </button>
      </div>

      {/* Search & Categories */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm bài học: Đếm số, tách gộp, phép cộng, hình vuông..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
        </div>

        {/* Category tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#173A63] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topics list */}
      <div className="space-y-3">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedTopicId === topic.id;
          const isSpeaking = speakingId === topic.id;

          return (
            <div
              key={topic.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isExpanded ? 'border-teal-300 shadow-md ring-1 ring-teal-200' : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedTopicId(isExpanded ? '' : topic.id)}
                className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#20B8A6] font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {topic.order}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                      {topic.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      {topic.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {topic.questions.length} câu hỏi
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-fade-in">
                  {/* Actions & Target */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-teal-50/70 p-3 rounded-xl border border-teal-200">
                    <p className="text-xs text-teal-950 font-medium">
                      🎯 <span className="font-bold">Mục tiêu:</span> {topic.target}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSpeak(topic);
                      }}
                      className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                        isSpeaking
                          ? 'bg-rose-100 text-rose-700 animate-pulse'
                          : 'bg-white text-teal-700 border border-teal-300 hover:bg-teal-100'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Dừng đọc' : 'Nghe hướng dẫn'}</span>
                    </button>
                  </div>

                  {/* Parent Guide & Simple Example */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#20B8A6]" />
                        Hướng dẫn dành cho bố mẹ
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {topic.parentGuide}
                      </p>
                    </div>

                    <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 shadow-2xs">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Ví dụ siêu dễ hiểu
                      </h4>
                      <p className="text-xs text-amber-950 leading-relaxed">
                        {topic.simpleExample}
                      </p>
                    </div>
                  </div>

                  {/* 3 Activities */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      3 Hoạt động thực hành cùng con:
                    </h4>
                    <div className="space-y-1.5">
                      {topic.activities.map((act: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-[#173A63] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1 Real Object Game */}
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4 text-emerald-600" />
                      Trò chơi: {topic.game.name}
                    </h4>
                    <p className="text-xs text-emerald-950 mb-1">{topic.game.description}</p>
                    <span className="text-[11px] text-emerald-800 font-semibold">
                      Đồ dùng: {topic.game.materials}
                    </span>
                  </div>

                  {/* 5 Practice Questions with reveal answer */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span>5 Câu hỏi đố con luyện tập:</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (Nhấn để hiện đáp án cho bố mẹ kiểm tra)
                      </span>
                    </h4>

                    <div className="space-y-2">
                      {topic.questions.map((q, qIdx) => {
                        const isRevealed = revealedAnswers[q.id];
                        return (
                          <div
                            key={q.id}
                            className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-slate-900">
                                Câu {qIdx + 1}: {q.question}
                              </span>
                              <button
                                onClick={() => toggleRevealAnswer(q.id)}
                                className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex-shrink-0"
                              >
                                {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                <span>{isRevealed ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
                              </button>
                            </div>

                            <p className="text-[11px] text-slate-500 italic">Gợi ý gợi mở: {q.hint}</p>

                            {isRevealed && (
                              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-900 font-mono text-xs font-semibold animate-fade-in border border-emerald-200">
                                ✅ Đáp án kiểm tra: {q.parentAnswer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Common mistakes & Solutions */}
                  <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200/80">
                    <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Lỗi con dễ mắc & Cách bố mẹ hỗ trợ
                    </h4>
                    <p className="text-xs text-rose-950 font-medium">⚠️ {topic.commonMistakes}</p>
                    <p className="text-xs text-slate-700 mt-1">💡 {topic.howToHelp}</p>
                  </div>

                  {/* 5-min & 10-min lesson plans */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-100 p-2.5 rounded-xl">
                      <span className="font-bold text-slate-800 block mb-0.5">⏱️ Kèm nhanh 5 phút:</span>
                      <p className="text-slate-600">{topic.fiveMinPlan}</p>
                    </div>
                    <div className="bg-slate-100 p-2.5 rounded-xl">
                      <span className="font-bold text-slate-800 block mb-0.5">⏱️ Kèm vừa đủ 10 phút:</span>
                      <p className="text-slate-600">{topic.tenMinPlan}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Lesson Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900">Tạo bài học mới cho con với AI</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Phụ huynh không cần biết câu lệnh phức tạp. Bố mẹ chỉ cần nhập chủ đề mong muốn hoặc bấm tạo ngay để AI tự động thiết kế một bài học 10 phút trực quan:
            </p>

            <input
              type="text"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="Ví dụ: Đếm quả cam, phép trừ khi đi siêu thị, hình vuông..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <button
              onClick={handleGenerateAiLesson}
              disabled={aiGenerating}
              className="w-full bg-[#173A63] hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {aiGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>AI đang thiết kế bài học...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>BẮT ĐẦU TẠO BÀI HỌC</span>
                </>
              )}
            </button>

            {aiGeneratedLesson && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                {aiGeneratedLesson}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
