export interface SurveyQuestion {
  id: string;
  question: string;
  options: { label: string; score: number }[];
}

export const PRE_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'pre_q1',
    question: '1. Mỗi ngày bố/mẹ thường dành được bao nhiêu thời gian để kèm con học?',
    options: [
      { label: 'Dưới 10 phút / Rất ít', score: 1 },
      { label: 'Khoảng 10 - 15 phút', score: 2 },
      { label: 'Khoảng 20 - 30 phút', score: 3 },
      { label: 'Trên 45 phút', score: 4 },
    ],
  },
  {
    id: 'pre_q2',
    question: '2. Bố/mẹ có thường gặp khó khăn hoặc lúng túng khi giải thích bài cho con?',
    options: [
      { label: 'Thường xuyên gặp khó khăn', score: 1 },
      { label: 'Thỉnh thoảng gặp khó khăn', score: 2 },
      { label: 'Hiếm khi gặp khó khăn', score: 3 },
      { label: 'Hoàn toàn không gặp khó khăn', score: 4 },
    ],
  },
  {
    id: 'pre_q3',
    question: '3. Mức độ tự tin của bố/mẹ khi hướng dẫn môn Toán lớp 1?',
    options: [
      { label: 'Chưa tự tin chút nào', score: 1 },
      { label: 'Tương đối tự tin', score: 2 },
      { label: 'Khá tự tin', score: 3 },
      { label: 'Rất tự tin', score: 4 },
    ],
  },
  {
    id: 'pre_q4',
    question: '4. Mức độ tự tin của bố/mẹ khi hướng dẫn môn Tiếng Việt lớp 1 (đọc, âm vần, viết)?',
    options: [
      { label: 'Chưa tự tin chút nào', score: 1 },
      { label: 'Tương đối tự tin', score: 2 },
      { label: 'Khá tự tin', score: 3 },
      { label: 'Rất tự tin', score: 4 },
    ],
  },
  {
    id: 'pre_q5',
    question: '5. Bố/mẹ có mong muốn có một trợ lý AI hỗ trợ giải đáp phương pháp sư phạm ngoài giờ học?',
    options: [
      { label: 'Rất mong muốn và cần thiết', score: 4 },
      { label: 'Có mong muốn', score: 3 },
      { label: 'Bình thường', score: 2 },
      { label: 'Chưa có nhu cầu', score: 1 },
    ],
  },
  {
    id: 'pre_q6',
    question: '6. Bố/mẹ có thường sử dụng điện thoại thông minh để tra cứu tài liệu học tập không?',
    options: [
      { label: 'Hàng ngày', score: 4 },
      { label: 'Vài lần một tuần', score: 3 },
      { label: 'Hiếm khi', score: 2 },
      { label: 'Không bao giờ', score: 1 },
    ],
  },
];

