import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { ArticleModal } from './components/ArticleModal';
import { TrendingSidebar } from './components/TrendingSidebar';
import { Icons } from './components/Icons';
import { generateArticle } from './services/gemini';
import { Category, GeneratedArticle } from './types';

// Mock initial data focused on Psychology
const MOCK_ARTICLES: GeneratedArticle[] = [
  {
    id: '1',
    title: '【心理学】「やる気」が出ないのはなぜ？脳科学が教えるドーパミンの秘密',
    summary: '「やらなきゃいけないのに動けない」そんな経験はありませんか？実はやる気は「出す」ものではなく、行動した後に「ついてくる」ものなのです...',
    content: `
# やる気待ちをしてはいけない理由

多くの人が誤解していますが、脳科学的観点から言うと「やる気」というスイッチは存在しません。正確には、側坐核という部位が刺激されることでドーパミンが分泌され、作業興奮が起こるのです。

## クレペリンの作業興奮
心理学者のクレペリンが提唱した「作業興奮」。これは、作業を始めると脳が興奮し、どんどん作業に没頭できるようになる現象です。

### 対策：5分だけルール
とにかく5分だけやってみる。これが最強のライフハックです。

## ネットの反応
- 「もっと早く知りたかった…」
- 「掃除し始めたら止まらなくなるあれか」
- 「結局やり始めが一番キツイんだよなぁ」

## まとめ
やる気を待つのではなく、まずは指先一つでも動かしてみる。それが脳を騙す第一歩です。
    `,
    category: Category.BEHAVIOR,
    tags: ['やる気', '脳科学', '習慣化'],
    imageUrl: 'https://picsum.photos/id/106/800/450',
    createdAt: '05/20 08:00',
    sources: [],
    viewCount: 15420
  },
  {
    id: '2',
    title: '【恋愛】「吊り橋効果」は本当に有効？最新の研究で分かったこと',
    summary: 'ドキドキを恋と勘違いする「吊り橋効果」。古典的な心理学テクニックですが、現代の恋愛市場でも通用するのでしょうか？',
    content: `
# ドキドキは恋の始まり？

ダットンとアロンが行った有名な吊り橋実験。恐怖による心拍数の上昇を、相手への好意によるものだと脳が誤帰属するという理論です。

### 現代での応用
- お化け屋敷デート
- アクション映画を見る
- スポーツ観戦

これらは全て「生理的覚醒」を共有する行為です。

## 注意点
ただし、元々嫌いな相手と吊り橋を渡っても、恐怖が増幅されるだけで恋には落ちないという研究結果もあります。

## 結論
ある程度の好感度がある状態でこそ、吊り橋効果は最強のスパイスになります。
    `,
    category: Category.LOVE,
    tags: ['恋愛心理学', '吊り橋効果'],
    imageUrl: 'https://picsum.photos/id/338/800/450',
    createdAt: '05/21 19:30',
    sources: [],
    viewCount: 8900
  },
  {
    id: '3',
    title: '【メンタル】他人と比較して落ち込む「社会的比較」の罠から抜け出す方法',
    summary: 'SNSを見ては「あの子はキラキラしているのに自分は...」と落ち込んでいませんか？上方比較と下方比較を理解して、メンタルを守りましょう。',
    content: `
# SNS時代のメンタルヘルス

人は無意識に他人と自分を比較します。心理学ではこれを「社会的比較過程」と呼びます。

## 上方比較と下方比較
- **上方比較**: 自分より優れている人と比べる。「悔しいから頑張ろう」となればポジティブですが、劣等感に繋がると危険。
- **下方比較**: 自分より劣っている人と比べる。安心感を得られますが、成長は止まるかもしれません。

### 対策：昨日の自分と比べる
陳腐ですが、これが真理です。SNS上の他人は「編集されたハイライト」です。自分の「日常」と比べること自体がナンセンスなのです。
    `,
    category: Category.MENTAL,
    tags: ['SNS疲れ', '自己肯定感'],
    imageUrl: 'https://picsum.photos/id/1011/800/450',
    createdAt: '05/22 12:15',
    sources: [],
    viewCount: 12100
  }
];

