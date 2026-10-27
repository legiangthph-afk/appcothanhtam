import React, { useState } from 'react';
import {
  Gamepad2,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { PHYSICAL_GAMES } from '../data/games';
import { PhysicalGame } from '../types';
import { speechManager } from '../utils/speech';

export const GamesSection: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string>('game-01');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handleToggleSpeak = (game: PhysicalGame) => {
    if (speakingId === game.id) {
      speechManager.stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(game.id);
      const textToSpeak = `Trò chơi ${game.order}: ${game.title}. Chuẩn bị: ${game.materials.join(', ')}. Cách chơi: ${game.rules.join('; ')}. Lời hướng dẫn bố mẹ: ${game.parentInstructions}.`;
      speechManager.speak(textToSpeak).finally(() => setSpeakingId(null));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Title */}
      <div className="bg-gradient-to-r from-[#173A63] to-[#1f4e85] rounded-2xl p-4 sm:p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-[#20B8A6] rounded-lg">
            <Gamepad2 className="w-5 h-5 text-white" />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">TRÒ CHƠI HỌC CÙNG CON</h2>
        </div>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
          6 trò chơi tương tác bằng đồ vật thật có sẵn trong gia đình. Học mà chơi – Chơi mà học, tuyệt đối không xếp hạng cạnh tranh giữa các bé.
        </p>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {PHYSICAL_GAMES.map((game) => {
          const isExpanded = selectedGameId === game.id;
          const isSpeaking = speakingId === game.id;

          return (
            <div
              key={game.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-teal-400 shadow-md ring-1 ring-teal-200'
                  : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setSelectedGameId(isExpanded ? '' : game.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#20B8A6] font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {game.order}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                      {game.subject === 'toan' ? 'Toán Lớp 1' : 'Tiếng Việt Lớp 1'}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      {game.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {game.materials.length} đồ dùng
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Details */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-teal-50/70 p-3 rounded-xl border border-teal-200">
                    <p className="text-xs text-teal-950 font-medium">
                      🎯 <span className="font-bold">Mục tiêu:</span> {game.target}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSpeak(game);
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

                  {/* Materials */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">
                      📦 Đồ dùng chuẩn bị (có sẵn trong nhà):
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {game.materials.map((m: string, idx: number) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Rules */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Luật chơi đơn giản:
                    </span>
                    {game.rules.map((rule: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-[#173A63] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>

                  {/* Parent Instructions & How to finish */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
                      <span className="font-bold block mb-1 text-amber-800">
                        Bố mẹ hướng dẫn con:
                      </span>
                      <p>{game.parentInstructions}</p>
                    </div>

                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                      <span className="font-bold block mb-1 text-emerald-800">
                        Cách xác định hoàn thành:
                      </span>
                      <p>{game.howToFinish}</p>
                    </div>
                  </div>

                  {/* Adjust difficulty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-100 p-2.5 rounded-xl">
                      <span className="font-bold text-slate-700 block mb-0.5">
                        🟢 Khi con mới làm quen (Dễ hơn):
                      </span>
                      <p className="text-slate-600">{game.adjustDifficulty.easier}</p>
                    </div>
                    <div className="bg-slate-100 p-2.5 rounded-xl">
                      <span className="font-bold text-slate-700 block mb-0.5">
                        🔴 Khi con đã vững (Thử thách hơn):
                      </span>
                      <p className="text-slate-600">{game.adjustDifficulty.harder}</p>
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
