import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Database, RefreshCw, Globe, Tag, CheckCircle, 
  AlertCircle, Loader2, Layers, Filter, Download, Upload, 
  Settings, Eye, Table, Code, ChevronRight, ChevronDown, 
  PlusCircle, Image as ImageIcon, Link as LinkIcon, BookOpen, BarChart2, Trash2, AlignLeft, Hash, Combine
} from 'lucide-react';

// --- 固定カテゴリ定義 ---
const FIXED_CATEGORIES = [
  "最先端テクノロジー",
  "料理と食文化",
  "旅行と観光",
  "健康とフィットネス",
  "経済と金融",
  "エンタメ・映画",
  "スポーツ",
  "教育と学習",
  "ファッション・美容",
  "環境とサステナビリティ"
];

// --- サイトデータ定義 (全50件) ---
const INITIAL_SITES = [
  // 1. 最先端テクノロジー
  { category: "最先端テクノロジー", site_name: "ITmedia NEWS", url: "https://www.itmedia.co.jp/news/", summary: "IT業界の最新動向、ネット事件、AI関連の最新トレンドを網羅するニュースサイト。", tags: ["ITニュース", "AI", "ガジェット", "ネット社会", "DX"] },
  { category: "最先端テクノロジー", site_name: "TechCrunch Japan", url: "https://jp.techcrunch.com/", summary: "スタートアップ企業の動向や新技術、VC投資情報に強いテクノロジーメディア。", tags: ["スタートアップ", "起業", "新技術", "投資", "シリコンバレー"] },
  { category: "最先端テクノロジー", site_name: "Gizmodo Japan", url: "https://www.gizmodo.jp/", summary: "ガジェット紹介から宇宙開発、サイエンスまでを扱うエンタメ系テックメディア。", tags: ["ガジェット", "家電", "宇宙", "サイエンス", "レビュー"] },
  { category: "最先端テクノロジー", site_name: "Qiita", url: "https://qiita.com/", summary: "エンジニアが技術情報を共有し、プログラミング知識を蓄積するためのコミュニティサイト。", tags: ["プログラミング", "エンジニア", "開発", "Tips", "オープンソース"] },
  { category: "最先端テクノロジー", site_name: "Wired Japan", url: "https://wired.jp/", summary: "テクノロジーが社会やカルチャーに与える影響を深掘りするグローバルメディア。", tags: ["未来予測", "カルチャー", "デザイン", "社会問題", "イノベーション"] },
  // 2. 料理と食文化
  { category: "料理と食文化", site_name: "クックパッド", url: "https://cookpad.com/", summary: "一般ユーザーが投稿した数百万件のレシピを検索できる日本最大級の料理サイト。", tags: ["レシピ", "家庭料理", "献立", "自炊", "つくれぽ"] },
  { category: "料理と食文化", site_name: "食べログ", url: "https://tabelog.com/", summary: "ユーザーの口コミとランキングを元に、全国の飲食店を検索・予約できるグルメサイト。", tags: ["グルメ", "レストラン", "口コミ", "ランキング", "飲み会"] },
  { category: "料理と食文化", site_name: "楽天レシピ", url: "https://recipe.rakuten.co.jp/", summary: "人気順の検索が無料で利用でき、料理を作るとポイントが貯まるレシピサイト。", tags: ["時短料理", "節約レシピ", "楽天ポイント", "料理初心者", "お弁当"] },
  { category: "料理と食文化", site_name: "クラシル", url: "https://www.kurashiru.com/", summary: "1分程度の短い動画で、初心者でも分かりやすく料理の手順を解説する動画サービス。", tags: ["料理動画", "簡単レシピ", "献立作成", "主婦", "丁寧な暮らし"] },
  { category: "料理と食文化", site_name: "レタスクラブ", url: "https://www.lettuceclub.net/", summary: "雑誌発のレシピサイトで、プロの料理家による信頼性の高いレシピを提供。", tags: ["プロの味", "生活知恵", "雑誌掲載", "掃除", "家事"] },
  // 3. 旅行と観光
  { category: "旅行と観光", site_name: "じゃらんnet", url: "https://www.jalan.net/", summary: "国内の宿泊予約、温泉、観光スポット情報が充実した旅行サイト。", tags: ["国内旅行", "温泉", "ホテル予約", "家族旅行", "観光"] },
  { category: "旅行と観光", site_name: "楽天トラベル", url: "https://travel.rakuten.co.jp/", summary: "楽天グループが運営する、ホテル・航空券・高速バスの総合予約サイト。", tags: ["ビジネスホテル", "パックツアー", "宿探し", "高速バス", "ポイント還元"] },
  { category: "旅行と観光", site_name: "トリップアドバイザー", url: "https://www.tripadvisor.jp/", summary: "世界中のホテル、航空券、観光体験の口コミを比較できる世界最大級の旅行プラットフォーム。", tags: ["海外旅行", "口コミ比較", "現地ツアー", "世界遺産", "レジャー"] },
  { category: "旅行と観光", site_name: "トラベルjp", url: "https://www.travel.co.jp/", summary: "複数の旅行サイトを一括比較し、最安値のツアーや航空券を検索できるガイドメディア。", tags: ["比較サイト", "激安旅行", "週末旅行", "女子旅", "一人旅"] },
  { category: "旅行と観光", site_name: "RETRIP", url: "https://rtrp.jp/", summary: "絶景やトレンドスポットを写真中心の記事で紹介する、若者に人気の観光まとめメディア。", tags: ["インスタ映え", "デートスポット", "カフェ巡り", "まとめ記事", "旅行ガイド"] },
  // 4. 健康とフィットネス
  { category: "健康とフィットネス", site_name: "Tarzan Web", url: "https://tarzanweb.jp/", summary: "筋トレ、ダイエット、最新のトレーニング理論などを発信するフィットネス情報サイト。", tags: ["筋トレ", "ダイエット", "ボディメイク", "食事制限", "体幹"] },
  { category: "健康とフィットネス", site_name: "NHK健康ch", url: "https://www.nhk.or.jp/kenko/", summary: "専門医の解説に基づき、病気の症状や予防、健康維持のヒントを正しく伝える情報サイト。", tags: ["医学", "予防", "メンタルケア", "生活習慣病", "医師解説"] },
  { category: "健康とフィットネス", site_name: "Women's Health", url: "https://www.womenshealthmag.com/jp/", summary: "女性のライフスタイル、ヨガ、ウェルネス、ワークアウトを幅広く扱うメディア。", tags: ["ヨガ", "ウェルネス", "美容習慣", "女性向け", "ワークアウト"] },
  { category: "健康とフィットネス", site_name: "FYTTE", url: "https://fytte.jp/", summary: "ヘルシーな食事やエクササイズなど、きれいになりたい女性のための健康情報サイト。", tags: ["ダイエットレシピ", "ストレッチ", "セルフケア", "ヘルスケア", "腸活"] },
  { category: "健康とフィットネス", site_name: "ヨガジャーナルオンライン", url: "https://yogajournal.jp/", summary: "ヨガのポーズ解説、瞑想、スピリチュアル、健康的な食生活を紹介する専門サイト。", tags: ["ヨガポーズ", "瞑想", "マインドフルネス", "柔軟", "精神安定"] },
  // 5. 経済と金融
  { category: "経済と金融", site_name: "日本経済新聞", url: "https://www.nikkei.com/", summary: "国内外の経済ニュース、企業の業績、市場動向を速報する日本を代表する経済紙。", tags: ["経済", "株価", "企業ニュース", "政治", "グローバル"] },
  { category: "経済と金融", site_name: "Bloomberg Japan", url: "https://www.bloomberg.co.jp/", summary: "世界の金融市場、為替、債券、商品市場の情報をリアルタイムで発信するビジネスメディア。", tags: ["金融", "為替", "投資情報", "マーケット", "経済分析"] },
  { category: "経済と金融", site_name: "Yahoo!ファイナンス", url: "https://finance.yahoo.co.jp/", summary: "株価、投資信託、FXなどの投資情報や掲示板、ニュースを提供する個人投資家向けサイト。", tags: ["個人投資家", "株式チャート", "つみたてNISA", "掲示板", "為替レート"] },
  { category: "経済と金融", site_name: "マネーフォワード ME", url: "https://moneyforward.com/", summary: "家計管理、資産形成、節税など、身近なお金に関する知識をわかりやすく解説するメディア。", tags: ["家計簿", "節約", "資産運用", "ライフプラン", "確定申告"] },
  { category: "経済と金融", site_name: "ダイヤモンド・オンライン", url: "https://diamond.jp/", summary: "ビジネスマン向けに、経済動向から企業の深掘り記事、キャリア、マネー情報を発信。", tags: ["ビジネス", "経営戦略", "キャリア", "マネー知識", "経済コラム"] },
  // 6. エンタメ・映画
  { category: "エンタメ・映画", site_name: "音楽ナタリー", url: "https://natalie.mu/music", summary: "ポップス、ロックから声優まで、最新の音楽ニュースやインタビューを届ける専門サイト。", tags: ["音楽", "アーティスト", "ライブ", "新譜", "インタビュー"] },
  { category: "エンタメ・映画", site_name: "シネマトゥデイ", url: "https://www.cinematoday.jp/", summary: "新作映画の公開情報、予告編、俳優のニュース、レビューを扱う映画総合サイト。", tags: ["映画ニュース", "上映スケジュール", "新作映画", "映画祭", "邦画"] },
  { category: "エンタメ・映画", site_name: "IGN Japan", url: "https://jp.ign.com/", summary: "世界最大のゲームメディアの日本版。最新ゲーム機やタイトルのレビュー、映画情報も。", tags: ["ビデオゲーム", "PS5", "Switch", "eスポーツ", "PCゲーム"] },
  { category: "エンタメ・映画", site_name: "ファミ通.com", url: "https://www.famitsu.com/", summary: "ゲームファンから高い知名度を持つ、最新ソフト情報や攻略記事、業界動向を扱うメディア。", tags: ["ゲーム攻略", "発売日", "業界ニュース", "アプリ", "コミック"] },
  { category: "エンタメ・映画", site_name: "MOVIE WALKER PRESS", url: "https://moviewalker.jp/", summary: "上映中の映画館検索やムビチケ販売、映画コラム、試写会情報を掲載。", tags: ["ムビチケ", "映画館", "上映中", "興行収入", "レビュー"] },
  // 7. スポーツ
  { category: "スポーツ", site_name: "スポーツナビ", url: "https://sports.yahoo.co.jp/", summary: "野球、サッカー、テニスなど、主要スポーツの速報やスコアを網羅する日本最大級のスポーツサイト。", tags: ["スポーツ速報", "プロ野球", "Jリーグ", "スコア", "順位表"] },
  { category: "スポーツ", site_name: "Number Web", url: "https://number.bunshun.jp/", summary: "選手の内面に迫るドキュメンタリーやコラムに定評のある、質の高いスポーツ総合メディア。", tags: ["スポーツコラム", "ドキュメンタリー", "インタビュー", "箱根駅伝", "MLB"] },
  { category: "スポーツ", site_name: "サッカーキング", url: "https://www.soccer-king.jp/", summary: "世界中のサッカーニュース、代表チーム、移籍情報に特化したサッカー専門メディア。", tags: ["サッカー", "日本代表", "海外サッカー", "移籍情報", "試合分析"] },
  { category: "スポーツ", site_name: "ベースボールキング", url: "https://baseballking.jp/", summary: "プロ野球の各チームの動向、ドラフト、独立リーグまで野球情報を幅広くカバー。", tags: ["野球", "NPB", "メジャーリーグ", "ドラフト", "高校野球"] },
  { category: "スポーツ", site_name: "J SPORTS", url: "https://www.jsports.co.jp/", summary: "ラグビー、サイクルロードレース、モータースポーツなど多様な競技の放送・情報を扱う。", tags: ["サイクルロードレース", "ラグビー", "モータースポーツ", "スキー", "中継"] },
  // 8. 教育と学習
  { category: "教育と学習", site_name: "Schoo", url: "https://schoo.jp/", summary: "ビジネススキルからデザイン、教養まで、生放送授業で学べるオンライン学習プラットフォーム。", tags: ["リスキリング", "社会人学習", "ビジネススキル", "オンライン講座", "ライブ授業"] },
  { category: "教育と学習", site_name: "Duolingo", url: "https://www.duolingo.com/", summary: "ゲーム感覚で楽しく、短時間で多言語を習得できる世界的に有名な語学学習アプリ。", tags: ["英会話", "言語学習", "外国語", "アプリ", "初心者"] },
  { category: "教育と学習", site_name: "リクナビNEXT", url: "https://next.rikunabi.com/", summary: "転職活動を支援する求人情報サイトで、履歴書の書き方などのノウハウも豊富。", tags: ["転職", "求人", "キャリア", "自己分析", "面接対策"] },
  { category: "教育と学習", site_name: "StudyHacker", url: "https://studyhacker.net/", summary: "「学び」の生産性を高めるための勉強法や仕事術を科学的根拠に基づいて紹介するメディア。", tags: ["勉強法", "生産性", "暗記術", "資格試験", "自己啓発"] },
  { category: "教育と学習", site_name: "理系ナビ", url: "https://rikeinavi.com/", summary: "理系学生向けの就職・インターンシップ情報や、科学技術に関するコラムを掲載。", tags: ["科学", "テクノロジー", "インターン", "就職活動", "理系"] },
  // 9. ファッション・美容
  { category: "ファッション・美容", site_name: "@cosme", url: "https://www.cosme.net/", summary: "化粧品の口コミランキングや新作情報が満載の、美容に関心のある層の必須サイト。", tags: ["コスメ", "スキンケア", "化粧品", "口コミ", "ベストコスメ"] },
  { category: "ファッション・美容", site_name: "WEAR", url: "https://wear.jp/", summary: "ユーザーのファッションコーディネートを検索・閲覧し、そのままアイテムを購入できるSNS。", tags: ["コーディネート", "トレンド", "着こなし", "ストリート", "ファッションスナップ"] },
  { category: "ファッション・美容", site_name: "VOGUE JAPAN", url: "https://www.vogue.co.jp/", summary: "世界最高峰のファッション誌。最新のコレクション情報やハイエンドな美容情報を発信。", tags: ["ハイブランド", "コレクション", "モード", "メイクアップ", "セレブ"] },
  { category: "ファッション・美容", site_name: "Oggi.jp", url: "https://oggi.jp/", summary: "働く女性をターゲットに、きれいめなファッション、美容、キャリア情報を提案するメディア。", tags: ["オフィスコーデ", "女子力", "美容法", "仕事服", "ライフスタイル"] },
  { category: "ファッション・美容", site_name: "MAQUIA ONLINE", url: "https://maquia.hpplus.jp/", summary: "雑誌「MAQUIA」のWeb版。メイク術、スキンケア、インナービューティー情報を詳述。", tags: ["メイク動画", "美容法", "スキンケア", "コスメレビュー", "小顔"] },
  // 10. 環境とサステナビリティ
  { category: "環境とサステナビリティ", site_name: "IDEAS FOR GOOD", url: "https://ideasforgood.jp/", summary: "世界中のソーシャルグッドなアイデアを紹介し、社会問題の解決を促すクリエイティブメディア。", tags: ["社会貢献", "SDGs", "エシカル", "サステナブル", "デザイン"] },
  { category: "環境とサステナビリティ", site_name: "グリーンピース・ジャパン", url: "https://www.greenpeace.org/japan/", summary: "環境保護を目的とした国際NGOの日本支部。気候変動や海洋保護のキャンペーンを主導。", tags: ["環境保護", "気候変動", "プラスチック削減", "海洋汚染", "アクティビズム"] },
  { category: "環境とサステナビリティ", site_name: "WWFジャパン", url: "https://www.wwf.or.jp/", summary: "絶滅危惧種の保護や森林保全、地球温暖化防止に取り組む世界的な環境保全団体。", tags: ["野生動物", "生態系", "自然保護", "地球温暖化", "寄付"] },
  { category: "環境とサステナビリティ", site_name: "ナショナル ジオグラフィック日本版", url: "https://natgeo.nikkeibp.co.jp/", summary: "自然、動物、科学、歴史の驚異を、圧倒的な写真と緻密な取材で伝えるメディア。", tags: ["動物", "環境破壊", "考古学", "探検", "地球"] },
  { category: "環境とサステナビリティ", site_name: "Circular Economy Hub", url: "https://cehub.jp/", summary: "資源を循環させる「サーキュラーエコノミー」の仕組みや国内外の事例を紹介する専門サイト。", tags: ["循環型経済", "リサイクル", "廃棄物削減", "ビジネスモデル", "環境経営"] }
];

