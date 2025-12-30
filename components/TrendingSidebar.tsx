import React from 'react';
import { Icons } from './Icons';

interface TrendingSidebarProps {
  onTrendClick: (topic: string) => void;
}

const TRENDS = [
  "インポスター症候群とは",
  "ポモドーロ・テクニックの効果",
  "なぜ人は嘘をつくのか",
  "HSP（繊細さん）の特徴",
  "アドラー心理学 嫌われる勇気",
  "睡眠とメンタルヘルスの関係",
  "バーンアウト症候群の予兆",
  "マインドフルネス瞑想のやり方"
];

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ onTrendClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
        <Icons.TrendingUp className="text-teal-600" size={20} />
        <h2 className="font-bold text-gray-800">注目のトピック</h2>
      </div>
      
      <ul className="space-y-3">
        {TRENDS.map((trend, index) => (
          <li key={index}>
            <button 
              onClick={() => onTrendClick(trend)}
              className="flex items-center gap-3 w-full text-left group"
            >
              <span className={`
                flex items-center justify-center w-6 h-6 rounded text-xs font-bold
                ${index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}
              `}>
                {index + 1}
              </span>
              <span className="text-sm text-gray-700 group-hover:text-teal-600 group-hover:underline transition-colors line-clamp-1">
                {trend}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-4 text-center">
          <Icons.Clock className="mx-auto text-teal-500 mb-2" size={24} />
          <h3 className="font-bold text-gray-800 text-sm mb-1">定期更新中</h3>
          <p className="text-xs text-gray-500 mb-3">
            毎日 6:00 と 18:00 に<br/>AIが最新の心理学記事をお届けします。
          </p>
        </div>
      </div>
    </div>
  );
};