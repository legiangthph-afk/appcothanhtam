import { ProgressRecord, SurveyResponse } from '../types';

const PROGRESS_KEY = 'cungcon10p_progress';
const CHILD_NICKNAME_KEY = 'cungcon10p_child_nickname';
const FAVORITES_KEY = 'cungcon10p_favorites';
const SHIFT_SETTING_KEY = 'cungcon10p_shift';
const SURVEYS_KEY = 'cungcon10p_surveys';
const TEACHER_AUTH_KEY = 'cungcon10p_teacher_token';

// Initial sample progress so parents can see how progress tracking works right away!
const INITIAL_DEMO_RECORDS: ProgressRecord[] = [
  {
    id: 'rec-1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subject: 'toan',
    topicTitle: 'Đếm số trong phạm vi 10',
    durationMinutes: 10,
    status: 'doc-lap',
    parentNote: 'Con đếm nắp chai rất nhanh, đếm ngược từ 5 về 1 tốt.',
    childNickname: 'Bé Bống',
  },
  {
    id: 'rec-2',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subject: 'tieng-viet',
    topicTitle: 'Phân biệt các chữ cái dễ nhầm lẫn (b/d)',
    durationMinutes: 10,
    status: 'co-ho-tro',
    parentNote: 'Lúc đầu con vẫn nhầm, sau khi mẹ làm mẹo 2 nắm tay thì con phân biệt được.',
    childNickname: 'Bé Bống',
  },
  {
    id: 'rec-3',
    date: new Date().toISOString().split('T')[0],
    subject: 'toan',
    topicTitle: 'Tách và gộp số (Bản chất cộng trừ)',
    durationMinutes: 15,
    status: 'can-luyen-them',
    parentNote: 'Con tách 5 thành 2 và 3 được, nhưng cần thêm ví dụ tách số 6.',
    childNickname: 'Bé Bống',
  },
];

export function getProgressRecords(): ProgressRecord[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(INITIAL_DEMO_RECORDS));
      return INITIAL_DEMO_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_RECORDS;
  }
}

export function saveProgressRecord(record: Omit<ProgressRecord, 'id'>): ProgressRecord {
  const records = getProgressRecords();
  const newRec: ProgressRecord = {
    ...record,
    id: 'rec-' + Date.now(),
  };
  const updated = [newRec, ...records];
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  return newRec;
}

export function clearProgressRecords(): void {
  localStorage.removeItem(PROGRESS_KEY);
}

export function getChildNickname(): string {
  return localStorage.getItem(CHILD_NICKNAME_KEY) || 'Bé yêu';
}

export function saveChildNickname(nickname: string): void {
  localStorage.setItem(CHILD_NICKNAME_KEY, nickname.trim());
}

export function getShiftSetting(): string {
  return localStorage.getItem(SHIFT_SETTING_KEY) || 'day';
}

export function saveShiftSetting(shift: string): void {
  localStorage.setItem(SHIFT_SETTING_KEY, shift);
}

export function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : ['toan-01', 'tv-02'];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavoriteIds();
  const idx = favs.indexOf(id);
  let updated: string[];
  let isNowFav = false;
  if (idx > -1) {
    updated = favs.filter((item) => item !== id);
  } else {
    updated = [...favs, id];
    isNowFav = true;
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return isNowFav;
}

export function getSurveys(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(SURVEYS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSurvey(survey: Omit<SurveyResponse, 'id' | 'date'>): SurveyResponse {
  const surveys = getSurveys();
  const newEntry: SurveyResponse = {
    ...survey,
    id: 'survey-' + Date.now(),
    date: new Date().toISOString(),
  };
  const updated = [newEntry, ...surveys];
  localStorage.setItem(SURVEYS_KEY, JSON.stringify(updated));
  return newEntry;
}

export function isTeacherLoggedIn(): boolean {
  return localStorage.getItem(TEACHER_AUTH_KEY) === 'teacher_authenticated';
}

export function setTeacherLoggedIn(val: boolean): void {
  if (val) {
    localStorage.setItem(TEACHER_AUTH_KEY, 'teacher_authenticated');
  } else {
    localStorage.removeItem(TEACHER_AUTH_KEY);
  }
}
