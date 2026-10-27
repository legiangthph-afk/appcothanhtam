import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "25mb" }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System instruction for Teacher Companion Chatbot
const TEACHER_SYSTEM_INSTRUCTION = `
Bạn là "BẠN ĐỒNG HÀNH AI" - trợ lý ảo chuyên môn thuộc ứng dụng "CÙNG CON 10 PHÚT AI", được phát triển cùng Cô Nguyễn Thị Thanh Tâm (Trường Tiểu học Hoà Sơn, Hoà Khánh, Đà Nẵng).
Đối tượng phục vụ: Phụ huynh có con học Lớp 1 (6-7 tuổi), đặc biệt là bố mẹ bận rộn, công nhân đi làm theo ca, ít thời gian, lo lắng không biết phương pháp sư phạm hiện đại.

TRIẾT LÝ QUAN TRỌNG:
1. TUYỆT ĐỐI KHÔNG làm bài hộ hay chỉ đưa ra kết quả bài toán/bài đọc.
2. HƯỚNG DẪN BỐ MẸ CÁCH DẠY CON: Dùng ngôn từ mộc mạc, gần gũi, tránh thuật ngữ sư phạm phức tạp (như "phép toán đại số", "cấu trúc âm tiết phức hợp"...).
3. Sử dụng đồ dùng thân thuộc có sẵn trong nhà: nắp chai, que tính, hạt đậu, ngón tay, thìa ăn cơm, thẻ giấy.
4. Tôn trọng tâm lý trẻ 6 tuổi: Trẻ mau quên, thích chơi, cần khen ngợi động viên cụ thể, tuyệt đối không đe dọa, la mắng.
5. Mỗi buổi học chỉ 5 - 15 phút.

QUY TẮC CẤU TRÚC PHẢN HỒI (Bắt buộc chia thành 5 phần rõ ràng bằng Markdown):
### 1. BỐ MẸ CẦN BIẾT
(Giải thích ngắn gọn tâm lý hoặc khó khăn của con ở độ tuổi này, trấn an bố mẹ rằng đây là điều bình thường).

### 2. HƯỚNG DẪN TỪNG BƯỚC
(3 đến 5 bước nhỏ, rõ ràng để bố mẹ thao tác cùng con bằng que tính, ngón tay hoặc vật thật).

### 3. BỐ MẸ CÓ THỂ NÓI VỚI CON
(Lời thoại mẫu ngắn gọn, ngọt ngào, gợi mở để bố mẹ đọc nguyên văn cho con nghe).

### 4. THỬ NGAY TRONG 5 PHÚT
(Một hoạt động hoặc trò chơi nhỏ làm ngay trong 5 phút với vật thật).

### 5. LỜI KHUYÊN & LƯU Ý
(Một lưu ý sư phạm tích cực, cách khen con khi con làm đúng hoặc cách động viên khi con chưa hiểu).

LƯU Ý THÊM:
- Nếu phụ huynh hỏi bài tập cụ thể, chỉ ra bản chất bài học, gợi ý câu hỏi để con tự suy nghĩ và tự tìm ra kết quả.
- Luôn giữ thái độ thấu hiểu, ấm áp và khích lệ người làm cha mẹ.
`;

// API: Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, context, preferredMode } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Thiếu nội dung câu hỏi" });
    }

    if (!ai) {
      // Fallback response if API key not available yet
      return res.json({
        reply: `### 1. BỐ MẸ CẦN BIẾT\nCon học lớp 1 đang trong giai đoạn chuyển giao từ mầm non sang tiểu học, việc con tiếp thu từng bước là hoàn toàn bình thường. Bố mẹ hãy kiên nhẫn đồng hành cùng con mỗi ngày 10 phút nhé!\n\n### 2. HƯỚNG DẪN TỪNG BƯỚC\n- **Bước 1:** Chuẩn bị 5-10 nắp chai hoặc que tính nhựa.\n- **Bước 2:** Bố mẹ làm mẫu trước 1 lần thật chậm rãi.\n- **Bước 3:** Đặt câu hỏi gợi mở để con tự tay đếm và thao tác.\n- **Bước 4:** Lắng nghe con nói kết quả và hỏi con: "Vì sao con lại ra kết quả này nhỉ?".\n\n### 3. BỐ MẸ CÓ THỂ NÓI VỚI CON\n"Hai mẹ con mình cùng chơi trò đếm nắp chai siêu tốc xem ai nhanh hơn nhé! Đố con mẹ có mấy chiếc nắp chai trên bàn nào?"\n\n### 4. THỬ NGAY TRONG 5 PHÚT\nLấy 4 thìa cơm đặt trên bàn, đố con lấy thêm 2 thìa nữa để được tất cả bao nhiêu thìa.\n\n### 5. LỜI KHUYÊN & LƯU Ý\nKhen ngợi nỗ lực của con: "Con đã rất cố gắng đếm từng chiếc một, mẹ tự hào về con!".`,
        source: "Chế độ mô phỏng sư phạm lớp 1",
        isSimulated: true,
      });
    }

    let extraContext = "";
    if (context) {
      extraContext = `\n[Tài liệu tham khảo bổ sung từ giáo viên]: ${context}\n`;
    }
    if (preferredMode) {
      extraContext += `\n[Yêu cầu đặc biệt]: ${preferredMode}\n`;
    }

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: `${message}${extraContext}` }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: TEACHER_SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || "Xin lỗi bố mẹ, hệ thống đang bận. Bố mẹ vui lòng thử lại nhé!";
    res.json({ reply, isSimulated: false });
  } catch (err: any) {
    console.error("Gemini Chat Error:", err);
    res.status(500).json({
      error: "Không thể kết nối tới dịch vụ AI",
      details: err?.message || String(err),
    });
  }
});

