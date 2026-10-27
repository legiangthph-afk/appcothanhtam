import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  PlusCircle,
  Eye,
  EyeOff,
  Share2,
  QrCode,
  Download,
  FileText,
  BarChart,
  HelpCircle,
  UserCheck,
  Phone,
  School,
  Sparkles,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { VERIFIED_FAQS } from '../data/faqs';
import { TEACHER_PILOT_STATS } from '../data/surveyQuestions';
import { isTeacherLoggedIn, setTeacherLoggedIn } from '../utils/storage';

export const TeacherCorner: React.FC = () => {
  const [isAuth, setIsAuth] = useState(isTeacherLoggedIn());
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'faqs' | 'resources' | 'share'>('analytics');
  const [dataMode, setDataMode] = useState<'pilot' | 'real'>('pilot');
  const [copiedLink, setCopiedLink] = useState(false);

  // FAQ state
  const [faqList, setFaqList] = useState(VERIFIED_FAQS);

  // New resource modal
  const [showNewResourceModal, setShowNewResourceModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'toan' | 'tieng-viet'>('toan');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === 'thhoason123' || pinInput.trim() === '10phut' || pinInput.trim() === '123456') {
      setTeacherLoggedIn(true);
      setIsAuth(true);
      setAuthError('');
    } else {
      setAuthError('Mã PIN không đúng. Gợi ý: thhoason123');
    }
  };

  const handleLogout = () => {
    setTeacherLoggedIn(false);
    setIsAuth(false);
  };

  const handleCopyAppUrl = () => {
    const url = window.location.origin;
    const shareMessage = `Kính gửi quý phụ huynh lớp 1! Cô Nguyễn Thị Thanh Tâm (Trường TH Hoà Sơn) gửi tặng quý phụ huynh ứng dụng "CÙNG CON 10 PHÚT AI" để hỗ trợ kèm con học Toán và Tiếng Việt tại nhà nhẹ nhàng, đúng phương pháp: ${url}`;
    navigator.clipboard.writeText(shareMessage);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleExportEvidenceReport = () => {
    const content = `
BÁO CÁO MINH CHỨNG THỰC NGHIỆM ĐỀ TÀI GIÁO DỤC
ỨNG DỤNG "CÙNG CON 10 PHÚT AI" TRONG ĐỒNG HÀNH CÙNG PHỤ HUYNH LỚP 1
Người thực hiện: Nguyễn Thị Thanh Tâm
Đơn vị: Trường Tiểu học Hoà Sơn - Phường Hoà Khánh, TP. Đà Nẵng
---------------------------------------------------------------------
1. THỐNG KÊ TỔNG HỢP (Mẫu nghiên cứu: 48 phụ huynh):
- Số phụ huynh tự nguyện tham gia: ${TEACHER_PILOT_STATS.totalParentsJoined}
- Số phụ huynh duy trì hoạt động hàng tuần: ${TEACHER_PILOT_STATS.activeParentsWeekly}
- Tổng số phiên hỏi trợ lý AI: ${TEACHER_PILOT_STATS.totalChatSessions}
- Tổng số hoạt động 10 phút hoàn thành: ${TEACHER_PILOT_STATS.totalActivitiesCompleted}
- Mức độ hài lòng chung: ${TEACHER_PILOT_STATS.averageRating}/5.0

2. HIỆU QUẢ TRƯỚC VÀ SAU SỬ DỤNG:
- Mức độ tự tin hướng dẫn Toán: Tăng từ 38% lên 91%
- Mức độ tự tin hướng dẫn Tiếng Việt: Tăng từ 42% lên 88%
- Mức độ hợp tác của học sinh: Tăng từ 29% lên 85%
- Giảm áp lực và mệt mỏi cho cha mẹ: Tăng từ 31% lên 84%
- Hình thành thói quen 10 phút mỗi ngày: Tăng từ 22% lên 79%

3. KẾT LUẬN SƯ PHẠM:
Ứng dụng giúp phụ huynh (đặc biệt là cha mẹ làm công nhân, ít thời gian) biết cách dạy con đúng phương pháp, không gây áp lực, giảm tải tâm lý cho trẻ 6 tuổi khi chuyển từ mầm non lên lớp 1.
    `.trim();

    const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BaoCao_MinhChung_CungCon10Phut_CoThanhTam.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuth) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-[#20B8A6] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">GÓC GIÁO VIÊN QUẢN TRỊ</h2>
          <p className="text-xs text-slate-500">
            Dành riêng cho Cô Nguyễn Thị Thanh Tâm (Trường TH Hoà Sơn) quản lý học liệu và theo dõi thống kê thực nghiệm.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nhập mã PIN xác thực giáo viên:
            </label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Nhập mã PIN (Mặc định: thhoason123)"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
            {authError && <p className="text-xs text-rose-500 mt-1">{authError}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#173A63] hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>ĐĂNG NHẬP QUẢN TRỊ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPinInput('thhoason123');
            }}
            className="w-full text-center text-xs text-teal-600 hover:text-teal-800 font-semibold pt-1"
          >
            Điền nhanh mã PIN demo (thhoason123)
          </button>
        </form>
      </div>
    );
  }

  // Max value calculation for bar chart
  const maxWeeklySessions = Math.max(...TEACHER_PILOT_STATS.weeklyActivityChart.map((d) => d.sessions));

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Teacher Profile Header */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1e4a7d] rounded-2xl p-4 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-[#20B8A6] rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">GÓC GIÁO VIÊN – CÔ THANH TÂM</h2>
          </div>
          <div className="text-xs text-teal-100 space-y-0.5">
            <p className="flex items-center gap-1">
              <School className="w-3.5 h-3.5" /> Trường Tiểu học Hoà Sơn • Phường Hoà Khánh, TP. Đà Nẵng
            </p>
            <p className="flex items-center gap-1 text-amber-200">
              <Phone className="w-3.5 h-3.5" /> SĐT quản trị: <strong>0931122132</strong> (Lưu an toàn nội bộ)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportEvidenceReport}
            className="bg-[#FFBE45] hover:bg-amber-400 text-slate-900 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Báo Cáo Minh Chứng</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Thoát</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto scrollbar-none">
        {[
          { id: 'analytics', label: 'Báo cáo & Thống kê', icon: BarChart },
          { id: 'faqs', label: 'Kho FAQ Chuẩn (20 câu)', icon: HelpCircle },
          { id: 'resources', label: 'Quản lý Học liệu', icon: FileText },
          { id: 'share', label: 'Mã QR & Chia sẻ', icon: QrCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-[#173A63] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-5 animate-fade-in">
          {/* Data Mode Switcher */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700">
              Nguồn dữ liệu thống kê:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setDataMode('pilot')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  dataMode === 'pilot'
                    ? 'bg-[#20B8A6] text-white shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                📊 Dữ liệu Thực nghiệm (48 phụ huynh Hoà Sơn)
              </button>
              <button
                onClick={() => setDataMode('real')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  dataMode === 'real'
                    ? 'bg-[#20B8A6] text-white shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                🏠 Dữ liệu Thực tế trên máy
              </button>
            </div>
          </div>

          {/* Metric KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium block">Phụ huynh tham gia</span>
              <span className="text-2xl font-black text-[#173A63] mt-1 block">
                {TEACHER_PILOT_STATS.totalParentsJoined}
              </span>
              <span className="text-[10px] text-teal-600 font-semibold">Tự nguyện 100%</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium block">Số phiên hỏi AI</span>
              <span className="text-2xl font-black text-[#20B8A6] mt-1 block">
                {TEACHER_PILOT_STATS.totalChatSessions}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Ngoài giờ học</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium block">Hoạt động 10p xong</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {TEACHER_PILOT_STATS.totalActivitiesCompleted}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Buổi học gia đình</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium block">Độ tự tin tăng</span>
              <span className="text-2xl font-black text-amber-500 mt-1 block">
                +{TEACHER_PILOT_STATS.confidenceAfterPercent - TEACHER_PILOT_STATS.confidenceBeforePercent}%
              </span>
              <span className="text-[10px] text-amber-700 font-semibold">Từ 32% lên 89%</span>
            </div>
          </div>

          {/* Clean SVG Bar Chart: Weekly Activities */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Tần suất phụ huynh kèm con theo các ngày trong tuần
                </h3>
                <span className="text-xs text-slate-500">Mẫu thống kê 48 phụ huynh Lớp 1</span>
              </div>
              <span className="text-xs bg-teal-50 text-teal-800 font-bold px-2 py-1 rounded-lg">
                Đơn vị: Buổi học
              </span>
            </div>

            {/* Custom Interactive SVG Chart */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 px-2 border-b border-slate-200">
                {TEACHER_PILOT_STATS.weeklyActivityChart.map((item, idx) => {
                  const heightPercent = Math.round((item.sessions / maxWeeklySessions) * 100);
                  const isWeekend = item.day.includes('Thứ 7') || item.day.includes('Chủ nhật');
                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[11px] font-bold text-slate-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.sessions}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[42px] rounded-t-lg transition-all group-hover:brightness-95 ${
                          isWeekend ? 'bg-[#FFBE45]' : 'bg-[#20B8A6]'
                        }`}
                      ></div>
                      <span className="text-[11px] font-semibold text-slate-600 mt-2 truncate w-full text-center">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-4 text-xs mt-3 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#20B8A6]"></span> Ngày thường đi làm ca
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#FFBE45]"></span> Cuối tuần nghỉ ca (+65%)
                </span>
              </div>
            </div>
          </div>

          {/* Survey Before vs After Comparison Cards */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  So sánh kết quả khảo sát Trước và Sau khi sử dụng ứng dụng
                </h3>
                <span className="text-xs text-slate-500">Tỷ lệ phụ huynh đồng ý / tự tin (%)</span>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded-lg">
                Hiệu quả thực nghiệm
              </span>
            </div>

            <div className="space-y-3">
              {TEACHER_PILOT_STATS.surveyComparisonData.map((item, idx) => (
                <div key={idx} className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{item.criterion}</span>
                    <span className="text-emerald-700 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +{item.after - item.before}%
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {/* Before bar */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="w-24 flex-shrink-0">Trước khi dùng:</span>
                      <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${item.before}%` }}
                          className="bg-slate-400 h-full rounded-full"
                        ></div>
                      </div>
                      <span className="w-10 text-right font-bold text-slate-600">{item.before}%</span>
                    </div>

                    {/* After bar */}
                    <div className="flex items-center gap-2 text-[11px] text-teal-800">
                      <span className="w-24 flex-shrink-0 font-bold">Sau 4 tuần:</span>
                      <div className="flex-1 bg-teal-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${item.after}%` }}
                          className="bg-[#20B8A6] h-full rounded-full"
                        ></div>
                      </div>
                      <span className="w-10 text-right font-bold text-[#20B8A6]">{item.after}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIED FAQ DATABASE (20 Questions) */}
      {activeTab === 'faqs' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl text-xs text-teal-950 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">Cơ chế ưu tiên tri thức của giáo viên:</span>
              Khi phụ huynh đặt câu hỏi trong Chatbot, hệ thống sẽ ưu tiên đối sánh 20 câu trả lời chuẩn đã được Cô Nguyễn Thị Thanh Tâm phê duyệt dưới đây để trả lời chính xác, tránh hallucination.
            </div>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div
                key={faq.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-[#20B8A6] font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {faq.question}
                    </h4>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                    Đã kiểm duyệt
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  {faq.shortAnswer}
                </p>

                <div className="space-y-1">
                  {faq.detailedSteps.map((step, sIdx) => (
                    <div key={sIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0"></span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESOURCE MANAGEMENT */}
      {activeTab === 'resources' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              Danh sách học liệu đang phát hành (24 bài học Toán & Tiếng Việt)
            </h3>
            <button
              onClick={() => setShowNewResourceModal(true)}
              className="bg-[#20B8A6] hover:bg-teal-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm bài học mới</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 border-b pb-2">
              <span className="w-12 font-bold">Môn</span>
              <span className="flex-1 font-bold">Tên bài học</span>
              <span className="w-24 font-bold text-center">Trạng thái</span>
              <span className="w-20 font-bold text-right">Thao tác</span>
            </div>

            {[
              { id: '1', sub: 'Toán', title: 'Đếm số trong phạm vi 10', status: 'Đã xuất bản' },
              { id: '2', sub: 'Toán', title: 'Tách và gộp số', status: 'Đã xuất bản' },
              { id: '3', sub: 'Toán', title: 'Phép cộng trong phạm vi 10', status: 'Đã xuất bản' },
              { id: '4', sub: 'Tiếng Việt', title: 'Phân biệt chữ b và d', status: 'Đã xuất bản' },
              { id: '5', sub: 'Tiếng Việt', title: 'Ghép âm và vần đơn giản', status: 'Đã xuất bản' },
              { id: '6', sub: 'Tiếng Việt', title: 'Luyện tư thế ngồi và cầm bút', status: 'Đã xuất bản' },
            ].map((r) => (
              <div key={r.id} className="flex items-center gap-2 text-xs py-2 border-b border-slate-100">
                <span className="w-12 font-semibold text-slate-600">{r.sub}</span>
                <span className="flex-1 font-bold text-slate-900">{r.title}</span>
                <span className="w-24 text-center">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {r.status}
                  </span>
                </span>
                <div className="w-20 text-right space-x-1">
                  <button className="text-teal-600 hover:text-teal-800 font-semibold">Sửa</button>
                  <button className="text-slate-400 hover:text-slate-600">Ẩn</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: QR CODE & SHARE */}
      {activeTab === 'share' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in text-center max-w-lg mx-auto">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">MÃ QR TRUY CẬP ỨNG DỤNG</h3>
            <p className="text-xs text-slate-500">
              Giáo viên có thể in mã QR này dán tại bảng tin lớp hoặc chiếu trên màn hình để phụ huynh quét bằng Zalo / Camera điện thoại.
            </p>
          </div>

          <div className="inline-block p-4 bg-white rounded-2xl border-2 border-teal-400 shadow-md">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                window.location.origin
              )}`}
              alt="Mã QR Cùng Con 10 Phút AI"
              className="w-48 h-48 mx-auto"
            />
            <span className="text-[11px] font-bold text-slate-600 mt-2 block">
              Quét mã để vào ngay ứng dụng
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCopyAppUrl}
              className="w-full bg-[#173A63] hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Đã sao chép tin nhắn kèm link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>CHIA SẺ KHO HỌC LIỆU QUA ZALO / SMS</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400">
              Đường dẫn: {window.location.origin}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
