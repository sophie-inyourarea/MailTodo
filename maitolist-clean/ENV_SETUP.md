# 环境变量配置说明

## 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# GLM-4.6 API配置
# 获取API密钥：https://open.bigmodel.cn/
GLM_API_KEY=your_glm_api_key_here
```

## 获取GLM API密钥

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册并登录账号
3. 在控制台中创建API密钥
4. 将密钥复制到 `.env.local` 文件中

## 注意事项

- 如果没有配置 `GLM_API_KEY`，系统将使用模拟数据作为备选方案
- 请勿将 `.env.local` 文件提交到版本控制系统
- 在生产环境中，请在Vercel项目设置中配置环境变量

## 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 在项目设置中添加环境变量 `GLM_API_KEY`
4. 部署项目