// API: Image analysis (Multimodal)
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", promptNote = "" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Thiếu dữ liệu ảnh" });
    }

    // Clean base64 data prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    if (!ai) {
      return res.json({
        recognizedText: "Bài toán đếm và phép cộng trong phạm vi 10: 6 + 3 = ?",
        detectedSubject: "Toán lớp 1",
        methodGuide: {
          concept: "Phép cộng thêm trong phạm vi 10 bằng cách đếm tiếp hoặc gộp vật thật.",
          step1: "Bố mẹ lấy sẵn 6 chiếc nắp chai hoặc que tính đặt sang bên trái.",
          step2: "Lấy thêm 3 chiếc nữa đặt sang bên phải.",
          step3: "Bảo con: 'Bên này có 6 cái rồi, con đếm tiếp: 7, 8, 9 nhé!'",
          parentDialog: "'Con yêu, con thử lấy 6 ngón tay, rồi giơ thêm 3 ngón nữa, hai mẹ con mình cùng đếm xem tất cả có bao nhiêu nào!'",
          realObjectGame: "Trò chơi 'Đĩa bánh bí mật': Đặt 6 viên kẹo/hạt lạc trên đĩa, đố con cho thêm 3 hạt nữa.",
          similarExercise: "5 + 2 = ? hoặc 4 + 4 = ?",
          answerForParent: "Kết quả đúng là 9 (Bố mẹ hãy để con tự đếm và tự viết vào vở nhé).",
        },
        isSimulated: true,
      });
    }

    const visionPrompt = `
Bạn là chuyên gia sư phạm tiểu học lớp 1. Bạn vừa nhận được bức ảnh chụp bài tập của một học sinh lớp 1 do phụ huynh gửi tới.
Phụ huynh nhắn thêm: "${promptNote || 'Hướng dẫn tôi cách dạy con bài này'}".

Nhiệm vụ của bạn:
1. Nhận diện nội dung đề bài trong ảnh (chữ, phép tính, hình ảnh, câu hỏi).
2. Xác định môn học (Toán hay Tiếng Việt lớp 1) và bài học liên quan.
3. Hướng dẫn phụ huynh phương pháp sư phạm giúp con TỰ LÀM ĐƯỢC BÀI, KHÔNG CHỈ ĐƯA ĐÁP ÁN.
4. Cung cấp câu hỏi gợi mở để bố mẹ hỏi con, trò chơi bằng đồ vật thật trong nhà (nắp chai, thìa, que tính, hạt đậu).
5. Cho bố mẹ 1 bài tập tương tự để con củng cố.
6. Cung cấp đáp án kiểm tra (để bố mẹ kiểm tra lại sau khi con đã tự suy nghĩ).

Hãy trả về kết quả dưới định dạng JSON hợp lệ tuân thủ schema sau:
{
  "recognizedText": "Nội dung đề bài nhận diện được",
  "detectedSubject": "Toán lớp 1 hoặc Tiếng Việt lớp 1",
  "concept": "Kiến thức trọng tâm con cần nắm",
  "steps": ["Bước 1...", "Bước 2...", "Bước 3..."],
  "parentDialog": "Lời thoại gợi mở bố mẹ nói với con",
  "realObjectGame": "Gợi ý trò chơi 3-5 phút với đồ vật trong nhà",
  "similarExercise": "Bài tập tương tự để luyện tập thêm",
  "answerForParent": "Đáp án và cách giải thích ngắn gọn dành riêng cho phụ huynh"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: visionPrompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    let parsedResult;
    try {
      parsedResult = JSON.parse(response.text || "{}");
    } catch {
      parsedResult = {
        recognizedText: "Bài tập lớp 1",
        detectedSubject: "Toán / Tiếng Việt",
        concept: response.text,
        steps: ["Dùng vật thật để con quan sát", "Hỏi con câu hỏi gợi mở", "Để con tự nói kết quả"],
        parentDialog: "Con hãy thử làm theo cách của con xem nhé!",
        realObjectGame: "Dùng nắp chai hoặc que tính đếm",
        similarExercise: "Thử làm một phép tính tương tự",
        answerForParent: "Bố mẹ kiểm tra kết quả cùng con",
      };
    }

    res.json({
      recognizedText: parsedResult.recognizedText || "Đã phân tích ảnh bài tập",
      detectedSubject: parsedResult.detectedSubject || "Toán lớp 1",
      methodGuide: {
        concept: parsedResult.concept || "Phương pháp rèn luyện trực quan",
        steps: parsedResult.steps || [],
        parentDialog: parsedResult.parentDialog || "",
        realObjectGame: parsedResult.realObjectGame || "",
        similarExercise: parsedResult.similarExercise || "",
        answerForParent: parsedResult.answerForParent || "",
      },
      isSimulated: false,
    });
  } catch (err: any) {
    console.error("Gemini Vision Error:", err);
    res.status(500).json({
      error: "Không thể phân tích ảnh",
      details: err?.message || String(err),
    });
  }
});

// API: Generate Lesson Plan
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { minutes = 10, subject = "Toán", topic = "Phép cộng trong phạm vi 10", studentLevel = "Cần luyện thêm" } = req.body;

    if (!ai) {
      return res.json({
        title: `Kế hoạch kèm con ${minutes} phút: ${topic}`,
        duration: minutes,
        target: `Giúp con tự tin với ${topic} ở mức độ ${studentLevel}`,
        materials: ["5-10 nắp chai hoặc viên sỏi sạch", "Tờ giấy trắng và bút màu"],
        timeline: [
          { time: "Phút 1 - 2", title: "Khởi động & Trò chuyện", detail: "Hỏi con về một sự vật quen thuộc, tạo tâm lý vui vẻ, không áp lực." },
          { time: "Phút 3 - 6", title: "Nhiệm vụ chính với vật thật", detail: "Cho con tự tay cầm nắm đồ vật và giải bài." },
          { time: "Phút 7 - 9", title: "Trò chơi củng cố", detail: "Đố vui phản xạ nhanh, thưởng bằng 1 cái đập tay high-five." },
          { time: `Phút ${minutes}`, title: "Con làm 'thầy giáo'", detail: "Mời con giải thích lại cho bố mẹ nghe cách con đã làm." },
        ],
        parentScript: "'Hôm nay hai mẹ con mình cùng chơi một trò chơi nhỏ nhé, mẹ cần sự trợ giúp của siêu nhân tí hon đấy!'",
        tip: "Hãy luôn kiên nhẫn khi con làm chậm. Tốc độ sẽ tăng dần theo thói quen.",
        isSimulated: true,
      });
    }

    const prompt = `
