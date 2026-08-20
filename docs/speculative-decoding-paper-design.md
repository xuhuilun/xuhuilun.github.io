# Speculative Decoding 论文技术笔记设计

## 目标

新增一篇面向具备 Transformer、自回归解码和概率分布基础的读者的中文技术笔记，主论文为 Leviathan、Kalman 与 Matias 的《Fast Inference from Transformers via Speculative Decoding》。文章帮助读者理解 Speculative Decoding 如何在不改变目标模型输出分布的前提下，用小型草稿模型减少大模型串行调用次数。

## 核心叙事

文章采用“瓶颈是什么 -> 算法如何工作 -> 为什么分布完全一致 -> 什么时候真正加速”的主线：

1. 从自回归解码的串行依赖和内存带宽瓶颈说明问题。
2. 区分草稿模型 $q$ 与目标模型 $p$，解释先猜测、再并行验证的两阶段流程。
3. 推导接受概率 $\min(1,p/q)$ 与拒绝后的修正分布 $(p-q)_+$。
4. 用单步概率例子验证接受分支和拒绝分支合并后恰好得到 $p$。
5. 扩展到一次提出 $\gamma$ 个 token 的完整算法，并说明缓存提交与回滚边界。
6. 分析期望接受长度、理论加速条件、实验结果和工程限制。
7. 对照 Speculative Sampling 同期工作，澄清术语和适用范围。

## 内容结构

### 问题定义

- 定义上下文 $x_{<t}$、目标分布 $p$、草稿分布 $q$ 和草稿长度 $\gamma$。
- 说明标准自回归解码每轮只能确认一个 token，而 Transformer 可以并行计算一段已知候选序列的位置 logits。
- 明确 Speculative Decoding 优化的是目标模型调用的串行深度，不减少目标模型对候选 token 的验证计算。

### 算法与正确性

- 分步骤说明 draft、score、accept/reject、resample 和 extra token。
- 给出接受概率及残差分布的归一化公式。
- 用全概率公式证明最终采样分布严格等于目标分布。
- 解释 greedy decoding 是论文覆盖的另一个分支，不与随机采样的修正分布混写。

### 性能模型

- 使用论文中的接受率 $\alpha$、成本系数 $c$ 和 lookahead $\gamma$。
- 展示每轮期望产出 token 数与加速因子的表达式，并说明独立同分布接受假设的近似性质。
- 将“草稿模型足够便宜且与目标模型足够一致”写成收益成立的必要条件，而非无条件加速。

### 实验、工程与边界

- 复核论文报告的任务、模型组合、速度提升及同分布验证。
- 说明 KV cache 的暂存、提交和拒绝后裁剪。
- 分析低接受率、小 batch、高吞吐服务、通信与 kernel 开销带来的收益差异。
- 区分精确算法与改变接受规则、忽略残差修正的近似变体。

## 文件范围

- 新增 `content/papers/2026-speculative-decoding.mdx`。
- 新增 `docs/speculative-decoding-research.md` 作为一手来源研究底稿。
- 新增本文设计和实施计划文档。
- 不修改 Contentlayer schema、React 组件、样式或项目依赖。

## 事实与引用规范

- 核心算法、公式、定理和实验数字以主论文为准。
- 同期关系仅引用 Chen 等人的《Accelerating Large Language Model Decoding with Speculative Sampling》原文。
- 工程实现说明若超出论文正文，必须明确标注为实现层解释，并引用官方实现或将其限制为算法直接推论。
- 文末提供论文、会议版本与官方代码链接；正文关键结论标明章节、定理或表格。

## 验收标准

- MDX frontmatter 完整，Contentlayer 能生成 Paper 文档。
- 接受概率、残差分布、正确性证明和性能公式均可复算。
- 不把相同输出分布误写成逐次采样必然生成相同 token。
- 不把一次目标模型 forward 误写成固定接受全部 $\gamma$ 个 token。
- `npm run typecheck` 与 `npm run build` 通过。

