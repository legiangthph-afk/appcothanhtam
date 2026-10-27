import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  Calendar,
  Clock,
  Award,
  Download,
  Trash2,
  Edit2,
  Heart,
  BookOpen,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ProgressRecord } from '../types';
import {
  getProgressRecords,
  clearProgressRecords,
  getChildNickname,
  saveChildNickname,
} from '../utils/storage';

export const ProgressTracker: React.FC = () => {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [childName, setChildName] = useState(getChildNickname());
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(childName);
  const [filterSubject, setFilterSubject] = useState<'all' | 'toan' | 'tieng-viet'>('all');

  useEffect(() => {
    setRecords(getProgressRecords());
  }, []);

  const handleSaveNickname = () => {
    if (tempName.trim()) {
      saveChildNickname(tempName.trim());
      setChildName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleClearHistory = () => {
    if (
      confirm(
        'Bố mẹ có chắc chắn muốn xóa toàn bộ lịch sử học tập này trên thiết bị không? Hành động này nhằm bảo vệ quyền riêng tư của gia đình.'
      )
    ) {
      clearProgressRecords();
      setRecords([]);
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) {
      alert('Chưa có dữ liệu học tập nào để xuất file.');
      return;
    }

    const headers = ['Mã', 'Ngày học', 'Môn học', 'Chủ đề', 'Số phút', 'Mức độ con làm được', 'Ghi chú', 'Tên bé'];
    const rows = records.map((r) => [
      r.id,
      r.date,
      r.subject === 'toan' ? 'Toán' : 'Tiếng Việt',
      `"${r.topicTitle.replace(/"/g, '""')}"`,
      r.durationMinutes,
      r.status === 'doc-lap'
        ? 'Làm độc lập'
        : r.status === 'co-ho-tro'
        ? 'Có hỗ trợ'
        : 'Cần luyện thêm',
      `"${(r.parentNote || '').replace(/"/g, '""')}"`,
      `"${r.childNickname || childName}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CungCon10Phut_TienDo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics calculation
  const totalSessions = records.length;
  const totalMinutes = records.reduce((acc, r) => acc + (r.durationMinutes || 0), 0);
  const independentCount = records.filter((r) => r.status === 'doc-lap').length;
  const needReviewTopics = Array.from(
    new Set(records.filter((r) => r.status === 'can-luyen-them').map((r) => r.topicTitle))
  );

  const filteredRecords = records.filter((r) => {
    return filterSubject === 'all' || r.subject === filterSubject;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Title */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1f4e85] rounded-2xl p-4 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-[#20B8A6] rounded-lg">
              <BarChart2 className="w-5 h-5 text-white" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">HÀNH TRÌNH CÙNG CON</h2>
          </div>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            Ghi nhận từng bước tiến nhỏ của con tại nhà. Không đánh giá xếp loại, không gây áp lực so sánh, tôn trọng tốc độ phát triển riêng của mỗi bé.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-white/10"
            title="Xuất file CSV báo cáo"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-rose-400/20"
            title="Xóa dữ liệu cá nhân"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Xóa dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Child Profile Nickname Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
            <Heart className="w-6 h-6 fill-rose-400 text-rose-400" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">
              Biệt danh học sinh:
            </span>
            {isEditingName ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="text-sm font-bold text-slate-900 border rounded-lg px-2 py-1 outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveNickname}
                  className="text-xs bg-[#20B8A6] text-white px-2 py-1 rounded-md font-bold"
                >
                  Lưu
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-lg font-bold text-slate-900">{childName}</h3>
                <button
                  onClick={() => {
                    setTempName(childName);
                    setIsEditingName(true);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                  title="Sửa tên biệt danh"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] bg-teal-50 text-teal-800 font-bold px-2.5 py-1 rounded-full border border-teal-200">
            Lớp 1 • Tiểu học Hoà Sơn
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Số buổi học</span>
          <span className="text-2xl font-black text-[#173A63] mt-1 block">
            {totalSessions}
          </span>
          <span className="text-[10px] text-teal-600 font-semibold">Buổi đồng hành</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Tổng thời gian</span>
          <span className="text-2xl font-black text-[#20B8A6] mt-1 block">
            {totalMinutes} <span className="text-xs font-normal text-slate-500">phút</span>
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">Đã dành cho con</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Làm được độc lập</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {independentCount}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {totalSessions > 0 ? `${Math.round((independentCount / totalSessions) * 100)}% tổng số` : 'Bắt đầu ngay'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Cần luyện thêm</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">
            {needReviewTopics.length}
          </span>
          <span className="text-[10px] text-amber-700 font-semibold">Chủ đề cần ôn</span>
        </div>
      </div>

      {/* Topics needing review alert */}
      {needReviewTopics.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950">
            <span className="font-bold block mb-1">Gợi ý ôn tập cho bố mẹ:</span>
            Con đang cần bố mẹ cùng luyện thêm ở các bài:{' '}
            <strong>{needReviewTopics.join(', ')}</strong>. Bố mẹ có thể chọn các bài này trong mục Kèm 10 phút nhé!
          </div>
        </div>
      )}

      {/* History table & filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-teal-600" />
            Lịch sử các buổi học cùng con
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterSubject('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterSubject === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterSubject('toan')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterSubject === 'toan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Toán
            </button>
            <button
              onClick={() => setFilterSubject('tieng-viet')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterSubject === 'tieng-viet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Tiếng Việt
            </button>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Chưa có buổi học nào được ghi lại. Hãy chọn mục "Kèm 10 phút" để bắt đầu buổi học đầu tiên cùng con nhé!
          </div>
        ) : (
          <div className="space-y-2">
            {filteredRecords.map((rec) => {
              const isIndep = rec.status === 'doc-lap';
              const isSupport = rec.status === 'co-ho-tro';
              return (
                <div
                  key={rec.id}
                  className="bg-slate-50 hover:bg-slate-100/70 transition-colors p-3.5 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.subject === 'toan'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {rec.subject === 'toan' ? 'Toán' : 'Tiếng Việt'}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {rec.topicTitle}
                      </h4>
                    </div>

                    {rec.parentNote && (
                      <p className="text-xs text-slate-600 italic">
                        "{rec.parentNote}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <span className="text-slate-400 text-[11px] font-mono">{rec.date}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700">
                      {rec.durationMinutes} phút
                    </span>

                    <span
                      className={`font-semibold px-2.5 py-1 rounded-full text-[11px] ${
                        isIndep
                          ? 'bg-emerald-100 text-emerald-800'
                          : isSupport
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isIndep ? '⭐ Độc lập' : isSupport ? '⭐⭐ Có hỗ trợ' : 'Cần ôn thêm'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
