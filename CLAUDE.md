# CLAUDE.md

## 自动 Git Push

每次对话中，如果产生了文件更改（新增、修改、删除），在对话结束前必须自动执行以下流程：

1. `git add` 所有变更文件
2. `git commit` 提交（commit message 需简洁描述变更内容）
3. `git push` 推送到远端

不需要用户手动说 "git push"，此操作应在对话自然结束前由 Claude 主动完成。

## 项目信息

- 项目名称：LLM论文精读 (xuhuilun.github.io)
- 技术栈：Next.js + MDX + Tailwind CSS
- 部署平台：GitHub Pages
