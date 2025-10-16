import { Email } from '@/types';

export const mockEmails: Email[] = [
  {
    id: 'email-1',
    subject: '网易笔试通知 - 2025年10月12日',
    sender: 'hr@163.com',
    content: '您好！恭喜您通过网易的简历筛选，现邀请您参加笔试。笔试时间：2025年10月12日上午10:00-12:00，地点：线上进行。请提前15分钟登录系统，确保网络环境稳定。如有疑问请联系我们。',
    timestamp: '2025-10-10T09:00:00Z'
  },
  {
    id: 'email-2',
    subject: '蚂蚁集团产品经理岗位面试邀请',
    sender: 'recruitment@antgroup.com',
    content: '尊敬的用户，感谢您对蚂蚁集团产品经理岗位的关注。经过初步筛选，我们邀请您参加面试。面试时间：2025年10月15日下午2:00，地点：杭州市西湖区。请携带身份证和相关材料。',
    timestamp: '2025-10-11T14:30:00Z'
  },
  {
    id: 'email-3',
    subject: '团队周会安排 - 本周五',
    sender: 'manager@company.com',
    content: '各位同事，本周五下午3:00将举行团队周会，地点：会议室A。请各位准备本周工作总结和下周计划，确保准时参加。会议将讨论项目进展和重要决策。',
    timestamp: '2025-10-11T16:45:00Z'
  },
  {
    id: 'email-4',
    subject: '系统维护通知',
    sender: 'system@company.com',
    content: '尊敬的用户，为了提供更好的服务，我们将在2025年10月13日凌晨2:00-4:00进行系统维护。维护期间系统将暂时无法访问，给您带来的不便敬请谅解。',
    timestamp: '2025-10-11T18:00:00Z'
  },
  {
    id: 'email-5',
    subject: '欢迎加入我们的团队！',
    sender: 'welcome@company.com',
    content: '亲爱的同事，欢迎您加入我们的大家庭！我们为您准备了入职指南和培训计划。请查看附件了解详细信息。如有任何问题，请随时联系HR部门。',
    timestamp: '2025-10-12T10:00:00Z'
  }
];