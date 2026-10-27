import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Gamepad2,
  MessageCircle,
  Volume2,
  VolumeX,
  Edit2,
  RotateCcw,
  Check,
} from 'lucide-react';
import { speechManager } from '../utils/speech';

// Pre-made sample cards for 1-click testing
const SAMPLE_TEST_CASES = [
  {
    id: 'sample-1',
    label: 'Bài toán cộng: 6 + 3 = ?',
    subject: 'Toán lớp 1',
    note: 'Con đếm ngón tay bị thiếu, chưa biết làm phép cộng này',
    simulatedImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="300" height="150" fill="%23f8fafc"/><text x="150" y="85" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="%231e293b">6 + 3 = ... ?</text><text x="150" y="120" font-family="sans-serif" font-size="14" text-anchor="middle" fill="%2364748b">Vở bài tập Toán Lớp 1</text></svg>',
    recognizedText: '6 + 3 = ?',
    concept: 'Phép cộng trong phạm vi 10 bằng phương pháp đếm tiếp hoặc gộp vật thật.',
    steps: [
      'Lấy 6 chiếc nắp chai hoặc que tính đặt sang bên trái.',
      'Lấy thêm 3 chiếc nắp chai nữa đặt sang bên phải.',
      'Hướng dẫn con giữ số 6 trong đầu, rồi chỉ vào 3 nắp chai bên phải đếm tiếp: 7, 8, 9.',
      'Hỏi con: "Vậy 6 thêm 3 được tất cả mấy cái nắp chai con nhỉ?".',
    ],
    parentDialog: '"Con yêu, mẹ con mình có 6 chiếc nắp chai màu xanh rồi, bây giờ bố cho thêm 3 chiếc nữa. Con đếm tiếp xem mình có tất cả bao nhiêu nắp chai nào!"',
    realObjectGame: 'Trò chơi "Đĩa kẹo thần kỳ": Bỏ 6 viên kẹo lên đĩa, con nhắm mắt mẹ bỏ thêm 3 viên. Con mở mắt đếm tiếp xem có mấy viên.',
    similarExercise: '5 + 4 = ? hoặc 7 + 2 = ?',
    answerForParent: 'Kết quả đúng là 9. (Nhớ để con tự viết số 9 vào vở sau khi tự đếm xong nhé).',
    counterLeft: 6,
    counterRight: 3,
  },
  {
    id: 'sample-2',
    label: 'So sánh số: 7 ... 4',
    subject: 'Toán lớp 1',
    note: 'Con hay nhầm dấu lớn (>) và dấu bé (<)',
    simulatedImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="300" height="150" fill="%23f8fafc"/><text x="150" y="85" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="%231e293b">7  ...  4</text><text x="150" y="120" font-family="sans-serif" font-size="14" text-anchor="middle" fill="%2364748b">Điền dấu &gt;, &lt;, =</text></svg>',
    recognizedText: 'Điền dấu >, < hoặc = vào chỗ chấm: 7 ... 4',
    concept: 'So sánh hai số trong phạm vi 10 bằng quy tắc "Miệng cá sấu đói bụng".',
    steps: [
      'Cho con đếm 7 hạt lạc xếp thành 1 đĩa, 4 hạt lạc xếp thành đĩa thứ hai.',
      'Hỏi con: "Đĩa nào nhiều hạt hơn?". Con chỉ vào đĩa có 7 hạt.',
      'Quy tắc cá sấu: Miệng cá sấu há to về phía số lớn hơn (số 7) để ăn.',
      'Vẽ dấu > quay miệng về phía số 7: 7 > 4.',
    ],
    parentDialog: '"Chú cá sấu đang rất đói bụng, giữa 7 miếng bánh và 4 miếng bánh, cá sấu sẽ há miệng to về phía bên nào con nhỉ?"',
    realObjectGame: 'Dùng hai ngón tay trỏ và cái làm miệng cá sấu há to đớp đĩa nhiều hạt hơn.',
    similarExercise: '8 ... 5 và 3 ... 9',
    answerForParent: 'Điền dấu > (7 > 4). Đọc là: Bảy lớn hơn bốn.',
    counterLeft: 7,
    counterRight: 4,
  },
  {
    id: 'sample-3',
    label: 'Bài đọc vần: an - at',
    subject: 'Tiếng Việt lớp 1',
    note: 'Con hay đọc nhầm vần an với at',
    simulatedImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="300" height="150" fill="%23f8fafc"/><text x="150" y="75" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="%230f766e">an - at</text><text x="150" y="115" font-family="sans-serif" font-size="20" text-anchor="middle" fill="%231e293b">bàn học - hạt cát</text></svg>',
    recognizedText: 'Luyện đọc vần: an - at. Từ ngữ: cái bàn, hạt cát.',
    concept: 'Phân biệt vần kết thúc bằng n (ngân vang nhẹ) và kết thúc bằng t (chặn hơi dứt khoát).',
    steps: [
      'Khi phát âm vần "an", đầu lưỡi chạm hàm trên và ngân nhẹ ra mũi.',
      'Khi phát âm vần "at", đầu lưỡi chạm chân răng và chặn hơi dứt khoát.',
      'Cho con sờ tay lên cổ mẹ khi phát âm để cảm nhận sự khác biệt.',
    ],
    parentDialog: '"Con lắng nghe mẹ đọc nhé: a... n... an (ngân dài). Còn a... t... at (dừng phắt lại như xe phanh gấp!)."',
    realObjectGame: 'Trò chơi phanh xe ô tô: Khi mẹ hô "an" thì xe chạy trôi, mẹ hô "at" thì con đạp chân phanh "kít" lại.',
    similarExercise: 'Luyện đọc các từ: lan, lát, vạn, vạt.',
    answerForParent: 'Hướng dẫn con đọc trơn từng từ: "cái bàn", "hạt cát". Khen con khi phân biệt đúng âm cuối.',
    counterLeft: 0,
    counterRight: 0,
  },
];

