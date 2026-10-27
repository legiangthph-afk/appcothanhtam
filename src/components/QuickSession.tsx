import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Smile,
  Shield,
  Award,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { SubjectType, ChildProficiency, SessionPlan } from '../types';
import { MATH_TOPICS } from '../data/mathTopics';
import { VIETNAMESE_TOPICS } from '../data/vietnameseTopics';
import { saveProgressRecord, getChildNickname } from '../utils/storage';
import { speechManager } from '../utils/speech';
import { fireConfetti } from '../utils/confetti';

export const QuickSession: React.FC<{ onSessionSaved?: () => void }> = ({ onSessionSaved }) => {
  const [duration, setDuration] = useState<5 | 10 | 15>(10);
  const [subject, setSubject] = useState<SubjectType>('toan');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('toan-01');
  const [proficiency, setProficiency] = useState<ChildProficiency>('can-luyen-them');

  const [activePlan, setActivePlan] = useState<SessionPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10 * 60);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Post session review form
  const [completionStatus, setCompletionStatus] = useState<'doc-lap' | 'co-ho-tro' | 'can-luyen-them'>('co-ho-tro');
  const [parentNote, setParentNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [childName, setChildName] = useState(getChildNickname());

  // Update default selected topic when subject changes
  useEffect(() => {
    if (subject === 'toan') {
      setSelectedTopicId('toan-01');
    } else {
      setSelectedTopicId('tv-01');
    }
  }, [subject]);

  // Generate / Load default plan
  const loadPlan = async () => {
    setIsGenerating(true);
    setIsTimerRunning(false);
    setSessionCompleted(false);
    setIsSaved(false);
    setSecondsRemaining(duration * 60);
    setCurrentStepIndex(0);

    const currentTopicTitle =
      subject === 'toan'
        ? MATH_TOPICS.find((t) => t.id === selectedTopicId)?.title || 'Đếm số trong phạm vi 10'
        : VIETNAMESE_TOPICS.find((t) => t.id === selectedTopicId)?.title || 'Bảng chữ cái tiếng Việt';

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minutes: duration,
          subject: subject === 'toan' ? 'Toán lớp 1' : 'Tiếng Việt lớp 1',
          topic: currentTopicTitle,
          studentLevel:
            proficiency === 'moi-lam-quen'
              ? 'Mới làm quen'
              : proficiency === 'can-luyen-them'
              ? 'Cần luyện thêm'
              : 'Đã khá vững',
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setActivePlan(data);
    } catch {
      // Offline fallback plan
      const timeline =
        duration === 5
          ? [
              { time: 'Phút 1', title: 'Khởi động vui vẻ', detail: 'Hỏi con 1 câu đố vui hoặc đập tay nạp năng lượng.' },
              { time: 'Phút 2 - 4', title: 'Thực hành vật thật', detail: `Dùng 5 nắp chai hoặc thẻ chữ thực hành ${currentTopicTitle}.` },
              { time: 'Phút 5', title: 'Khen ngợi & Tổng kết', detail: 'Con nói 1 điều con thích nhất hôm nay.' },
            ]
          : duration === 10
          ? [
              { time: 'Phút 1 - 2', title: 'Trò chuyện & Ôn bài cũ', detail: 'Hỏi con về buổi học ở trường Hoà Sơn, tạo không khí ấm áp.' },
              { time: 'Phút 3 - 6', title: 'Nhiệm vụ chính', detail: `Cùng con thao tác 2 bài tập về ${currentTopicTitle}.` },
              { time: 'Phút 7 - 9', title: 'Trò chơi nhỏ 3 phút', detail: 'Bố mẹ đố vui phản xạ nhanh, thưởng bằng nụ cười.' },
              { time: 'Phút 10', title: 'Con giải thích lại', detail: 'Con làm "thầy giáo tí hon" giảng lại cho mẹ nghe.' },
            ]
          : [
              { time: 'Phút 1 - 3', title: 'Khởi động & Trò chơi mở đầu', detail: 'Chơi trò đố vui tìm đồ vật trong phòng khách.' },
              { time: 'Phút 4 - 9', title: 'Nhiệm vụ chính', detail: `Cùng con thực hành các tình huống của ${currentTopicTitle}.` },
              { time: 'Phút 10 - 13', title: 'Trò chơi tương tác', detail: 'Tổ chức trò chơi chiếc hộp bí mật hoặc câu cá từ ngữ.' },
              { time: 'Phút 14 - 15', title: 'Đúc kết & Khen ngợi', detail: 'Con tự đánh giá sự tiến bộ của mình.' },
            ];

      setActivePlan({
        title: `Kế hoạch ${duration} phút: ${currentTopicTitle}`,
        duration,
        target: `Giúp con tự tin với ${currentTopicTitle} không áp lực`,
        materials: ['5-10 nắp chai nhựa hoặc cúc áo', 'Giấy nháp và bút chì'],
        timeline,
        parentScript: '"Hôm nay mẹ cần sự trợ giúp của siêu nhân tí hon đây, hai mẹ con mình cùng chơi nhé!"',
        tip: 'Tập trung vào niềm vui của con, không ép buộc tốc độ.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, [duration, subject, selectedTopicId, proficiency]);

  // Countdown Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            setSessionCompleted(true);
            fireConfetti();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishEarly = () => {
    setIsTimerRunning(false);
    setSessionCompleted(true);
    fireConfetti();
  };

  const handleSaveSession = () => {
    const currentTopicTitle =
      subject === 'toan'
        ? MATH_TOPICS.find((t) => t.id === selectedTopicId)?.title || 'Toán lớp 1'
        : VIETNAMESE_TOPICS.find((t) => t.id === selectedTopicId)?.title || 'Tiếng Việt lớp 1';

    const actualMinutes = Math.max(1, Math.round((duration * 60 - secondsRemaining) / 60)) || duration;

    saveProgressRecord({
      date: new Date().toISOString().split('T')[0],
      subject,
      topicTitle: currentTopicTitle,
      durationMinutes: actualMinutes,
      status: completionStatus,
      parentNote: parentNote.trim() || undefined,
      childNickname: childName,
    });

    setIsSaved(true);
    if (onSessionSaved) onSessionSaved();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1f4e85] rounded-2xl p-4 sm:p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-[#FFBE45] text-slate-950 rounded-lg">
            <Clock className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">KÈM CON TRONG 5 – 10 – 15 PHÚT</h2>
        </div>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
          Được thiết kế riêng cho bố mẹ bận rộn: Kế hoạch chia nhỏ từng phút, có sẵn lời thoại và đồng hồ đếm ngược giúp buổi học diễn ra nhẹ nhàng, đúng giờ và không áp lực.
        </p>
      </div>

      {/* Configuration Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Duration selector */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            1. Bố mẹ có bao nhiêu thời gian hôm nay?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 5, label: '5 PHÚT', sub: 'Học nhanh' },
              { val: 10, label: '10 PHÚT', sub: 'Học vừa đủ (Khuyên dùng)' },
              { val: 15, label: '15 PHÚT', sub: 'Học & chơi vui' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setDuration(item.val as any)}
                className={`py-2.5 px-2 rounded-xl text-center border transition-all ${
                  duration === item.val
                    ? 'bg-[#173A63] text-white border-[#173A63] shadow-sm font-bold ring-2 ring-teal-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50'
                }`}
              >
                <span className="block text-sm font-bold">{item.label}</span>
                <span className="block text-[10px] opacity-80">{item.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subject & Topic selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              2. Chọn môn học:
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSubject('toan')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  subject === 'toan'
                    ? 'bg-[#20B8A6] text-white border-teal-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Toán Lớp 1
              </button>
              <button
                onClick={() => setSubject('tieng-viet')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  subject === 'tieng-viet'
                    ? 'bg-[#20B8A6] text-white border-teal-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Tiếng Việt Lớp 1
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              3. Chọn bài học / chủ đề:
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
            >
              {subject === 'toan'
                ? MATH_TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      Bài {t.order}: {t.title}
                    </option>
                  ))
                : VIETNAMESE_TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      Bài {t.order}: {t.title}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* Child level */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            4. Khả năng hiện tại của bé:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'moi-lam-quen' as ChildProficiency, label: 'Mới làm quen' },
              { id: 'can-luyen-them' as ChildProficiency, label: 'Cần luyện thêm' },
              { id: 'da-kha-vung' as ChildProficiency, label: 'Đã khá vững' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setProficiency(p.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                  proficiency === p.id
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Card with interactive Countdown Timer */}
      {activePlan && (
        <div className="bg-white rounded-2xl border border-teal-200 shadow-md p-4 sm:p-6 space-y-5 animate-fade-in">
          {/* Top Timer Display */}
          <div className="bg-gradient-to-r from-slate-900 to-[#173A63] text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-[#FFBE45] uppercase tracking-wider block">
                {activePlan.title}
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Mục tiêu: {activePlan.target}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center font-mono">
                <span className="text-3xl sm:text-4xl font-black text-[#20B8A6] tracking-wider block">
                  {formatTimer(secondsRemaining)}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isTimerRunning ? 'ĐANG KÈM CON...' : 'ĐỒNG HỒ TẠM DỪNG'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {!isTimerRunning ? (
                  <button
                    onClick={() => setIsTimerRunning(true)}
                    className="bg-[#20B8A6] hover:bg-teal-500 text-white font-bold p-3 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    title="Bắt đầu đếm ngược"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span className="text-xs hidden sm:inline">BẮT ĐẦU KÈM CON</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsTimerRunning(false)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold p-3 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    title="Tạm dừng"
                  >
                    <Pause className="w-5 h-5 fill-white" />
                    <span className="text-xs hidden sm:inline">TẠM DỪNG</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setSecondsRemaining(duration * 60);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
                  title="Đặt lại đồng hồ"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleFinishEarly}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-3 rounded-xl transition-colors shadow-sm"
                  title="Hoàn thành buổi học"
                >
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>

          {/* Materials checklist */}
          <div className="bg-teal-50/60 border border-teal-200 p-3 rounded-xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <div className="text-xs text-teal-950">
              <span className="font-bold">Đồ dùng chuẩn bị:</span>{' '}
              {activePlan.materials?.join(', ') || 'Nắp chai, giấy nháp, bút chì'}
            </div>
          </div>

          {/* Parent Script speech card */}
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
            <span className="text-xs font-bold text-amber-900 uppercase block mb-1">
              Lời thoại bố mẹ nói với con:
            </span>
            <p className="text-xs sm:text-sm text-amber-950 italic font-medium">
              {activePlan.parentScript}
            </p>
          </div>

          {/* Timeline steps */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Lộ trình từng phút cụ thể
            </h4>
            <div className="space-y-2">
              {activePlan.timeline.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    currentStepIndex === idx
                      ? 'bg-teal-50/80 border-teal-300 ring-2 ring-teal-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`text-xs font-mono font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                      currentStepIndex === idx
                        ? 'bg-[#173A63] text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {step.time}
                  </span>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-slate-900">{step.title}</h5>
                    <p className="text-xs text-slate-600 mt-0.5">{step.detail}</p>
                  </div>
                  {currentStepIndex === idx && (
                    <span className="text-[10px] bg-[#20B8A6] text-white font-bold px-2 py-0.5 rounded-full">
                      Đang ở bước này
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pedagogical tip */}
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-xs text-purple-900">
            <span className="font-bold">Mẹo sư phạm:</span> {activePlan.tip}
          </div>
        </div>
      )}

      {/* Completion Modal / Log entry */}
      {sessionCompleted && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-lg space-y-4 animate-scale-up">
          <div className="flex items-center gap-2 text-emerald-800">
            <Award className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold">Tuyệt vời! Bố mẹ đã hoàn thành buổi học 10 phút!</h3>
          </div>
          <p className="text-xs text-slate-600">
            Mỗi 10 phút bố mẹ dành cho con hôm nay là một viên gạch vững chắc cho tương lai. Hãy ghi nhanh lại kết quả của buổi học để theo dõi hành trình tiến bộ của con nhé:
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Con tiếp thu bài như thế nào?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'doc-lap', label: 'Con làm được độc lập ⭐⭐⭐', color: 'border-emerald-300' },
                  { id: 'co-ho-tro', label: 'Con làm được khi có hỗ trợ ⭐⭐', color: 'border-blue-300' },
                  { id: 'can-luyen-them', label: 'Con cần luyện thêm ⭐', color: 'border-amber-300' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCompletionStatus(s.id as any)}
                    className={`p-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                      completionStatus === s.id
                        ? 'bg-white shadow-sm ring-2 ring-emerald-500 font-bold text-emerald-900'
                        : 'bg-white/60 text-slate-700 border-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ghi chú của bố mẹ (tùy chọn):
              </label>
              <input
                type="text"
                value={parentNote}
                onChange={(e) => setParentNote(e.target.value)}
                placeholder="Ví dụ: Con thích trò nắp chai, đã đếm tiếp được số 8..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {isSaved ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-100 px-3 py-2 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  Đã lưu vào Hành trình của gia đình!
                </div>
              ) : (
                <button
                  onClick={handleSaveSession}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors"
                >
                  LƯU TIẾN ĐỘ BUỔI HỌC
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
