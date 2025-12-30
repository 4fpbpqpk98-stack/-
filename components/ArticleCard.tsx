import React from 'react';
import { GeneratedArticle } from '../types';
import { Icons } from './Icons';

interface ArticleCardProps {
  article: GeneratedArticle;
  onClick: (article: GeneratedArticle) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <div 
      onClick={() => onClick(article)}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
          {article.category}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <Icons.Clock size={12} />
            <span>{article.createdAt}</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1">
              <Icons.TrendingUp size={12} className="text-red-500" />
              <span className="text-red-500 font-medium">{article.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icons.MessageCircle size={12} />
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