Hãy thiết kế một kế hoạch học ngắn gọn tại nhà cho phụ huynh lớp 1:
- Thời gian: ${minutes} phút
- Môn học: ${subject}
- Chủ đề: ${topic}
- Trình độ hiện tại của bé: ${studentLevel}

Yêu cầu kế hoạch:
- Đồ dùng cực kỳ đơn giản có sẵn trong nhà.
- Phân chia thời gian từng phút cụ thể.
- Lời thoại mẫu của bố mẹ để nói với con.
- Cách khen ngợi và xử lý khi con chưa hiểu.

Trả về JSON:
{
  "title": "Tên kế hoạch ngắn gọn",
  "duration": ${minutes},
  "target": "Mục tiêu cụ thể",
  "materials": ["Đồ dùng 1", "Đồ dùng 2"],
  "timeline": [
    {"time": "...", "title": "...", "detail": "..."}
  ],
  "parentScript": "Lời thoại mẫu gợi mở",
  "tip": "Mẹo sư phạm tích cực"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ ...data, isSimulated: false });
  } catch (err: any) {
    console.error("Gemini Plan Error:", err);
    res.status(500).json({ error: "Lỗi sinh kế hoạch học", details: err?.message || String(err) });
  }
});

// API: Text-to-Speech (Gemini TTS fallback if Web Speech API is unavailable)
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Thiếu văn bản" });
    }

    if (!ai) {
      return res.status(503).json({ error: "Gemini API chưa sẵn sàng" });
    }

    // Call gemini-3.8-flash-lite-tts
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Đọc lời hướng dẫn bằng giọng tiếng Việt chuẩn, ấm áp, truyền cảm, tốc độ vừa phải cho phụ huynh học sinh tiểu học: ${text.slice(0, 500)}`,
              speechMetadata: {
                style: "Ấm áp, truyền cảm, rõ ràng, tốc độ vừa phải",
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audioBase64: base64Audio, format: "audio/wav" });
    } else {
      res.status(500).json({ error: "Không thể tạo file âm thanh" });
    }
  } catch (err: any) {
    console.error("TTS Error:", err);
    res.status(500).json({ error: "Lỗi dịch vụ đọc", details: err?.message || String(err) });
  }
});

// In dev mode, mount Vite middlewares
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static files
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Cùng Con 10 Phút AI server is running on port ${port}`);
  });
}

startServer();
