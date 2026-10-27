import React, { useState } from 'react';
import {
  Clock,
  Sun,
  Sunset,
  Moon,
  Shuffle,
  WifiOff,
  CheckCircle2,
  Calendar,
  Sparkles,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { getShiftSetting, saveShiftSetting } from '../utils/storage';

export const ShiftWorkerMode: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [selectedShift, setSelectedShift] = useState<string>(getShiftSetting());

  const handleSelectShift = (shift: string) => {
    setSelectedShift(shift);
    saveShiftSetting(shift);
  };

  const shiftSchedules: Record<string, { title: string; time: string; tip: string; schedule: { time: string; activity: string; duration: string }[] }> = {
    day: {
      title: 'Ca ngày (Sáng làm - Tối ở nhà)',
      time: '6h00 - 14h00 hoặc 7h00 - 16h00',
      tip: 'Buổi tối là thời điểm vàng. Tuy nhiên bố mẹ vừa xong ca làm việc mệt mỏi, hãy nghỉ 15 phút rồi mới cùng con học đúng 10 phút lúc 19h30 - 20h00.',
      schedule: [
        { time: '18h30 - 19h00', activity: 'Ăn cơm cùng gia đình, hỏi con 1 niềm vui ở trường Hoà Sơn', duration: 'Tự nhiên' },
        { time: '19h30 - 19h40', activity: '10 Phút Vàng: Thực hành 1 bài Toán hoặc đọc 1 câu Tiếng Việt', duration: '10 phút' },
        { time: '20h30', activity: 'Thủ thỉ chúc con ngủ ngon, đập tay khen ngợi nỗ lực của con', duration: '2 phút' },
      ],
    },
    evening: {
      title: 'Ca chiều / tối (Đi làm từ trưa đến khuya)',
      time: '14h00 - 22h00',
      tip: 'Bố mẹ vắng nhà vào buổi tối. Tuyệt đối không đánh thức con dậy học lúc 22h30 đêm! Hãy chuyển 10 phút học sang buổi sáng trước khi con đến trường hoặc lúc 13h trưa.',
      schedule: [
        { time: '06h45 - 07h00', activity: 'Đố nhanh 2 câu vui trong lúc đưa con đi học hoặc ăn sáng', duration: '5 phút' },
        { time: '13h00 - 13h15', activity: 'Trước giờ bố mẹ đi làm ca: Cùng con ôn bài 10 phút với nắp chai', duration: '10 phút' },
        { time: '22h15', activity: 'Về nhà ngắm con ngủ say, hôn trán con. Cuối tuần dành bù 15 phút', duration: 'Yêu thương' },
      ],
    },
    night: {
      title: 'Ca đêm (Làm đêm - Ban ngày ngủ bù)',
      time: '22h00 - 06h00 sáng hôm sau',
      tip: 'Bố mẹ đi làm ca đêm rất cần ngủ bù hồi phục sức khỏe. Đừng ép mình phải ngồi kèm con lúc cơ thể buồn ngủ. Hãy chọn 10 phút lúc chiều muộn khi vừa ngủ dậy.',
      schedule: [
        { time: '07h00 - 07h15', activity: 'Tan ca về: Đón con đi học, vẫy tay chúc con một ngày vui vẻ', duration: '3 phút' },
        { time: '17h00 - 17h15', activity: 'Sau giấc ngủ bù: Tinh thần tỉnh táo, cùng con chơi 1 trò chơi học tập', duration: '10 phút' },
        { time: '21h00', activity: 'Trước khi vào ca đêm: Kể cho con nghe 1 mẩu chuyện ngắn', duration: '5 phút' },
      ],
    },
    rotating: {
      title: 'Lịch xoay ca linh hoạt',
      time: 'Thay đổi theo tuần hoặc theo ca',
      tip: 'Không bắt buộc học cố định một khung giờ trong ngày. Ngày nào thuận tiện thì học 10 phút, ngày nào tăng ca mệt thì chỉ cần 3 phút đố vui hoặc để con nghỉ.',
      schedule: [
        { time: 'Linh hoạt', activity: 'Bất cứ khi nào bố mẹ rảnh rỗi và tinh thần vui vẻ', duration: '5 - 10 phút' },
        { time: 'Ngày nghỉ ca', activity: 'Dành 15 phút trọn vẹn đưa con ra công viên vừa chơi vừa đếm lá cây', duration: '15 phút' },
      ],
    },
    unspecified: {
      title: 'Chế độ tự do (Không khai báo lịch làm)',
      time: 'Tùy chọn',
      tip: 'Ứng dụng tôn trọng sự riêng tư của gia đình. Bố mẹ cứ mở ứng dụng bất cứ lúc nào có 5-10 phút rảnh rỗi.',
      schedule: [
        { time: 'Mỗi ngày', activity: 'Chọn 1 hoạt động 5 phút hoặc 10 phút phù hợp', duration: '5 - 10 phút' },
      ],
    },
  };

  const currentSchedule = shiftSchedules[selectedShift] || shiftSchedules.day;

  // 10 offline activities when there is no internet
  const offlineActivities = [
    { title: '1. Đếm bậc cầu thang hoặc viên gạch', desc: 'Mỗi bước chân bước lên một bậc, hô to từ 1 đến 10 rồi đếm ngược về 1.' },
    { title: '2. Bố mẹ viết chữ lên lưng con', desc: 'Dùng ngón tay vẽ chữ cái lên lưng, đố con đoán xem đó là chữ gì.' },
    { title: '3. Dọn bàn ăn ghép đôi đũa', desc: 'Bảo con lấy đúng 4 đôi đũa hoặc 3 cái thìa tương ứng với số người trong nhà.' },
    { title: '4. Tìm chữ o tròn trên bao bì gia vị', desc: 'Chỉ vào gói bánh hoặc chai nước mắm, đố con tìm thấy chữ o, ô, ơ.' },
    { title: '5. Đĩa kẹo tách và gộp số 5', desc: 'Có 5 viên kẹo, mẹ chia vào 2 đĩa: 1 đĩa có 2 viên, đĩa kia còn mấy viên?' },
    { title: '6. Trò chơi cá sấu đói bụng', desc: 'Dùng 2 ngón tay làm miệng cá sấu há to về phía số lớn hơn: 8 > 5.' },
    { title: '7. Nhảy lò cò trên gạch bông', desc: 'Mẹ đọc số nào, con nhảy lò cò vào ô gạch có dán số đó.' },
    { title: '8. Chiếc kẹp càng cua cầm bút', desc: 'Ngón cái và ngón trỏ làm càng cua kẹp nhấc bút lên đặt nhẹ vào ngón giữa.' },
    { title: '9. Đố vui âm vần trước giờ đi ngủ', desc: 'Từ nào bắt đầu bằng chữ "b"? Con kể: bà, ba, bò, búp bê, bánh...' },
    { title: '10. Bắt tay bạn thân ghép tiếng', desc: 'Bố nói âm "cờ", con nói vần "ca" gộp lại thành tiếng "ca"!' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1a4474] rounded-2xl p-4 sm:p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-[#FFBE45] text-slate-900 rounded-lg">
            <Clock className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">CHẾ ĐỘ BỐ MẸ ĐI LÀM THEO CA</h2>
        </div>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
          Được thiết kế riêng cho phụ huynh công nhân tại các khu công nghiệp Đà Nẵng: Lịch học linh hoạt theo ca ngày, ca tối, ca đêm; không bắt buộc học giờ cố định, không gửi thông báo làm phiền.
        </p>
      </div>

      {/* Shift Selection */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
          Chọn ca làm việc hiện tại của bố/mẹ:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'day', label: 'Ca ngày', sub: '6h - 14h', icon: Sun },
            { id: 'evening', label: 'Ca chiều / tối', sub: '14h - 22h', icon: Sunset },
            { id: 'night', label: 'Ca đêm', sub: '22h - 6h', icon: Moon },
            { id: 'rotating', label: 'Xoay ca', sub: 'Thay đổi', icon: Shuffle },
            { id: 'unspecified', label: 'Không khai báo', sub: 'Tự do', icon: Heart },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedShift === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectShift(item.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#173A63] text-white border-[#173A63] shadow-xs ring-2 ring-teal-300 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-[#FFBE45]' : 'text-slate-500'}`} />
                <span className="text-xs block font-bold">{item.label}</span>
                <span className="text-[10px] opacity-75 block">{item.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Shift Schedule */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-teal-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="w-5 h-5 text-[#20B8A6]" />
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Gợi ý lịch kèm con phù hợp: {currentSchedule.title}
            </h3>
            <span className="text-xs text-slate-500">Khung giờ: {currentSchedule.time}</span>
          </div>
        </div>

        {/* Philosophy tip */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-950">
          💡 <span className="font-bold">Lời khuyên tâm lý:</span> {currentSchedule.tip}
        </div>

        {/* Schedule timeline */}
        <div className="space-y-2">
          {currentSchedule.schedule.map((slot, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-mono font-bold text-[#173A63] block">
                  {slot.time}
                </span>
                <p className="font-semibold text-slate-800">{slot.activity}</p>
              </div>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                {slot.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Offline section: "KHÔNG CÓ INTERNET THÌ HỌC GÌ?" */}
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-teal-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-teal-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#20B8A6] text-white rounded-lg">
              <WifiOff className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                KHÔNG CÓ INTERNET THÌ HỌC GÌ?
              </h3>
              <p className="text-xs text-slate-600">
                10 hoạt động trực quan đã lưu sẵn trong máy, không cần mạng 4G hay Wifi, làm ngay bằng đồ dùng trong nhà:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {offlineActivities.map((act, idx) => (
            <div
              key={idx}
              className="bg-white p-3.5 rounded-xl border border-teal-100 shadow-2xs space-y-1"
            >
              <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{act.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
