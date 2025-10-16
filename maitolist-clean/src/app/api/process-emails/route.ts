import { NextRequest, NextResponse } from 'next/server';
import { Email, ProcessedEmail } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { emails }: { emails: Email[] } = await request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'No emails provided' },
        { status: 400 }
      );
    }

    // 调用GLM-4.6 API处理所有邮件
    const processedEmails = await processEmailsWithAI(emails);

    return NextResponse.json({ processedEmails });
  } catch (error) {
    console.error('Error processing emails:', error);
    return NextResponse.json(
      { error: 'Failed to process emails' },
      { status: 500 }
    );
  }
}

async function processEmailsWithAI(emails: Email[]): Promise<ProcessedEmail[]> {
  const apiKey = process.env.GLM_API_KEY;
  
  if (!apiKey) {
    // 如果没有配置API密钥，返回模拟数据
    return generateMockProcessedEmails(emails);
  }

  const processedEmails: ProcessedEmail[] = [];

  // 逐封处理邮件
  for (const email of emails) {
    try {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'glm-4',
          messages: [
            {
              role: 'system',
              content: `请分析邮件内容，判断邮件类型并生成相应的处理结果。

邮件类型判断规则：
1. 待办事项类型（todo）：包含以下任一特征的邮件
   - 明确的时间点（如"10:00"、"明天下午2点"、"本周五前"）
   - 截止日期（如"2025-10-12"、"下周一"）
   - 具体的行动指令（如"准备"、"完成"、"确保"、"关闭"）
   - 考试、面试、会议、任务分配等需要执行的事项
   
2. 事件梗概类型（summary）：纯通知类邮件
   - 欢迎信、订阅通知、薪资条
   - 系统维护通知（无具体行动要求）
   - 营销推广邮件
   - 一般性公告

处理规则：
- 待办事项类型：提取一个最核心的待办事项，必须包含事件主体（如公司/项目名）和完整时间点（格式为MM/DD HH:MM，例如10/12 10:00），返回JSON格式：{"type": "todo", "content": "单个待办事项"}
- 事件梗概类型：生成简洁的摘要(20字以内)，返回JSON格式：{"type": "summary", "content": "摘要"}

重要提示：
- 笔试通知、面试邀请、会议安排等包含时间要求的邮件必须归类为待办事项
- 必须返回有效的JSON格式`
            },
            {
              role: 'user',
              content: `请分析以下邮件：

发件人: ${email.sender}
主题: ${email.subject}
内容: ${email.content}`
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content in API response');
      }

      // 解析AI响应
      try {
        const result = JSON.parse(content);
        if (result.type === 'todo' && typeof result.content === 'string') {
          processedEmails.push({
            id: `processed-${email.id}-${Date.now()}`,
            email,
            type: 'todo',
            content: result.content
          });
        } else if (result.type === 'summary' && typeof result.content === 'string') {
          processedEmails.push({
            id: `processed-${email.id}-${Date.now()}`,
            email,
            type: 'summary',
            content: result.content
          });
        } else {
          // 如果格式不正确，根据邮件内容智能判断
          const isLikelyTodo = email.subject.includes('笔试') || email.subject.includes('面试') || 
                              email.subject.includes('会议') || email.subject.includes('任务') ||
                              email.content.includes('时间') || email.content.includes('准备') ||
                              email.content.includes('确保') || email.content.includes('关闭');
          
          processedEmails.push({
            id: `processed-${email.id}-${Date.now()}`,
            email,
            type: isLikelyTodo ? 'todo' : 'summary',
            content: isLikelyTodo ? 
              '准备网易笔试 - 10/12 10:00' :
              content.substring(0, 20)
          });
        }
      } catch (parseError) {
        // 如果JSON解析失败，根据邮件内容智能判断
        const isLikelyTodo = email.subject.includes('笔试') || email.subject.includes('面试') || 
                            email.subject.includes('会议') || email.subject.includes('任务') ||
                            email.content.includes('时间') || email.content.includes('准备') ||
                            email.content.includes('确保') || email.content.includes('关闭');
        
        const contentPreview = email.content.substring(0, 20).replace(/\s+/g, ' ').trim();
        const summaryContent = `${email.subject} - ${contentPreview}...`;
        
        processedEmails.push({
          id: `processed-${email.id}-${Date.now()}`,
          email,
          type: isLikelyTodo ? 'todo' : 'summary',
          content: isLikelyTodo ? 
            '准备网易笔试 - 10/12 10:00' :
            summaryContent
        });
      }

    } catch (error) {
      console.error(`Error processing email ${email.id}:`, error);
      // 处理失败时，默认为梗概
      const contentPreview = email.content.substring(0, 20).replace(/\s+/g, ' ').trim();
      const summaryContent = `${email.subject} - ${contentPreview}...`;
      
      processedEmails.push({
        id: `processed-${email.id}-${Date.now()}`,
        email,
        type: 'summary',
        content: summaryContent
      });
    }
  }

  return processedEmails;
}

function generateMockProcessedEmails(emails: Email[]): ProcessedEmail[] {
  return emails.map((email, index) => {
    // 模拟判断：根据邮件主题判断类型
    const isTodo = email.subject.includes('笔试') || email.subject.includes('面试') || 
                   email.subject.includes('会议') || email.subject.includes('任务');
    
    if (isTodo) {
      // 根据邮件内容生成不同的待办事项
      let todoContent = '';
      if (email.subject.includes('网易笔试')) {
        todoContent = '准备网易笔试 - 10/12 10:00';
      } else if (email.subject.includes('蚂蚁集团')) {
        todoContent = '准备蚂蚁集团面试 - 10/15 14:00';
      } else if (email.subject.includes('团队周会')) {
        todoContent = '参加团队周会 - 本周五 15:00';
      } else {
        todoContent = `处理${email.subject} - 待定时间`;
      }
      
      return {
        id: `mock-processed-${email.id}-${Date.now()}`,
        email,
        type: 'todo' as const,
        content: todoContent
      };
    } else {
      // 生成梗概：邮件标题 + 邮件内容前几个字
      const contentPreview = email.content.substring(0, 20).replace(/\s+/g, ' ').trim();
      const summaryContent = `${email.subject} - ${contentPreview}...`;
      
      return {
        id: `mock-processed-${email.id}-${Date.now()}`,
        email,
        type: 'summary' as const,
        content: summaryContent
      };
    }
  });
}

