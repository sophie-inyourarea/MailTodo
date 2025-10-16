export interface Email {
  id: string;
  subject: string;
  sender: string;
  content: string;
  timestamp: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface PendingTodo {
  id: string;
  text: string;
  selected: boolean;
}

export interface PendingSummary {
  id: string;
  text: string;
  emailSubject: string;
  emailSender: string;
}

export interface ProcessedEmail {
  id: string;
  email: Email;
  type: 'todo' | 'summary';
  content: string;
}


