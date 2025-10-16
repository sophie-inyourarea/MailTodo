interface EmailProcessorProps {
  onProcessEmails: () => void;
  isProcessing: boolean;
}

export default function EmailProcessor({ onProcessEmails, isProcessing }: EmailProcessorProps) {
  return (
    <button
      onClick={onProcessEmails}
      disabled={isProcessing}
      className={`
        inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white shadow-lg
        ${isProcessing 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105'
        }
        transition-all duration-200
      `}
    >
      {isProcessing ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          AI正在处理中...
        </>
      ) : (
        <>
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          检查新邮件
        </>
      )}
    </button>
  );
}


