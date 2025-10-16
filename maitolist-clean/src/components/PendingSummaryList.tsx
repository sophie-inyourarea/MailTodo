import { PendingSummary } from '@/types';

interface PendingSummaryListProps {
  summaries: PendingSummary[];
  onDelete: (id: string) => void;
}

export default function PendingSummaryList({ summaries, onDelete }: PendingSummaryListProps) {
  if (summaries.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">暂无梗概</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {summaries.map((summary) => (
        <div
          key={summary.id}
          className="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {summary.emailSubject}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2 truncate">
                {summary.emailSender}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {summary.text}
              </p>
            </div>
            
            <button
              onClick={() => onDelete(summary.id)}
              className="flex-shrink-0 ml-3 text-gray-400 hover:text-red-500 transition-colors"
              title="删除"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      
      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <span className="font-medium">{summaries.length}</span> 个梗概已处理
        </p>
      </div>
    </div>
  );
}
