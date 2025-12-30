import { GoogleGenAI } from "@google/genai";
import { Category, GeneratedArticle, GroundingSource } from "../types";

// Initialize Gemini Client
// The API key is guaranteed to be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
あなたは「心理学放送局」というWebメディアのAI編集長です。
心理学、メンタルヘルス、人間関係、脳科学などのトピックについて、一般の読者が興味を持てるような、分かりやすく、かつ学術的な根拠（または一般的な説）に基づいた記事を作成してください。
**目標文字数は1500文字以上です。読み応えのある長文記事にしてください。**

以下のガイドラインに従ってください：
1. **タイトル**: 「心理学放送局」らしい、知的好奇心をくすぐるタイトル（例：「なぜ人は〜してしまうのか？」「【心理学】〜の法則とは」など）。
2. **構成**:
    - **導入**: 読者の悩みに寄り添う、または興味を惹きつける導入。
    - **心理学的な解説**: 具体的な心理効果、法則、実験結果などを挙げて解説する（例：認知的不協和、ザイアンス効果など）。専門用語は噛み砕いて説明する。
    - **実生活への応用**: その心理学をどう日常や仕事、恋愛に活かせるかのアドバイス。
    - **ネットの声・ケーススタディ**: 「あるある」と思える架空の事例や、ネット上の一般的な反応を取り入れる（会話形式など）。
    - **結論**: 前向きになれるまとめ。
3. **トーン**: 知的だが堅苦しくない。読者に気づきを与えるトーン。
4. **検索**: 最新の研究や具体的な事例をGoogle検索して情報を補強する。
`;

export const generateArticle = async (topic: string, category: Category): Promise<GeneratedArticle> => {
  const modelId = "gemini-3-flash-preview"; 

  const prompt = `
  トピック: 「${topic}」
  カテゴリ: 「${category}」
  
  このトピックについて、心理学的な観点から深掘りし、1500文字程度の記事を作成してください。
  読者が日常生活で使える具体的なテクニックや、裏付けとなる心理実験のエピソードなどを交えてください。
  画像は生成不要です。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || "記事の生成に失敗しました。";
    
    // Extract grounding sources (search results)
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            url: chunk.web.uri,
          });
        }
      });
    }

    // Heuristic parsing to extract a title
    const lines = text.split('\n');
    let title = lines[0].replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
    if (!title) title = `【心理学】${topic}の真実`;
    
    const contentBody = lines.slice(1).join('\n').trim();

    // Deterministic but pseudo-random image
    const imageId = (topic.length * 17) % 800; 

    return {
      id: Date.now().toString(),
      title: title,
      summary: contentBody.substring(0, 90).replace(/[#*]/g, '') + "...",
      content: contentBody,
      category: category,
      tags: [category, topic, '心理学', 'メンタルヘルス'],
      imageUrl: `https://picsum.photos/id/${imageId}/800/450`,
      createdAt: new Date().toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' }),
      sources: sources,
      viewCount: Math.floor(Math.random() * 8000) + 500
    };

  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("記事の生成中にエラーが発生しました。");
  }
};