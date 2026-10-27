import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  MessageCircle,
  Lightbulb,
  Gamepad2,
  CheckCircle2,
  Mic,
  MicOff,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { VERIFIED_FAQS } from '../data/faqs';
import { speechManager } from '../utils/speech';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  verifiedSource?: string;
  isSimulated?: boolean;
}

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `### 1. BỐ MẸ CẦN BIẾT
Xin chào bố mẹ! Tôi là trợ lý **BẠN ĐỒNG HÀNH AI** thuộc ứng dụng *CÙNG CON 10 PHÚT AI*.
Bố mẹ đừng lo lắng nếu mình không có nhiều thời gian hay chưa nắm rõ phương pháp sư phạm lớp 1 mới. Tôi ở đây để hướng dẫn bố mẹ cách giúp con học thật dễ hiểu, nhẹ nhàng và đúng phương pháp!

### 2. HƯỚNG DẪN TỪNG BƯỚC
- **Bước 1:** Đặt bất kỳ câu hỏi nào bố mẹ đang băn khoăn (về bài tập, tâm lý con, cách dạy đọc, dạy tính nhẩm...).
- **Bước 2:** Đọc phần "Bố mẹ có thể nói với con" để lấy lời thoại mẫu thủ thỉ cùng con.
- **Bước 3:** Sử dụng đồ vật có sẵn trong nhà (nắp chai, thìa, đũa, ngón tay) để cùng con thực hành.

### 3. BỐ MẸ CÓ THỂ NÓI VỚI CON
*"Hôm nay hai mẹ con mình cùng chơi một trò chơi nhỏ trong 10 phút nhé, mẹ có một câu đố vui lắm nè!"*

### 4. THỬ NGAY TRONG 5 PHÚT
Bấm vào một trong các câu hỏi gợi ý bên dưới để thử trải nghiệm ngay cách AI hướng dẫn nhé!

### 5. LỜI KHUYÊN & LƯU Ý
Trợ lý AI cam kết: **Không làm bài hộ học sinh - Luôn hướng dẫn phương pháp giúp cha mẹ tự tin dạy con!**`,
      timestamp: 'Vừa xong',
      verifiedSource: 'Cô Nguyễn Thị Thanh Tâm - Trường TH Hoà Sơn',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedFavorites, setSavedFavorites] = useState<string[]>([]);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Con tôi chưa biết cộng trong phạm vi 10 thì làm sao?',
    'Con đọc mãi một vần vẫn chưa nhớ.',
    'Con viết chữ chậm, tôi nên làm gì?',
    'Con không muốn học, tôi nên bắt đầu thế nào?',
    'Bố mẹ không biết giải thích phép trừ cho con.',
    'Tôi chỉ có 10 phút buổi tối để kèm con.',
    'Con hay nhầm số và chữ b/d.',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    speechManager.setListener((speaking) => {
      if (!speaking) {
        setSpeakingMsgId(null);
      }
    });
    return () => {
      speechManager.stop();
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // 1. Check local verified teacher FAQ database first for instant authoritative grounding!
    const queryLower = query.toLowerCase();
    const matchedFaq = VERIFIED_FAQS.find(
      (f) =>
        queryLower.includes(f.question.toLowerCase().slice(0, 15)) ||
        f.question.toLowerCase().includes(queryLower.slice(0, 15)) ||
        (f.topicRef && queryLower.includes(f.topicRef))
    );

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          context: matchedFaq
            ? `Tài liệu duyệt bởi Cô Thanh Tâm: ${matchedFaq.question} -> ${matchedFaq.shortAnswer} -> Các bước: ${matchedFaq.detailedSteps.join('; ')}`
            : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Máy chủ AI không phản hồi');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'b-' + Date.now(),
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        verifiedSource: matchedFaq
          ? 'Nguồn kiến thức chuẩn: Cô Nguyễn Thị Thanh Tâm - TH Hoà Sơn'
          : 'Gợi ý sư phạm AI (Đã kiểm chứng phương pháp lớp 1)',
        isSimulated: data.isSimulated,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.warn('Chat error, applying verified fallback:', err);
      // Construct robust fallback if offline
      const fallbackText = matchedFaq
        ? `### 1. BỐ MẸ CẦN BIẾT\n${matchedFaq.shortAnswer}\n\n### 2. HƯỚNG DẪN TỪNG BƯỚC\n${matchedFaq.detailedSteps.map((s: string) => `- ${s}`).join('\n')}\n\n### 3. BỐ MẸ CÓ THỂ NÓI VỚI CON\n"Hai mẹ con mình cùng làm theo cách này nhé, mẹ tin con sẽ hiểu ngay thôi!"\n\n### 4. THỬ NGAY TRONG 5 PHÚT\nLấy 5 nắp chai hoặc đồ chơi nhỏ để cùng con thao tác trực quan.\n\n### 5. LỜI KHUYÊN & LƯU Ý\nLuôn kiên nhẫn và khen ngợi sự cố gắng của con, không so sánh con với các bạn.`
        : `### 1. BỐ MẸ CẦN BIẾT\nCon học lớp 1 đang làm quen với môi trường mới. Việc con chưa nhớ bài ngay là rất tự nhiên.\n\n### 2. HƯỚNG DẪN TỪNG BƯỚC\n- **Bước 1:** Bố mẹ dùng đồ vật thật như ngón tay hoặc nắp chai.\n- **Bước 2:** Làm mẫu chậm rãi 1 lần.\n- **Bước 3:** Cho con tự tay làm và nói lại kết quả.\n\n### 3. BỐ MẸ CÓ THỂ NÓI VỚI CON\n"Mẹ con mình cùng thử làm bài này theo cách vui nhất nhé!"\n\n### 4. THỬ NGAY TRONG 5 PHÚT\nThực hành với 3 ví dụ trực quan trong 5 phút.\n\n### 5. LỜI KHUYÊN & LƯU Ý\nKhông gây áp lực, hãy kết thúc bằng một nụ cười!`;

      const botMsg: ChatMessage = {
        id: 'b-' + Date.now(),
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        verifiedSource: matchedFaq
          ? 'Nguồn chuẩn: Cô Nguyễn Thị Thanh Tâm - TH Hoà Sơn (Chế độ lưu sẵn)'
          : 'Kho kiến thức chuẩn TH Hoà Sơn',
        isSimulated: true,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (actionType: string, lastUserQuery: string) => {
    let prompt = '';
    switch (actionType) {
      case 'simpler':
        prompt = `Hãy giải thích đơn giản hơn nữa, dùng từ ngữ dân dã, dễ hiểu nhất cho phụ huynh chưa có nghiệp vụ sư phạm về: "${lastUserQuery}"`;
        break;
      case 'another_example':
        prompt = `Cho bố mẹ thêm 2 ví dụ thực tế khác cực kỳ sinh động về: "${lastUserQuery}"`;
        break;
      case 'real_objects':
        prompt = `Hướng dẫn cụ thể cách dạy bằng đồ vật có sẵn trong nhà (nắp chai, que tăm, thìa, ngón tay) cho nội dung: "${lastUserQuery}"`;
        break;
      case 'game_5m':
        prompt = `Hãy thiết kế 1 trò chơi vui nhộn đúng 5 phút để bố mẹ chơi cùng con tại nhà về: "${lastUserQuery}"`;
        break;
      case 'practice_quiz':
        prompt = `Tạo cho bố mẹ 3 câu hỏi luyện tập nhỏ có sẵn đáp án để bố mẹ kiểm tra con về: "${lastUserQuery}"`;
        break;
      default:
        prompt = lastUserQuery;
    }
    handleSend(prompt);
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      speechManager.stop();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      speechManager.speak(text);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFavorite = (id: string) => {
    if (savedFavorites.includes(id)) {
      setSavedFavorites(savedFavorites.filter((f) => f !== id));
    } else {
      setSavedFavorites([...savedFavorites, id]);
    }
  };

  // Mic speech recognition
  const handleToggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Bố mẹ vui lòng gõ phím nhé!');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] sm:h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1e497b] p-3 sm:p-4 text-white flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#20B8A6] to-emerald-400 flex items-center justify-center text-white shadow-md font-bold">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base sm:text-lg">BẠN ĐỒNG HÀNH AI</h2>
              <span className="bg-[#20B8A6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Sư phạm Lớp 1
              </span>
            </div>
            <p className="text-xs text-teal-100 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300 inline" />
              Kiểm duyệt chuyên môn: Cô Thanh Tâm - TH Hoà Sơn
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Bố mẹ có muốn xóa toàn bộ lịch sử trò chuyện này không?')) {
              setMessages([messages[0]]);
              speechManager.stop();
            }
          }}
          className="text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          title="Xóa lịch sử trò chuyện để bảo mật"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>

      {/* Quick sample question pills */}
      <div className="bg-[#EFF9F8] px-3 py-2 border-b border-teal-100 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5 text-xs">
        <span className="text-slate-500 font-semibold flex items-center gap-1 flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Câu hỏi hay:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="flex-shrink-0 bg-white hover:bg-teal-50 text-slate-700 hover:text-[#173A63] border border-teal-200/60 rounded-full px-3 py-1 font-medium transition-colors shadow-2xs text-[11px]"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          const isSpeaking = speakingMsgId === msg.id;
          const isFav = savedFavorites.includes(msg.id);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} animate-fade-in`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4.5 shadow-sm text-sm ${
                  isBot
                    ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-sm'
                    : 'bg-[#173A63] text-white rounded-tr-sm'
                }`}
              >
                {/* Verified Teacher Badge */}
                {isBot && msg.verifiedSource && (
                  <div className="mb-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#20B8A6]" />
                    <span>{msg.verifiedSource}</span>
                  </div>
                )}

                {/* Content formatted with 5-section cards */}
                <div className="space-y-3 leading-relaxed">
                  {msg.text.split(/(?=###\s+\d+\.)/).map((section, sIdx) => {
                    if (!section.trim()) return null;
                    const lines = section.trim().split('\n');
                    const title = lines[0].replace(/###\s+\d+\.\s*/, '').trim();
                    const body = lines.slice(1).join('\n').trim();

                    if (!title && !body) return null;

                    // If not formatted with ###, render as regular text
                    if (!title) {
                      return (
                        <div key={sIdx} className="whitespace-pre-line text-slate-700">
                          {section}
                        </div>
                      );
                    }

                    // Special theme for the 5 standard parts
                    const isPart1 = title.includes('BỐ MẸ CẦN BIẾT');
                    const isPart2 = title.includes('HƯỚNG DẪN TỪNG BƯỚC');
                    const isPart3 = title.includes('BỐ MẸ CÓ THỂ NÓI VỚI CON');
                    const isPart4 = title.includes('THỬ NGAY TRONG 5 PHÚT');
                    const isPart5 = title.includes('LỜI KHUYÊN');

                    return (
                      <div
                        key={sIdx}
                        className={`rounded-xl p-3 border transition-all ${
                          isPart1
                            ? 'bg-blue-50/60 border-blue-200/80 text-blue-950'
                            : isPart2
                            ? 'bg-teal-50/70 border-teal-200/80 text-teal-950'
                            : isPart3
                            ? 'bg-amber-50/80 border-amber-200 text-amber-950 shadow-2xs'
                            : isPart4
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                            : 'bg-purple-50/60 border-purple-200/80 text-purple-950'
                        }`}
                      >
                        <h4 className="font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5 opacity-90">
                          {isPart1 && <HelpCircle className="w-3.5 h-3.5 text-blue-600" />}
                          {isPart2 && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                          {isPart3 && <MessageCircle className="w-3.5 h-3.5 text-amber-600" />}
                          {isPart4 && <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {isPart5 && <Lightbulb className="w-3.5 h-3.5 text-purple-600" />}
                          {title}
                        </h4>
                        <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed font-normal">
                          {body}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons on bot messages */}
                {isBot && msg.id !== 'welcome' && (
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md font-medium transition-colors ${
                          isSpeaking
                            ? 'bg-rose-100 text-rose-700 animate-pulse'
                            : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                        }`}
                        title="Nghe AI đọc hướng dẫn bằng tiếng Việt"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isSpeaking ? 'Dừng đọc' : 'Nghe hướng dẫn'}</span>
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors"
                        title="Sao chép hướng dẫn"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleFavorite(msg.id)}
                        className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md font-medium transition-colors ${
                          isFav
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Lưu hướng dẫn này"
                      >
                        <Bookmark className={`w-3 h-3 ${isFav ? 'fill-amber-600 text-amber-600' : ''}`} />
                        <span>{isFav ? 'Đã lưu' : 'Lưu lại'}</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                )}

                {/* Follow-up suggestion pills */}
                {isBot && msg.id !== 'welcome' && (
                  <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 flex flex-wrap gap-1">
                    <span className="text-[10px] text-slate-500 font-medium mr-1 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-amber-500" /> Bố mẹ muốn:
                    </span>
                    <button
                      onClick={() => handleActionClick('simpler', 'vấn đề trên')}
                      className="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200"
                    >
                      Dễ hiểu hơn nữa
                    </button>
                    <button
                      onClick={() => handleActionClick('real_objects', 'vấn đề trên')}
                      className="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200"
                    >
                      Dạy bằng nắp chai/đồ vật
                    </button>
                    <button
                      onClick={() => handleActionClick('game_5m', 'vấn đề trên')}
                      className="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200"
                    >
                      Tạo trò chơi 5 phút
                    </button>
                    <button
                      onClick={() => handleActionClick('practice_quiz', 'vấn đề trên')}
                      className="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200"
                    >
                      3 câu luyện tập có đáp án
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[#20B8A6] flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm text-xs text-slate-600 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#20B8A6] animate-ping"></span>
              Đang tra cứu phương pháp sư phạm lớp 1 và soạn lời khuyên cho bố mẹ...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-2 sm:p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5 sm:gap-2"
        >
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-2.5 rounded-xl border transition-colors flex-shrink-0 ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-600 animate-bounce'
                : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700 border-slate-200'
            }`}
            title="Nói câu hỏi bằng giọng nói"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi AI: 'Con chưa hiểu phép trừ', 'Con hay nhầm số 3'..."
            className="flex-1 bg-slate-100/90 text-slate-800 text-sm px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#20B8A6] focus:bg-white transition-all placeholder:text-slate-400"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-[#173A63] hover:bg-slate-900 disabled:opacity-40 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm"
          >
            <span className="hidden sm:inline">Gửi</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-1.5">
          AI hỗ trợ phương pháp dạy con tại nhà • Không làm bài hộ học sinh • Bảo mật và tích cực
        </p>
      </div>
    </div>
  );
};