// Topics to rotate for automatic updates
const AUTO_TOPICS = [
  "朝のルーティンがメンタルに与える影響",
  "夜の不安を解消する心理テクニック",
  "生産性を高める「ポモドーロ」の科学",
  "人間関係のストレスを減らす「アサーション」",
  "「後回し癖」を治す心理学",
  "良質な睡眠をとるための認知行動療法",
  "色彩心理学：色が感情に与える影響",
  "自己効力感（セルフエフィカシー）の高め方"
];

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [articles, setArticles] = useState<GeneratedArticle[]>(MOCK_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<GeneratedArticle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState('');
  
  // Use a ref to prevent double-execution in Strict Mode
  const hasCheckedSchedule = useRef(false);

  // Handle article generation
  const handleGenerate = async (topic: string) => {
    setIsGenerating(true);
    setLoadingTopic(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const category = activeCategory === Category.ALL ? Category.MENTAL : activeCategory;
      const newArticle = await generateArticle(topic, category);
      
      setArticles(prev => [newArticle, ...prev]);
      setSelectedArticle(newArticle);
    } catch (error) {
      // Automatic updates might fail silently or log to console, 
      // but for user interactions, we show an alert.
      if (!topic.includes('朝の') && !topic.includes('夜の')) {
        alert("記事の生成に失敗しました。");
      }
      console.error(error);
    } finally {
      setIsGenerating(false);
      setLoadingTopic('');
    }
  };

  // Scheduled Update Logic (6:00 AM and 18:00 PM)
  useEffect(() => {
    if (hasCheckedSchedule.current) return;
    hasCheckedSchedule.current = true;

    const checkAndRunSchedule = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const todayStr = now.toLocaleDateString('ja-JP'); // e.g. "2024/5/23"

      // Keys for localStorage to ensure we only run once per slot per day
      const morningKey = `psych_update_${todayStr}_morning`; // for 6:00
      const eveningKey = `psych_update_${todayStr}_evening`; // for 18:00

      let topicToGenerate = null;

      // Morning Update Logic (Available after 6:00)
      if (currentHour >= 6 && !localStorage.getItem(morningKey)) {
        localStorage.setItem(morningKey, "true");
        // Pick a morning-ish topic or random
        topicToGenerate = "朝に読むと1日が前向きになるポジティブ心理学";
      }
      // Evening Update Logic (Available after 18:00)
      else if (currentHour >= 18 && !localStorage.getItem(eveningKey)) {
        localStorage.setItem(eveningKey, "true");
        // Pick an evening-ish topic or random
        topicToGenerate = "1日の疲れを癒やすリラックス心理学";
      }

      if (topicToGenerate) {
        console.log(`Auto-generating scheduled article: ${topicToGenerate}`);
        handleGenerate(topicToGenerate);
      }
    };

    // Run immediately on mount
    checkAndRunSchedule();

    // Set up an interval to check every minute (in case the tab is left open across a boundary)
    const intervalId = setInterval(() => {
       // We reset the ref check for interval execution to allow checking again
       hasCheckedSchedule.current = false; 
       checkAndRunSchedule();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Filter articles based on category
  const filteredArticles = activeCategory === Category.ALL 
    ? articles 
    : articles.filter(art => art.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      <Header 
        onSearch={handleGenerate} 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Loading State */}
            {isGenerating && (
              <div className="bg-white rounded-xl shadow-md border border-teal-100 p-8 mb-8 flex flex-col items-center justify-center text-center animate-pulse">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-white p-3 rounded-full border-2 border-teal-500">
                    <Icons.Loader2 className="animate-spin text-teal-600" size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">AI編集長が記事を執筆中...</h3>
                <p className="text-gray-500 text-sm">テーマ: 「{loadingTopic}」について調査・構成中</p>
                <div className="w-64 h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-teal-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                </div>
              </div>
            )}

            {/* Featured Article (First one) */}
            {!isGenerating && filteredArticles.length > 0 && (
              <div className="mb-8">
                <div 
                  onClick={() => setSelectedArticle(filteredArticles[0])}
                  className="relative h-64 md:h-96 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                >
                  <img 
                    src={filteredArticles[0].imageUrl} 
                    alt={filteredArticles[0].title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                    <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">
                      {filteredArticles[0].category}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2 drop-shadow-md">
                      {filteredArticles[0].title}
                    </h2>
                    <p className="text-gray-200 line-clamp-2 md:text-lg hidden md:block">
                      {filteredArticles[0].summary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 border-l-4 border-teal-600 pl-3">
                {activeCategory}の新着記事
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArticles.slice(1).map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onClick={setSelectedArticle} 
                />
              ))}
              {filteredArticles.length === 0 && !isGenerating && (
                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  <Icons.Newspaper className="mx-auto mb-3 opacity-50" size={48} />
                  <p>まだ記事がありません。右上の検索からトピックを入力して記事を生成してください。</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 hidden lg:block">
            <TrendingSidebar onTrendClick={handleGenerate} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
             <Icons.Sparkles size={20} className="text-teal-400" />
             <span className="font-bold text-white text-lg">心理学放送局</span>
          </div>
          <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
            このサイトの記事はGoogle Gemini AIによって自動生成されています。
            心理学的な知見に基づき構成されていますが、専門的な医療アドバイスの代わりにはなりません。
            <br />Powered by Gemini 1.5 Pro / Flash
          </p>
          <p className="mt-4 text-sm">&copy; 2024 Psychology Station. All rights reserved.</p>
        </div>
      </footer>

      <ArticleModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;