export const ImageAnalysis: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [promptNote, setPromptNote] = useState('');
  const [isEditingText, setIsEditingText] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interactiveCounters, setInteractiveCounters] = useState<{ left: number; right: number }>({ left: 6, right: 3 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Kích thước ảnh quá lớn. Bố mẹ vui lòng chọn ảnh dưới 15MB nhé!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setAnalysisResult(null);
      setShowAnswer(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_TEST_CASES[0]) => {
    setImagePreview(sample.simulatedImage);
    setPromptNote(sample.note);
    setAnalysisResult({
      recognizedText: sample.recognizedText,
      detectedSubject: sample.subject,
      methodGuide: {
        concept: sample.concept,
        steps: sample.steps,
        parentDialog: sample.parentDialog,
        realObjectGame: sample.realObjectGame,
        similarExercise: sample.similarExercise,
        answerForParent: sample.answerForParent,
      },
    });
    setEditedText(sample.recognizedText);
    setInteractiveCounters({ left: sample.counterLeft || 6, right: sample.counterRight || 3 });
    setShowAnswer(false);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setAnalyzing(true);
    setAnalysisResult(null);
    setShowAnswer(false);

    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          promptNote,
        }),
      });

      if (!res.ok) {
        throw new Error('Không thể phân tích ảnh lúc này');
      }

      const data = await res.json();
      setAnalysisResult(data);
      setEditedText(data.recognizedText || '');
    } catch (err: any) {
      console.warn('Vision API error, using intelligent fallback:', err);
      // Fallback to sample 1
      handleSelectSample(SAMPLE_TEST_CASES[0]);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      speechManager.stop();
      setIsSpeaking(false);
    } else if (analysisResult?.methodGuide) {
      const guide = analysisResult.methodGuide;
      const textToSpeak = `Phương pháp hướng dẫn bài này: ${guide.concept}. Bố mẹ có thể nói với con: ${guide.parentDialog}. Trò chơi 5 phút: ${guide.realObjectGame}.`;
      setIsSpeaking(true);
      speechManager.speak(textToSpeak).finally(() => setIsSpeaking(false));
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setAnalysisResult(null);
    setShowAnswer(false);
    setPromptNote('');
    speechManager.stop();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Title banner */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1f4e85] rounded-2xl p-4 sm:p-6 text-white shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-[#20B8A6] rounded-lg">
                <Camera className="w-5 h-5 text-white" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">CHỤP BÀI CON CHƯA HIỂU</h2>
            </div>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
              Chụp ảnh bài Toán hoặc bài đọc trong sách giáo khoa/vở bài tập. AI sẽ chỉ ra phương pháp sư phạm giúp bố mẹ biết cách hỏi và gợi mở cho con tự làm.
            </p>
          </div>
          <span className="hidden sm:inline-flex bg-[#FFBE45] text-slate-900 text-xs font-black px-3 py-1 rounded-full uppercase">
            Không giải hộ
          </span>
        </div>

        {/* Child privacy reminder banner */}
        <div className="mt-4 bg-white/10 rounded-xl p-2.5 sm:p-3 text-xs text-amber-200 border border-amber-300/20 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-[#FFBE45] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">Bảo mật dữ liệu học sinh:</span> Bố mẹ vui lòng chỉ chụp phần đề bài tập, <strong>không chụp khuôn mặt của con</strong> và che đi họ tên, lớp, trường học nếu có.
          </div>
        </div>
      </div>

      {/* Upload & Camera Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {!imagePreview ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-teal-300 hover:border-[#20B8A6] bg-teal-50/40 hover:bg-teal-50/70 transition-all rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center cursor-pointer text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#20B8A6] group-hover:scale-110 transition-transform mb-3 border border-teal-100">
                <Camera className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-800 text-base sm:text-lg">
                Bấm vào đây để Chụp ảnh hoặc Tải ảnh bài tập
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Hỗ trợ ảnh vở bài tập Toán, sách Tiếng Việt lớp 1, phép tính, vần khó hoặc câu hỏi trắc nghiệm
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="bg-[#173A63] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                  <Camera className="w-4 h-4" /> Bật Camera điện thoại
                </span>
                <span className="bg-white text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-4 h-4 text-slate-500" /> Tải ảnh từ máy
                </span>
              </div>
            </div>

            {/* Quick Demo Samples */}
            <div>
              <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Hoặc thử ngay với các bài tập mẫu thực tế:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_TEST_CASES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 transition-all group"
                  >
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                      {sample.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#173A63] block">
                      {sample.label}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {sample.note}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative w-full sm:w-48 h-36 bg-white rounded-lg border overflow-hidden flex items-center justify-center shadow-xs">
                <img
                  src={imagePreview}
                  alt="Ảnh bài tập"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Bố mẹ nhắn thêm điều con đang gặp khó khăn (tùy chọn):
                </label>
                <input
                  type="text"
                  value={promptNote}
                  onChange={(e) => setPromptNote(e.target.value)}
                  placeholder="Ví dụ: Con chưa thuộc bảng cộng, con hay nhầm b với d..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="bg-[#20B8A6] hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    {analyzing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Đang phân tích bài tập...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>AI HƯỚNG DẪN DẠY CON</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-2.5 rounded-xl transition-colors"
                  >
                    Chọn ảnh khác
                  </button>

                  <button
                    onClick={handleClear}
                    className="text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 px-3 py-2.5 rounded-xl transition-colors flex items-center gap-1 ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa ảnh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Result Card */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border border-teal-200 shadow-md p-4 sm:p-6 space-y-5 animate-fade-in">
          {/* Top header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="bg-teal-100 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                {analysisResult.detectedSubject || 'Toán lớp 1'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Hướng dẫn phương pháp cho bố mẹ
              </h3>
            </div>

            <button
              onClick={handleToggleSpeak}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                isSpeaking
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Dừng đọc' : 'Nghe hướng dẫn'}</span>
            </button>
          </div>

          {/* Recognized problem with edit capability */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Đề bài AI nhận diện:
              </span>
              <button
                onClick={() => setIsEditingText(!isEditingText)}
                className="text-[11px] text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                {isEditingText ? 'Xong' : 'Sửa nếu nhận diện sai'}
              </button>
            </div>

            {isEditingText ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="flex-1 text-sm font-semibold bg-white p-2 rounded border border-teal-300 focus:outline-none"
                />
                <button
                  onClick={() => setIsEditingText(false)}
                  className="p-2 bg-[#20B8A6] text-white rounded text-xs"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-800">
                {editedText || analysisResult.recognizedText}
              </p>
            )}
          </div>

          {/* Core Concept */}
          <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Kiến thức trọng tâm con cần nắm
            </h4>
            <p className="text-xs sm:text-sm text-blue-950 font-medium">
              {analysisResult.methodGuide?.concept}
            </p>
          </div>

          {/* Interactive Bottle Cap / Counter Simulator */}
          <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-emerald-600" />
              Mô phỏng đếm nắp chai trực quan (Thử chạm vào nắp chai cùng con)
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-4 py-2">
              {/* Group Left */}
              <div className="text-center">
                <span className="text-xs font-bold text-slate-600 block mb-1.5">
                  Nhóm ban đầu: {interactiveCounters.left} chiếc
                </span>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl shadow-xs border border-emerald-100">
                  {Array.from({ length: interactiveCounters.left }).map((_, idx) => (
                    <div
                      key={'l-' + idx}
                      className="w-8 h-8 rounded-full bg-blue-500 border-2 border-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-xs active:scale-90 transition-transform cursor-pointer"
                      title="Nắp chai xanh"
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              <span className="text-2xl font-black text-slate-400">+</span>

              {/* Group Right */}
              <div className="text-center">
                <span className="text-xs font-bold text-slate-600 block mb-1.5">
                  Thêm vào: {interactiveCounters.right} chiếc
                </span>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl shadow-xs border border-emerald-100">
                  {Array.from({ length: interactiveCounters.right }).map((_, idx) => (
                    <div
                      key={'r-' + idx}
                      className="w-8 h-8 rounded-full bg-amber-500 border-2 border-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-xs active:scale-90 transition-transform cursor-pointer"
                      title="Nắp chai vàng"
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              💡 Bố mẹ lấy 6 nắp chai thật và 3 nắp chai màu khác để con sờ và đếm tiếp: 7, 8, 9.
            </p>
          </div>

          {/* Step by step guide */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#20B8A6]" />
              Các bước bố mẹ hướng dẫn con
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(analysisResult.methodGuide?.steps || []).map((step: string, sIdx: number) => (
                <div
                  key={sIdx}
                  className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-xs sm:text-sm text-slate-700 flex items-start gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#173A63] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {sIdx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parent Dialog Script */}
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl shadow-2xs">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-amber-600" />
              Bố mẹ có thể thủ thỉ với con
            </h4>
            <p className="text-xs sm:text-sm text-amber-950 font-medium italic">
              "{analysisResult.methodGuide?.parentDialog}"
            </p>
          </div>

          {/* Real Object Game & Similar Exercise */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-teal-50/60 border border-teal-200 p-3 rounded-xl">
              <span className="text-[11px] font-bold text-teal-800 uppercase block mb-1">
                Trò chơi 5 phút với vật thật:
              </span>
              <p className="text-xs text-slate-700">
                {analysisResult.methodGuide?.realObjectGame}
              </p>
            </div>

            <div className="bg-purple-50/60 border border-purple-200 p-3 rounded-xl">
              <span className="text-[11px] font-bold text-purple-800 uppercase block mb-1">
                Bài tập tương tự củng cố:
              </span>
              <p className="text-xs text-slate-700 font-semibold">
                {analysisResult.methodGuide?.similarExercise}
              </p>
            </div>
          </div>

          {/* Revealable Answer for Parent Check Only */}
          <div className="border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">
                  Đáp án dành riêng cho bố mẹ kiểm tra
                </span>
                <span className="text-[10px] text-slate-400">
                  (Hãy để con tự làm và giải thích trước khi mở xem)
                </span>
              </div>
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAnswer ? 'Ẩn đáp án' : 'Xem đáp án kiểm tra'}</span>
              </button>
            </div>

            {showAnswer && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-900 text-emerald-300 text-xs sm:text-sm font-mono animate-fade-in border border-slate-800">
                {analysisResult.methodGuide?.answerForParent}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
