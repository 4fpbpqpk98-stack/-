import React from 'react';
import { GeneratedArticle } from '../types';
import { Icons } from './Icons';

interface ArticleModalProps {
  article: GeneratedArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  // Simple formatter to make Markdown-like text look better
  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-gray-800 border-l-4 border-blue-500 pl-3">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-4 mb-6 text-gray-900">{line.replace('# ', '')}</h1>;
      
      // Lists
      if (line.trim().startsWith('- ')) return <li key={index} className="ml-5 list-disc text-gray-700 my-1">{line.replace('- ', '')}</li>;
      
      // Quotes / Responses
      if (line.startsWith('>')) return <blockquote key={index} className="bg-gray-50 border-l-4 border-gray-300 p-3 my-4 italic text-gray-600">{line.replace('>', '')}</blockquote>;

      // Empty lines
      if (line.trim() === '') return <div key={index} className="h-4"></div>;

      // Regular paragraph
      return <p key={index} className="mb-2 text-gray-700 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col animate-fade-in-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded">
              {article.category}
            </span>
            <span className="text-gray-400 text-sm">{article.createdAt}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <Icons.X size={24} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto p-6 md:p-10">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          <div className="mb-8 rounded-xl overflow-hidden shadow-md">
            <img src={article.imageUrl} alt={article.title} className="w-full h-64 md:h-96 object-cover" />
          </div>

          <div className="prose prose-lg max-w-none text-gray-800">
            {formatContent(article.content)}
          </div>

          {/* Sources Section */}
          {article.sources && article.sources.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                ソース / 関連リンク
              </h4>
              <ul className="space-y-2">
                {article.sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-800 transition-colors text-sm"
                    >
                      <Icons.ExternalLink size={14} />
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-10 flex gap-3 justify-center">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <Icons.Share2 size={18} />
              この記事をシェア
            </button>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-bold transition-all">
               <Icons.MessageCircle size={18} />
               コメントを見る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
