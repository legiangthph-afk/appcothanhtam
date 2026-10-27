import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Gamepad2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { VIETNAMESE_TOPICS } from '../data/vietnameseTopics';
import { VietnameseTopic } from '../types';
import { speechManager } from '../utils/speech';

export const VietnameseRepository: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTextbook, setSelectedTextbook] = useState<string>('all');
  const [expandedTopicId, setExpandedTopicId] = useState<string>('tv-01');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [activeFlashcard, setActiveFlashcard] = useState<string | null>(null);

  const textbooks = [
    { id: 'all', label: 'Tất cả 12 bài' },
    { id: 'Kết nối tri thức', label: 'Kết nối tri thức' },
    { id: 'Cánh diều', label: 'Cánh diều' },
    { id: 'Chân trời sáng tạo', label: 'Chân trời sáng tạo' },
    { id: 'Chung (chuẩn Bộ GD&ĐT)', label: 'Chuẩn Bộ GD&ĐT' },
  ];

  const filteredTopics = VIETNAMESE_TOPICS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.target.toLowerCase().includes(search.toLowerCase());
    const matchesBook =
      selectedTextbook === 'all' ||
      (t.textbookAlignment && t.textbookAlignment.includes(selectedTextbook));
    return matchesSearch && matchesBook;
  });

  const handleToggleSpeak = (topic: VietnameseTopic) => {
    if (speakingId === topic.id) {
      speechManager.stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(topic.id);
      const textToSpeak = `Bài ${topic.order}: ${topic.title}. Hướng dẫn phát âm: ${topic.pronunciationNotes}. Câu mẫu: ${topic.sampleSentences.join(', ')}.`;
      speechManager.speak(textToSpeak).finally(() => setSpeakingId(null));
    }
  };

  const handleSpeakWord = (word: string) => {
    setActiveFlashcard(word);
    speechManager.speak(word);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Title */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1d4c82] rounded-2xl p-4 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-[#20B8A6] rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">KHO HỌC LIỆU TIẾNG VIỆT LỚP 1</h2>
          </div>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            12 bài học trọng tâm: Từ nhận diện âm chữ cái, phân biệt b/d, ghép vần, đọc tiếng, đọc câu ngắn đến kỹ năng kể chuyện theo tranh.
          </p>
        </div>

        <div className="bg-white/10 px-3 py-2 rounded-xl text-[11px] text-teal-200 border border-white/10">
          Chỉ dẫn sách giáo khoa: Kết nối tri thức, Chân trời, Cánh diều
        </div>
      </div>

      {/* Search & Textbook Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm bài học: Bảng chữ cái, phân biệt b/d, ghép âm, dấu thanh, luyện viết..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
        </div>

        {/* Textbook selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {textbooks.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setSelectedTextbook(tb.id)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedTextbook === tb.id
                  ? 'bg-[#173A63] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topics List */}
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
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                        {topic.category}
                      </span>
                      {topic.textbookAlignment && (
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {topic.textbookAlignment}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      {topic.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {topic.flashcardWords.length} thẻ từ
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
                  {/* Target & Listen button */}
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
                      <span>{isSpeaking ? 'Dừng đọc' : 'Nghe phát âm chuẩn'}</span>
                    </button>
                  </div>

                  {/* Parent Guide & Pronunciation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#20B8A6]" />
                        Phương pháp hướng dẫn con
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {topic.parentGuide}
                      </p>
                    </div>

                    <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 shadow-2xs">
                      <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                        Cách phát âm chuẩn khẩu hình
                      </h4>
                      <p className="text-xs text-blue-950 leading-relaxed">
                        {topic.pronunciationNotes}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Flashcards */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-teal-600" />
                        Thẻ từ ngữ & âm vần (Chạm vào để nghe phát âm)
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Phát âm tiếng Việt
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {topic.flashcardWords.map((word, wIdx) => {
                        const isSpeakingThis = activeFlashcard === word;
                        return (
                          <button
                            key={wIdx}
                            onClick={() => handleSpeakWord(word)}
                            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all active:scale-95 flex items-center gap-1.5 ${
                              isSpeakingThis
                                ? 'bg-[#20B8A6] text-white border-teal-500 shadow-xs'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                            }`}
                          >
                            <span>{word}</span>
                            <Volume2 className="w-3 h-3 opacity-60" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Open Questions & Quick Game */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        Câu hỏi gợi mở bố mẹ hỏi con
                      </h4>
                      <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside">
                        {topic.openQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Gamepad2 className="w-4 h-4 text-emerald-600" />
                        Trò chơi 5-10 phút: {topic.quickGame.name}
                      </h4>
                      <p className="text-xs text-emerald-950 leading-relaxed">
                        {topic.quickGame.howToPlay}
                      </p>
                    </div>
                  </div>

                  {/* Sample Reading Sentences */}
                  <div className="bg-slate-100 p-3.5 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      📖 Câu ngắn thực hành đọc trơn:
                    </h4>
                    <div className="space-y-1">
                      {topic.sampleSentences.map((s, idx) => (
                        <p key={idx} className="text-xs sm:text-sm font-semibold text-slate-800">
                          • {s}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Slow Reader Advice & Things to Avoid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-purple-950">
                      <span className="font-bold block mb-1">🐢 Khi con đọc chậm:</span>
                      <p>{topic.slowReaderAdvice}</p>
                    </div>

                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-950">
                      <span className="font-bold block mb-1">🚫 Điều cần tránh:</span>
                      <p>{topic.thingsToAvoid}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
