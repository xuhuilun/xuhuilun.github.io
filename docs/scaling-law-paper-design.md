# Scaling Law 论文技术笔记设计

## 目标

新增一篇面向 AI / CS 技术学习者的论文精读，主论文为 Kaplan 等人的《Scaling Laws for Neural Language Models》（2020），并用 Chinchilla（2022）说明计算最优训练配比的后续修正。

文章不从 Transformer 基础讲起。目标读者已理解自回归语言模型、交叉熵、对数和幂函数，希望进一步掌握 Scaling Law 的公式、实验方法、工程含义与适用边界。

## 核心叙事

文章采用“规律是什么 -> 如何测得 -> 如何用于决策 -> 为什么后来被修正”的主线：

1. 用对数坐标解释幂律和可预测的递减收益。
2. 拆解 Kaplan 的参数量、数据量和计算量三条基础缩放律。
3. 用联合损失面说明模型容量和数据瓶颈不能独立处理。
4. 推导固定计算预算下的 Kaplan compute-optimal 前沿。
5. 用 Chinchilla 的 IsoFLOP 方法和损失分解修正训练配比。
6. 通过算力预算示例把公式转化为参数量/token 决策。
7. 说明数据质量、长上下文、推理成本、外推区间等限制。

## 内容结构

### 摘要与问题定义

- Scaling Law 是经验预测工具，不是能力涌现的完整理论。
- 定义 $N$、$D$、$C$、$L$ 和非 embedding 参数口径。
- 解释训练计算近似 $C \approx 6ND$ 的来源与限制。

### Kaplan 三条基础幂律

- 展示 $L(N)$、$L(D)$、$L(C_{\min})$ 及原论文拟合指数。
- 用“参数翻倍只带来约 5% 容量受限损失下降”解释指数很小意味着什么。
- 区分 $C_{\min}$ 与固定 batch 实验实际计算量，避免错误外推。

### 联合损失与样本效率

- 展示 $L(N,D)$ 联合经验式及两个极限。
- 解释固定过拟合程度下 $D \propto N^{0.74}$ 的成立条件。
- 说明更大模型达到相同损失所需样本更少，但不等于可以忽略数据规模。

### Kaplan compute-optimal 前沿

- 展示 $N_{\mathrm{opt}} \propto C^{0.73}$、$D_{\mathrm{opt}} \propto C^{0.27}$。
- 解释新增预算主要投向更大模型、较早停止训练的原始结论。
- 说明关键 batch、串行优化步数与计算效率之间的关系。

### Chinchilla 修正

- 介绍训练曲线最小值、IsoFLOP 和参数化损失三种估计。
- 展示 $\hat L(N,D)=E+A/N^\alpha+B/D^\beta$ 及约 $(0.5,0.5)$ 的最优指数。
- 用 Gopher 280B/300B token 与 Chinchilla 70B/1.4T token 对照验证结论。
- 解释实验覆盖范围、IsoFLOP 设计和学习率日程导致两篇论文差异的原因。
- 将约 20 token/参数明确写成论文实验域内的经验起点，而非普适常数。

### 工程算例与限制

- 给出一个指定训练 FLOP 预算的 Chinchilla 风格估算。
- 同时报告单位换算、参数/token 配比和近似训练周期，不伪造硬件利用率。
- 给出决策清单：数据质量、数据可得性、训练目标、上下文长度、推理次数、显存和延迟。
- 收束到“训练 compute-optimal 不等于产品全生命周期成本最优”。

## 视觉设计

新增两张 SVG 技术图，使用站点现有 Google 风格四色，但以白底、细网格和高信息密度为主：

1. `public/img/scaling-law-power-curves.svg`：对数坐标中的参数、数据与计算缩放曲线，突出平滑下降与递减收益。
2. `public/img/scaling-law-compute-allocation.svg`：同一计算预算下 Kaplan 与 Chinchilla 的参数/token 分配对比。

图中只使用线、坐标、标签和必要注释，不使用装饰性插画或渐变。图片带明确中文替代文本和图注，移动端按容器宽度缩放。

## 文件范围

- 新增 `content/papers/2026-scaling-laws-for-neural-language-models.mdx`。
- 新增两张 `public/img/scaling-law-*.svg` 技术图。
- 保留 `docs/scaling-law-research.md` 作为一手来源研究底稿。
- 新增本文设计和实施计划文档。
- 不修改 Contentlayer schema、组件或项目依赖。

## 事实与引用规范

- 关键指数、常数、实验范围和大模型对照均追溯到 Kaplan 2020 或 Hoffmann 2022。
- 每项经验结论注明实验口径，不把拟合常数写成理论常数。
- 引用使用文末参考文献链接；正文在关键数字附近标明论文和章节语境。
- 不使用未经一手来源支持的“定律已经证明”“规模必然产生智能”等表述。

## 验收标准

- MDX frontmatter 完整，Contentlayer 能生成 Paper 文档。
- 所有块级/行内公式均通过 KaTeX 渲染，无溢出或逐字分行。
- 两张 SVG 可解析，桌面和移动端均不裁切标签。
- 文章逻辑能够区分 Kaplan 原始结论与 Chinchilla 后续修正。
- 工程算例的单位、FLOP 预算和参数/token 数值可复算。
- `npm run typecheck` 与 `npm run build` 通过。
- 功能分支提交推送后合并到 `main`，并推送远端。
