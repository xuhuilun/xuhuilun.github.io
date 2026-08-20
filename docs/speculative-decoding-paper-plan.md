# Speculative Decoding 论文技术笔记实施计划

## 目标

按 `docs/speculative-decoding-paper-design.md` 完成 Speculative Decoding 中文技术笔记，并保证算法、数学证明、实验数据和工程边界均可由一手来源追溯。

## 步骤

### 1. 建立研究底稿

- 阅读主论文的算法、定理、性能分析和实验章节。
- 阅读同期 Speculative Sampling 论文，核对术语与差异。
- 记录公式、变量、实验配置、结果和原文位置。

### 2. 编写论文 MDX

- 添加 Paper frontmatter、摘要、问题定义和前置概念。
- 写入完整算法流程、伪代码和单步概率示例。
- 推导同分布正确性与期望接受长度。
- 补充实验解读、工程实现、适用条件、局限和参考文献。

### 3. 内容校验

- 对照研究底稿复核公式、符号、定理条件和实验数字。
- 独立检查概率示例总和、残差分布归一化与速度模型。
- 检查“分布一致”和“随机结果逐次一致”的表述边界。

### 4. 项目验证

- 运行 Contentlayer 和生产构建，检查新 Paper 路由。
- 检查 KaTeX、表格、代码块及外部链接格式。
- 运行 `npm run typecheck` 和 `npm run build`。

### 5. Git 交付

- 提交并推送 `feature/speculative-decoding-paper-note`。
- 合并到 `main` 并推送远端。
- 在不影响其他 worktree 的前提下清理已合并功能分支。

## 完成标准

- 新文章在 `/papers/2026-speculative-decoding` 正常生成。
- 关键算法与实验事实均能追溯到一手来源。
- 类型检查和生产构建通过。
- `main` 与 `origin/main` 同步，原工作区未提交文件保持不变。
