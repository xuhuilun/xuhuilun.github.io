# Scaling Law 论文技术笔记实施计划

## 目标

按 `docs/scaling-law-paper-design.md` 完成 Kaplan 2020 Scaling Law 技术笔记，并用 Chinchilla 2022 校正计算最优训练配比。

## 步骤

### 1. 创建技术图

- 新增参数/数据/计算缩放曲线图。
- 新增 Kaplan 与 Chinchilla 计算预算分配对比图。
- 校验 SVG 语法、画布边界、中文标签和移动端缩放。

### 2. 编写论文 MDX

- 添加 Paper frontmatter、摘要、背景和变量定义。
- 按研究底稿写入 Kaplan 基础幂律、联合损失、学习曲线和 compute-optimal 推导。
- 写入 Chinchilla 的 IsoFLOP、损失分解、实证对照与学习率日程解释。
- 增加算力预算示例、工程决策清单、限制和参考文献。
- 插入两张技术图并补齐替代文本和图注。

### 3. 内容校验

- 对照研究底稿复核公式、指数、单位和关键实验数字。
- 用独立计算检查参数翻倍收益、$C\approx6ND$ 和算力预算示例。
- 检查 Kaplan 原始结论与 Chinchilla 修正是否明确分离。

### 4. 项目验证

- 运行 Contentlayer 构建并检查新 Paper 路由。
- 检查 KaTeX HTML、SVG 引用和静态导出结果。
- 运行 `npm run typecheck` 与 `npm run build`。
- 恢复构建产生的已跟踪缓存，不提交临时文件。

### 5. Git 交付

- 提交并推送 `feature/scaling-law-paper-note`。
- 合并到 `main` 并推送远端。
- 删除已合并的本地和远端功能分支。

## 完成标准

- 新文章在 `/papers/2026-scaling-laws-for-neural-language-models` 正常生成。
- 公式、图表、数值和引用通过校验。
- 类型检查和生产构建通过。
- `main` 与 `origin/main` 同步且工作区干净。
