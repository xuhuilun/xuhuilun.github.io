# Chinchilla 论文技术笔记设计

## 目标

新增一篇面向 AI / CS 技术学习者的中文论文精读，主论文为 Hoffmann 等人的《Training Compute-Optimal Large Language Models》（2022）。文章假设读者已经理解 Transformer、自回归语言建模、交叉熵与基础微积分，重点回答固定预训练计算预算下应如何分配模型参数量和训练 token，以及 Chinchilla 为什么修正 Kaplan 2020 的计算最优结论。

## 核心叙事

文章采用“旧结论为何失准 -> 新结论如何测得 -> 公式如何推导 -> 大规模实验如何验证 -> 工程上如何使用”的主线：

1. 定义参数量 $N$、训练 token 数 $D$、计算量 $C$ 与验证损失 $L$，解释 $C\approx6ND$ 的适用口径。
2. 对比 Kaplan 的 $N\propto C^{0.73}$、$D\propto C^{0.27}$ 与 Chinchilla 的近似等比例扩展结论。
3. 分别拆解训练曲线包络、IsoFLOP 曲线和参数化损失函数三种估计方法。
4. 从 $L(N,D)=E+A/N^\alpha+B/D^\beta$ 与计算约束推导最优参数量和数据量的指数。
5. 用 Gopher 280B/300B token 与 Chinchilla 70B/1.4T token 的同计算量对照解释实证结果。
6. 将约 20 token/参数定位为论文实验域内的经验基线，并说明数据质量、架构、重复数据、长上下文和推理成本会移动最优点。

## 内容结构

### 摘要与问题定义

- 给出论文的一句话结论与工程问题。
- 统一 $N$、$D$、$C$、$L$ 的符号和统计口径。
- 区分训练计算最优、完全收敛和全生命周期成本最优。

### 三种估计方法

- 方法一：复用不同模型的训练曲线，在固定计算预算处比较损失并拟合最优规模。
- 方法二：为多个固定 FLOP 预算构造 IsoFLOP 实验，直接寻找每条曲线的最低点。
- 方法三：拟合参数量和数据量的联合损失函数，并在计算约束下解析求解。
- 对照三种方法的指数、实验范围、假设与误差来源。

### 数学推导

- 展示联合损失函数中不可约损失、容量受限项和数据受限项的含义。
- 用 $C\approx6ND$ 消去一个变量，对 $N$ 求导得到最优前沿。
- 解释 $\alpha$ 与 $\beta$ 决定预算如何在模型和数据之间分配。
- 通过十倍预算和指定 FLOP 预算的算例检查数量级。

### 实验验证与工程边界

- 对照 Gopher 与 Chinchilla 的规模、token、训练计算和下游结果。
- 解释推理和微调成本为何随参数量下降。
- 说明学习率日程、数据分布、tokenizer 和 FLOP 估算对结论的影响。
- 给出实际项目中的校准流程：以论文结论为先验，再做本域 IsoFLOP 实验。

## 文件范围

- 新增 `content/papers/2026-training-compute-optimal-large-language-models.mdx`。
- 新增 `docs/chinchilla-research.md` 作为一手来源研究底稿。
- 新增本文设计和实施计划文档。
- 复用现有 `/img/scaling-law-compute-allocation.svg`，不新增视觉资源。
- 不修改 Contentlayer schema、React 组件、样式或项目依赖。

## 事实与引用规范

- 公式、拟合参数、实验范围和评测数字均以论文原文为主。
- DeepMind 官方文章只用于交叉核验论文背景与公开表述。
- 正文在关键数字附近标明论文节、表或附录位置，文末提供一手来源链接。
- 明确区分论文实测、公式推导、便于记忆的近似与本文工程解释。

## 验收标准

- MDX frontmatter 完整，Contentlayer 能生成 Paper 文档。
- 三种估计方法、联合损失函数和最优指数推导均准确且可复算。
- Gopher/Chinchilla 对照、实验范围和下游评测数字可追溯。
- 不把 20 token/参数、$C\approx6ND$ 或拟合指数表述为跨架构普适常数。
- 文章与现有 Scaling Law 笔记互补，并提供双向相关内容入口。
- `npm run typecheck` 与 `npm run build` 通过。