// --- ユーティリティ ---
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
};

const isImageUrl = (url) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);

// --- メインコンポーネント ---
export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [db, setDb] = useState(null);
  const [sites, setSites] = useState([]);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ summary: [], combined: [] });
  const [viewMode, setViewMode] = useState("search"); 
  const [urlToAnalyze, setUrlToAnalyze] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [availableModels, setAvailableModels] = useState({ text: [], embedding: [] });
  const [selectedModels, setSelectedModels] = useState({
    text: "gemini-2.0-flash",
    embedding: "text-embedding-004"
  });

  const DB_NAME = "VectorLab_Japanese_V8";
  const STORE_NAME = "sites_v8";

  useEffect(() => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as any).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "site_name" });
      }
    };
    request.onsuccess = (e) => {
      const db = (e.target as any).result;
      setDb(db);
      refreshData(db);
    };
    request.onerror = () => setStatus("error");
  }, []);

  const fetchModels = async () => {
    if (!apiKey) return;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (!response.ok) throw new Error("モデル情報の取得に失敗しました");
      const data = await response.json();
      const embedding = data.models.filter(m => m.supportedGenerationMethods.includes("embedContent")).map(m => m.name.replace('models/', ''));
      const text = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).map(m => m.name.replace('models/', ''));
      setAvailableModels({ text, embedding });
    } catch (err) { console.error(err); }
  };

  const refreshData = (database) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      setSites(request.result);
      if (request.result.length > 0) setStatus("ready");
    };
  };

  const fetchEmbedding = async (text, taskType = "RETRIEVAL_DOCUMENT") => {
    if (!apiKey) throw new Error("APIキーが必要です");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModels.embedding}:embedContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${selectedModels.embedding}`,
        content: { parts: [{ text }] },
        taskType: taskType
      })
    });
    if (!response.ok) throw new Error(`APIエラー: ${response.status}`);
    const result = await response.json();
    return result.embedding.values;
  };

  const analyzeUrlAndMedia = async () => {
    if (!urlToAnalyze || !apiKey) return;
    setIsAnalyzing(true);
    try {
      const isImg = isImageUrl(urlToAnalyze);
      const systemPrompt = `
        解析対象のURLまたは画像を評価し、以下の日本語のJSON形式で回答してください。
        カテゴリは必ずこのリストから1つ厳選してください: [${FIXED_CATEGORIES.join(", ")}]
        {
          "site_name": "サイトの名称またはタイトル",
          "summary": "100文字以内の自然な日本語による要約",
          "category": "選んだカテゴリ名",
          "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"]
        }
      `;

      let analysis;
      if (isImg) {
        const imgResponse = await fetch(urlToAnalyze);
        const blob = await imgResponse.blob();
        const base64 = await new Promise(r => {
          const reader = new FileReader();
          reader.onloadend = () => r((reader.result as string).split(',')[1]);
          reader.readAsDataURL(blob);
        });
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModels.text}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }, { inlineData: { mimeType: blob.type, data: base64 } }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        const data = await res.json();
        analysis = JSON.parse(data.candidates[0].content.parts[0].text);
      } else {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModels.text}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n対象URL: ${urlToAnalyze}` }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        const data = await res.json();
        analysis = JSON.parse(data.candidates[0].content.parts[0].text);
      }

      const sEmb = await fetchEmbedding(analysis.summary, "RETRIEVAL_DOCUMENT");
      const combinedText = `${analysis.summary} ${analysis.tags.join(" ")}`;
      const cEmb = await fetchEmbedding(combinedText, "RETRIEVAL_DOCUMENT");

      const transaction = db.transaction(STORE_NAME, "readwrite");
      await transaction.objectStore(STORE_NAME).put({
        ...analysis, url: urlToAnalyze, summary_embedding: sEmb, combined_embedding: cEmb
      });
      refreshData(db);
      setUrlToAnalyze("");
      setViewMode("explorer");
    } catch (err) {
      console.error(err);
      alert("解析に失敗しました。URLが正しいか、CORS制限がないか確認してください。");
    } finally { setIsAnalyzing(false); }
  };

  const startIndexing = async () => {
    if (!apiKey) return;
    setStatus("indexing");
    setProgress(0);
    try {
      for (let i = 0; i < INITIAL_SITES.length; i++) {
        const site = INITIAL_SITES[i];
        const sEmb = await fetchEmbedding(site.summary, "RETRIEVAL_DOCUMENT");
        const combinedText = `${site.summary} ${site.tags.join(" ")}`;
        const cEmb = await fetchEmbedding(combinedText, "RETRIEVAL_DOCUMENT");
        
        const tx = db.transaction(STORE_NAME, "readwrite");
        await tx.objectStore(STORE_NAME).put({ 
          ...site, 
          summary_embedding: sEmb, 
          combined_embedding: cEmb 
        });
        setProgress(Math.round(((i + 1) / INITIAL_SITES.length) * 100));
        await new Promise(r => setTimeout(r, 100));
      }
      refreshData(db);
    } catch (err) { console.error(err); setStatus("error"); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery || !apiKey) return;
    setStatus("searching");
    try {
      const qVector = await fetchEmbedding(searchQuery, "RETRIEVAL_QUERY");
      const scored = sites.map(s => {
        const sScore = cosineSimilarity(qVector, s.summary_embedding);
        const cScore = cosineSimilarity(qVector, s.combined_embedding);
        return { ...s, sScore, cScore };
      });
      setSearchResults({
        summary: [...scored].sort((a, b) => b.sScore - a.sScore).slice(0, 10),
        combined: [...scored].sort((a, b) => b.cScore - a.cScore).slice(0, 10)
      });
      setStatus("ready");
    } catch (err) { console.error(err); setStatus("error"); }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(sites, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `vector_lab_export.json`;
    a.click();
  };

  // 検索結果カード
  const ResultCard = ({ result, score, rank }) => (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg w-fit uppercase tracking-wider">{result.category}</span>
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 w-fit">
            類似度: {(score * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-slate-100 text-slate-400 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
          {rank}
        </div>
      </div>
      <h4 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-2 leading-tight">
        {result.site_name}
        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-indigo-600 transition-colors"><Globe size={14} /></a>
      </h4>
      <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-4 flex-grow">{result.summary}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {result.tags.map((t, ti) => (
          <span key={ti} className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-transparent group-hover:border-indigo-100">#{t}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ナビゲーション */}
        <nav className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-2xl text-white shadow-lg"><Layers size={24} /></div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">ベクトル検索 比較ラボ</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sites.length} 件のインデックス済みデータ</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative group">
              <input 
                type="password" placeholder="Gemini APIキーを入力"
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-48 transition-all"
                value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                onBlur={fetchModels}
              />
              <Settings size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-2xl ml-2">
              {[
                { id: "search", label: "検索比較", icon: <Search size={14} /> },
                { id: "library", label: "ライブラリ", icon: <BookOpen size={14} /> },
                { id: "explorer", label: "データ管理", icon: <Database size={14} /> },
                { id: "analyzer", label: "URL追加", icon: <PlusCircle size={14} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black tracking-tight transition-all ${viewMode === tab.id ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* 進捗表示 */}
        {status === "indexing" && (
          <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4"><Loader2 className="animate-spin" size={24} /><span className="font-bold tracking-tight">AIがデータを解析・多次元ベクトル化しています...</span></div>
            <div className="text-2xl font-black font-mono">{progress}%</div>
          </div>
        )}

        {/* 検索比較モード */}
        {viewMode === 'search' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" size={24} />
              <input 
                type="text" placeholder="どのような情報をお探しですか？（例：AIの最新ニュース、美味しいイタリア料理など）"
                className="w-full pl-16 pr-32 py-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm text-lg outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" disabled={!apiKey || status === "searching"} className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center gap-2">
                {status === "searching" ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                検索
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 要約のみの結果 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><AlignLeft size={20} /></div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-black text-slate-700">要約マッチ</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">文章としての「意味」のみを評価</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {searchResults.summary.length > 0 ? (
                    searchResults.summary.map((r, i) => (
                      <ResultCard key={i} result={r} score={r.sScore} rank={i + 1} />
                    ))
                  ) : (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                      <Database className="mx-auto mb-4 opacity-5" size={48} />
                      <p className="text-slate-400 font-bold italic tracking-tight">検索結果がここに表示されます</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 統合情報の検索結果 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Combine size={20} /></div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-black text-slate-700">要約 ＋ タグ マッチ</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">意味 ＋ 「キーワード」を統合評価</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {searchResults.combined.length > 0 ? (
                    searchResults.combined.map((r, i) => (
                      <ResultCard key={i} result={r} score={r.cScore} rank={i + 1} />
                    ))
                  ) : (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                      <Database className="mx-auto mb-4 opacity-5" size={48} />
                      <p className="text-slate-400 font-bold italic tracking-tight">検索結果がここに表示されます</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ライブラリモード */}
        {viewMode === 'library' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-800">元データ・ライブラリ</h2>
                <p className="text-sm text-slate-500 font-medium tracking-tight">全50サイトの事前定義データです。構築ボタンでこれらをベクトル化します。</p>
              </div>
              <button 
                onClick={startIndexing} disabled={!apiKey || status === "indexing"}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-slate-200 hover:bg-black disabled:bg-slate-200 flex items-center gap-2 transition-all active:scale-95"
              >
                <RefreshCw size={14} className={status === "indexing" ? "animate-spin" : ""} /> 一括インデックス構築を実行
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_SITES.map((site, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 group hover:border-indigo-400 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded tracking-widest border border-indigo-100">{site.category}</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{site.site_name}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-3">{site.summary}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {site.tags.map((t, ti) => <span key={ti} className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">#{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URL解析モード */}
        {viewMode === 'analyzer' && (
          <div className="max-w-3xl mx-auto py-12 animate-in slide-in-from-bottom-6 duration-500 space-y-10">
            <div className="text-center space-y-3">
              <div className="bg-indigo-600 w-20 h-20 rounded-[2rem] text-white flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200 transition-transform hover:scale-105 duration-300"><PlusCircle size={36} /></div>
              <h2 className="text-3xl font-black tracking-tighter text-slate-800">URL / 画像 解析追加</h2>
              <p className="text-slate-500 font-medium">任意のURLから情報を抽出し、固定の10カテゴリに自動分類して登録します。</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 space-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">解析ターゲットURL</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">{isImageUrl(urlToAnalyze) ? <ImageIcon size={22} /> : <LinkIcon size={22} />}</div>
                  <input 
                    type="text" placeholder="https://... (ウェブサイトまたは画像のURL)"
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-lg"
                    value={urlToAnalyze} onChange={(e) => setUrlToAnalyze(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">解析エンジン</label>
                  <select className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-indigo-100" value={selectedModels.text} onChange={(e) => setSelectedModels(p => ({ ...p, text: e.target.value }))}>
                    {availableModels.text.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">埋め込みエンジン</label>
                  <select className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-indigo-100" value={selectedModels.embedding} onChange={(e) => setSelectedModels(p => ({ ...p, embedding: e.target.value }))}>
                    {availableModels.embedding.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={analyzeUrlAndMedia} disabled={isAnalyzing || !urlToAnalyze || !apiKey}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-4 active:scale-95"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                {isAnalyzing ? "AIが解析中です..." : "AI解析してインデックスに追加"}
              </button>

              <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 space-y-3">
                <h5 className="text-xs font-black text-indigo-700 uppercase tracking-widest flex items-center gap-2 font-sans"><CheckCircle size={14} /> システム仕様</h5>
                <ul className="text-[11px] text-indigo-600/70 space-y-2 font-bold leading-relaxed tracking-tight">
                  <li>• 指定されたカテゴリリストに基づき、AIが最も適切なものを判断します。</li>
                  <li>• 解析結果から「要約のみ」と「要約＋タグ」の2つのベクトルを自動生成します。</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 管理モード */}
        {viewMode === 'explorer' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">ベクトルデータ管理</h2>
                <p className="text-sm text-slate-500 font-medium">現在DBに保存されている検索対象データの詳細です。</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={exportData} className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all bg-white rounded-xl border border-slate-100 shadow-sm" title="JSON形式でエクスポート"><Download size={22} /></button>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-slate-400 block tracking-widest uppercase mb-1">登録数</span>
                  <span className="text-3xl font-mono font-black text-indigo-600">{sites.length}</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                    <th className="px-8 py-5 border-b border-slate-100">サイト情報</th>
                    <th className="px-8 py-5 border-b border-slate-100">カテゴリ</th>
                    <th className="px-8 py-5 border-b border-slate-100">要約ベクトル</th>
                    <th className="px-8 py-5 border-b border-slate-100">総合ベクトル</th>
                    <th className="px-8 py-5 border-b border-slate-100">操作</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {sites.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group">
                      <td className="px-8 py-5">
                        <div className="font-black text-slate-800 text-sm leading-tight">{s.site_name}</div>
                        <div className="text-[9px] text-slate-400 truncate max-w-[150px] font-mono mt-1 opacity-60">{s.url}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 tracking-tighter uppercase border border-slate-200">{s.category}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="max-w-[150px] truncate bg-indigo-50/30 p-2.5 rounded-xl text-indigo-400 font-mono text-[9px] border border-indigo-100/50">
                          {JSON.stringify(s.summary_embedding)}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="max-w-[150px] truncate bg-emerald-50/30 p-2.5 rounded-xl text-emerald-500 font-mono text-[9px] border border-emerald-100/50">
                          {JSON.stringify(s.combined_embedding)}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => {
                          const tx = db.transaction(STORE_NAME, "readwrite");
                          tx.objectStore(STORE_NAME).delete(s.site_name);
                          tx.oncomplete = () => refreshData(db);
                        }} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sites.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-24 text-center text-slate-300 italic font-bold">
                        インデックスデータがありません。ライブラリから構築してください。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* フッター */}
      <footer className="max-w-7xl mx-auto px-8 py-12 text-center">
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
          <div className="flex items-center gap-2 font-black"><Layers size={14} className="text-indigo-600" /> Vector Analysis Comparison Tool</div>
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2 font-black border-b-2 border-indigo-300 pb-0.5">要約のみ</span>
            <span className="text-slate-300">vs</span>
            <span className="flex items-center gap-2 font-black border-b-2 border-emerald-300 pb-0.5">要約 ＋ タグ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
