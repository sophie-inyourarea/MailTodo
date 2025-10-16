# 智能邮件待办生成器 (Mail-to-Todo Generator)

一个全栈Demo应用，展示如何利用AI技术自动解析邮件内容，并通过用户确认的交互方式，将邮件智能地转换为可管理的待办事项列表。

## 功能特性

- 🤖 AI驱动的邮件内容分析
- 📧 模拟邮件数据（5封精心设计的示例邮件）
- ✅ 用户确认和编辑待办事项
- 💾 本地存储持久化
- 🎨 现代化UI设计
- ⚡ 无服务器架构

## 技术栈

### 前端
- Next.js 15 (React 19)
- TypeScript
- Tailwind CSS
- React Hooks

### 后端
- Vercel Serverless Functions
- GLM-4.6 AI API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制环境变量模板文件：

```bash
cp .env.example .env.local
```

然后编辑 `.env.local` 文件，填入您的API密钥：

```bash
# GLM-4.6 API配置
# 获取API密钥：https://open.bigmodel.cn/
GLM_API_KEY=your_actual_api_key_here
```

**重要提示**：
- 请勿将 `.env.local` 文件提交到版本控制系统
- 如果没有配置API密钥，系统将使用模拟数据作为备选方案
- 在生产环境中，请在部署平台（如Vercel）中配置环境变量

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建和部署

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

## 使用说明

1. **检查邮件**：点击"检查新邮件"按钮，系统会随机选择1-2封邮件
2. **AI处理**：系统使用AI技术分析邮件内容，生成待办事项
3. **确认编辑**：在"待确认的待办事项"区域选择要添加的待办项
4. **添加到主列表**：点击"确认添加选中的待办事项"按钮
5. **管理待办**：在主列表中标记完成状态或删除不需要的项

## 项目结构

```
src/
├── app/
│   ├── api/process-emails/    # API路由
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── components/               # React组件
│   ├── EmailProcessor.tsx    # 邮件处理组件
│   ├── PendingTodoList.tsx   # 待确认待办列表
│   └── TodoList.tsx          # 主待办列表
├── data/
│   └── mockEmails.ts         # 模拟邮件数据
└── types/
    └── index.ts              # TypeScript类型定义
```

## 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量 `GLM_API_KEY`
4. 部署

## 开发说明

### 添加新的模拟邮件

编辑 `src/data/mockEmails.ts` 文件，添加新的邮件对象。

### 自定义AI提示词

修改 `src/app/api/process-emails/route.ts` 中的system prompt。

### 样式定制

使用Tailwind CSS类名进行样式调整。

## 许可证

MIT License