export const POST_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'post_q1',
    question: '1. Ứng dụng "CÙNG CON 10 PHÚT AI" có dễ sử dụng trên điện thoại không?',
    options: [
      { label: 'Rất dễ sử dụng, nút bấm rõ ràng', score: 4 },
      { label: 'Khá dễ sử dụng', score: 3 },
      { label: 'Bình thường', score: 2 },
      { label: 'Còn khó thao tác', score: 1 },
    ],
  },
  {
    id: 'post_q2',
    question: '2. Các câu trả lời và hướng dẫn của AI có dễ hiểu và thiết thực không?',
    options: [
      { label: 'Rất dễ hiểu, áp dụng được ngay', score: 4 },
      { label: 'Dễ hiểu với bố mẹ bận rộn', score: 3 },
      { label: 'Mức độ trung bình', score: 2 },
      { label: 'Khó hiểu hoặc quá dài', score: 1 },
    ],
  },
  {
    id: 'post_q3',
    question: '3. Sau khi dùng ứng dụng, bố/mẹ có cảm thấy tự tin hơn khi kèm con học tại nhà?',
    options: [
      { label: 'Tự tin hơn rất nhiều', score: 4 },
      { label: 'Tự tin hơn rõ rệt', score: 3 },
      { label: 'Hơi tự tin hơn một chút', score: 2 },
      { label: 'Chưa thấy thay đổi', score: 1 },
    ],
  },
  {
    id: 'post_q4',
    question: '4. Thời gian chuẩn bị hoạt động và căng thẳng khi kèm con có giảm đi không?',
    options: [
      { label: 'Giảm rất nhiều, không còn mệt mỏi', score: 4 },
      { label: 'Có giảm đáng kể', score: 3 },
      { label: 'Giảm nhẹ', score: 2 },
      { label: 'Không thay đổi', score: 1 },
    ],
  },
  {
    id: 'post_q5',
    question: '5. Con có vui vẻ và hợp tác hơn khi học cùng bố mẹ theo từng bước nhỏ 10 phút?',
    options: [
      { label: 'Con rất hào hứng và hợp tác', score: 4 },
      { label: 'Con hợp tác hơn trước', score: 3 },
      { label: 'Tương tự trước đây', score: 2 },
      { label: 'Con chưa hợp tác', score: 1 },
    ],
  },
  {
    id: 'post_q6',
    question: '6. Bố/mẹ có mong muốn tiếp tục sử dụng và giới thiệu ứng dụng cho các phụ huynh khác?',
    options: [
      { label: 'Chắc chắn tiếp tục và sẽ chia sẻ', score: 4 },
      { label: 'Sẽ tiếp tục sử dụng', score: 3 },
      { label: 'Có thể', score: 2 },
      { label: 'Chưa có ý định', score: 1 },
    ],
  },
];

// Teacher Research Pilot Sample Data (minh chứng thực nghiệm 42 phụ huynh lớp 1 tại TH Hoà Sơn)
export const TEACHER_PILOT_STATS = {
  totalParentsJoined: 48,
  activeParentsWeekly: 42,
  totalChatSessions: 326,
  totalActivitiesCompleted: 512,
  averageRating: 4.8,
  confidenceBeforePercent: 32, // Chỉ 32% tự tin trước khi dùng
  confidenceAfterPercent: 89,  // Tăng lên 89% tự tin sau 4 tuần
  stressReductionPercent: 78,
  topSubjectsAsked: [
    { name: 'Cộng/trừ phạm vi 10', count: 98, subject: 'Toán' },
    { name: 'Phân biệt b và d', count: 74, subject: 'Tiếng Việt' },
    { name: 'Tách và gộp số', count: 62, subject: 'Toán' },
    { name: 'Ghép âm và vần', count: 55, subject: 'Tiếng Việt' },
    { name: 'Kèm con làm ca tối', count: 47, subject: 'Tâm lý' },
  ],
  weeklyActivityChart: [
    { day: 'Thứ 2', sessions: 52, minutes: 540 },
    { day: 'Thứ 3', sessions: 48, minutes: 490 },
    { day: 'Thứ 4', sessions: 61, minutes: 630 },
    { day: 'Thứ 5', sessions: 58, minutes: 590 },
    { day: 'Thứ 6', sessions: 42, minutes: 420 },
    { day: 'Thứ 7', sessions: 76, minutes: 890 },
    { day: 'Chủ nhật', sessions: 85, minutes: 980 },
  ],
  surveyComparisonData: [
    { criterion: 'Mức tự tin kèm Toán', before: 38, after: 91 },
    { criterion: 'Mức tự tin kèm Tiếng Việt', before: 42, after: 88 },
    { criterion: 'Sự hợp tác của trẻ', before: 29, after: 85 },
    { criterion: 'Giảm áp lực & mệt mỏi', before: 31, after: 84 },
    { criterion: 'Thói quen 10p mỗi ngày', before: 22, after: 79 },
  ],
};
