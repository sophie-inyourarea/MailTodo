'use client';

import { useState, useEffect } from 'react';
import { TodoItem, PendingTodo, PendingSummary, ProcessedEmail, Email } from '@/types';
import { mockEmails } from '@/data/mockEmails';
import EmailProcessor from '@/components/EmailProcessor';
import TodoList from '@/components/TodoList';
import PendingTodoList from '@/components/PendingTodoList';
import PendingSummaryList from '@/components/PendingSummaryList';

export default function Home() {
  const [mainTodos, setMainTodos] = useState<TodoItem[]>([]);
  const [pendingTodos, setPendingTodos] = useState<PendingTodo[]>([]);
  const [pendingSummaries, setPendingSummaries] = useState<PendingSummary[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 从localStorage加载主待办事项
  useEffect(() => {
    const savedTodos = localStorage.getItem('mainTodos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // 过滤掉可能的默认/固定待办事项
        const filteredTodos = parsedTodos.filter((todo: TodoItem) => {
          // 可以根据需要添加更多过滤条件
          return !todo.text.includes('默认') && 
                 !todo.text.includes('示例') && 
                 !todo.text.includes('测试');
        });
        setMainTodos(filteredTodos);
      } catch (error) {
        console.error('Failed to load todos from localStorage:', error);
        setMainTodos([]);
      }
    }
  }, []);

  // 保存主待办事项到localStorage
  useEffect(() => {
    if (mainTodos.length > 0) {
      localStorage.setItem('mainTodos', JSON.stringify(mainTodos));
    }
  }, [mainTodos]);

  // 处理邮件并生成待办事项和梗概
  const handleProcessEmails = async () => {
    setIsProcessing(true);
    
    try {
      // 随机选择1-2封邮件进行处理
      const shuffled = [...mockEmails].sort(() => 0.5 - Math.random());
      const selectedCount = Math.floor(Math.random() * 2) + 1; // 1-2封
      const selectedEmails = shuffled.slice(0, selectedCount);

      // 调用API处理邮件
      const response = await fetch('/api/process-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: selectedEmails }),
      });

      if (!response.ok) {
        throw new Error('Failed to process emails');
      }

      const { processedEmails } = await response.json();
      
      // 分离待办事项和梗概
      const newPendingTodos: PendingTodo[] = [];
      const newPendingSummaries: PendingSummary[] = [];

      processedEmails.forEach((processed: ProcessedEmail) => {
        if (processed.type === 'todo') {
          // 一封邮件只生成一个待办事项
          newPendingTodos.push({
            id: `pending-${processed.email.id}-${Date.now()}`,
            text: processed.content,
            selected: true,
          });
        } else if (processed.type === 'summary') {
          newPendingSummaries.push({
            id: `summary-${processed.email.id}-${Date.now()}`,
            text: processed.content,
            emailSubject: processed.email.subject,
            emailSender: processed.email.sender,
          });
        }
      });

      setPendingTodos(newPendingTodos);
      setPendingSummaries(newPendingSummaries);
    } catch (error) {
      console.error('Error processing emails:', error);
      alert('处理邮件时发生错误，请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 确认添加选中的待办事项
  const handleConfirmTodos = () => {
    const selectedTodos = pendingTodos.filter(todo => todo.selected);
    
    if (selectedTodos.length === 0) {
      alert('请至少选择一个待办事项');
      return;
    }

    const newMainTodos: TodoItem[] = selectedTodos.map(todo => ({
      id: `todo-${Date.now()}-${Math.random()}`,
      text: todo.text,
      completed: false,
      createdAt: new Date().toISOString(),
    }));

    setMainTodos(prev => [...prev, ...newMainTodos]);
    setPendingTodos([]);
  };

  // 更新待确认待办事项的选择状态
  const handleTogglePendingTodo = (id: string) => {
    setPendingTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, selected: !todo.selected } : todo
      )
    );
  };

  // 删除待确认的待办事项
  const handleDeletePendingTodo = (id: string) => {
    setPendingTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // 更新主待办事项的完成状态
  const handleToggleMainTodo = (id: string) => {
    setMainTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 删除主待办事项
  const handleDeleteMainTodo = (id: string) => {
    setMainTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // 删除梗概
  const handleDeleteSummary = (id: string) => {
    setPendingSummaries(prev => prev.filter(summary => summary.id !== id));
  };

  // 清除所有待办事项
  const handleClearAllTodos = () => {
    if (confirm('确定要清除所有待办事项吗？此操作不可撤销。')) {
      setMainTodos([]);
      localStorage.removeItem('mainTodos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            智能邮件待办生成器
          </h1>
          <p className="text-gray-600">
            利用AI技术自动解析邮件内容，智能转换为可管理的待办事项
          </p>
        </div>

        {/* 邮件处理按钮 */}
        <div className="text-center mb-8">
          <EmailProcessor
            onProcessEmails={handleProcessEmails}
            isProcessing={isProcessing}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 待确认的待办事项 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              待添加事项
            </h2>
            {pendingTodos.length > 0 ? (
              <div>
                <PendingTodoList
                  todos={pendingTodos}
                  onToggle={handleTogglePendingTodo}
                  onDelete={handleDeletePendingTodo}
                />
                <button
                  onClick={handleConfirmTodos}
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  确认添加选中的待办事项
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                暂无待办事项
              </p>
            )}
          </div>

          {/* 事件梗概 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              事件梗概
            </h2>
            {pendingSummaries.length > 0 ? (
              <PendingSummaryList
                summaries={pendingSummaries}
                onDelete={handleDeleteSummary}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">
                暂无梗概
              </p>
            )}
          </div>

          {/* 主待办事项列表 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                我的待办事项
              </h2>
              {mainTodos.length > 0 && (
                <button
                  onClick={handleClearAllTodos}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  title="清除所有待办事项"
                >
                  清除全部
                </button>
              )}
            </div>
            {mainTodos.length > 0 ? (
              <TodoList
                todos={mainTodos}
                onToggle={handleToggleMainTodo}
                onDelete={handleDeleteMainTodo}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">
                暂无待办事项
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
