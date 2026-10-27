import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ChatBot } from './components/ChatBot';
import { ImageAnalysis } from './components/ImageAnalysis';
import { QuickSession } from './components/QuickSession';
import { MathRepository } from './components/MathRepository';
import { VietnameseRepository } from './components/VietnameseRepository';
import { ParentTips } from './components/ParentTips';
import { ProgressTracker } from './components/ProgressTracker';
import { TeacherCorner } from './components/TeacherCorner';
import { ShiftWorkerMode } from './components/ShiftWorkerMode';
import { ParentSurveyModal } from './components/ParentSurveyModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EFF9F8] text-slate-800 flex flex-col font-sans">
      {/* Sticky Navbar */}
      <Navbar
        currentTab={currentTab}
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
        onOpenSurveyModal={() => setIsSurveyModalOpen(true)}
        onOpenTeacherCorner={() => setCurrentTab('teacher')}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenShiftModal={() => setIsShiftModalOpen(true)}
            onOpenSurveyModal={() => setIsSurveyModalOpen(true)}
            onOpenTeacherCorner={() => setCurrentTab('teacher')}
          />
        )}

        {currentTab === 'chat' && <ChatBot />}

        {currentTab === 'camera' && <ImageAnalysis />}

        {currentTab === 'session' && (
          <QuickSession onSessionSaved={() => setCurrentTab('progress')} />
        )}

        {currentTab === 'math' && <MathRepository />}

        {currentTab === 'vietnamese' && <VietnameseRepository />}

        {currentTab === 'tips' && <ParentTips />}

        {currentTab === 'progress' && <ProgressTracker />}

        {currentTab === 'teacher' && <TeacherCorner />}
      </main>

      {/* Shift Worker Modal */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setIsShiftModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>
            <ShiftWorkerMode onClose={() => setIsShiftModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Parent Survey Modal */}
      <ParentSurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
      />

      {/* Fixed Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}
