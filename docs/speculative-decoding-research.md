# Speculative Decoding 技术研究底稿

> 研究对象：Yaniv Leviathan、Matan Kalman、Yossi Matias，*Fast Inference from Transformers via Speculative Decoding*，ICML 2023。本文首次提交 arXiv 的时间是 2022-11-30，ICML 版本收录于 PMLR 202:19274–19286。下文以 ICML 终稿为准，Chen et al. 的同期独立工作只用于交叉核验和补充工程证据。

## 1. 一句话结论

Speculative Decoding（推测解码）不是让小模型替大模型做决定，而是让小模型先提出一段候选 token，再让大模型一次并行验证整段候选；通过“按概率接受 + 被拒绝时从差分分布补偿采样”，每一步的条件分布仍严格等于大模型的目标分布。因此，它用更多并行计算换更少的串行大模型调用，在内存带宽受限、低 batch、草稿模型便宜且与目标模型足够一致时，能够降低端到端解码延迟。

主论文在单张 TPU-v4、batch size 1 上，以 T5-XXL 11B 为目标模型，报告 WMT EnDe 上最高 3.4 倍（贪心）/2.6 倍（温度 1 采样），CNN/DM 上最高 3.1 倍/2.3 倍的实测加速。这个结果不能脱离硬件、batch size、草稿模型成本和接受率直接外推。

**主来源定位**：[PMLR 论文主页](https://proceedings.mlr.press/v202/leviathan23a.html)、[ICML 终稿 PDF](https://proceedings.mlr.press/v202/leviathan23a/leviathan23a.pdf)、[arXiv v2](https://arxiv.org/abs/2211.17192v2)、[arXiv HTML](https://arxiv.org/html/2211.17192)。摘要与第 1 节给出问题、贡献和 2–3 倍总体结论；第 4.1 节、表 2 给出实验设置与逐项结果。

## 2. 问题的本质：自回归解码的串行依赖

自回归模型把序列概率分解为

$$
P(x_{1:T}\mid x_{<1})=\prod_{t=1}^{T}p(x_t\mid x_{<t}).
$$

常规解码每得到一个 token，才能构造下一个 token 的上下文；生成 $K$ 个 token 需要 $K$ 次串行目标模型调用。大模型在小 batch 推理时往往不是算力饱和，而是权重读取、KV cache 访问和跨设备通信占主导。于是，一次只处理一个位置并没有充分利用硬件，而一次并行评分几个位置的延迟可能接近一次单 token 调用。

推测解码利用了两点：

1. 很多位置是“容易预测”的，小模型与大模型会给出相近分布；
2. Transformer 可用 causal mask 在一次前向中并行得到一段已知候选前缀上各位置的 logits。

所以瓶颈转换为：能否让小模型先猜多个位置，再让大模型一次验证，同时不改变大模型原本的采样分布？论文的 speculative sampling 正是这个概率校正器。

**原文定位**：主论文第 1 节，尤其是关于 memory bandwidth、communication 和 increased concurrency 的论述；第 2.1 节给出三阶段概览；第 3.4 节分析并行算术量与内存访问。[第 2.1 节](https://arxiv.org/html/2211.17192#S2.SS1)，[第 3.4 节](https://arxiv.org/html/2211.17192#S3.SS4)。

## 3. 记号与前置条件

沿用 Leviathan et al. 的记号：

- $M_p$：昂贵的目标模型（target model）；$p_t(x)=p(x\mid x_{<t})$ 是真正希望采样的条件分布。
- $M_q$：便宜的近似/草稿模型（approximation model）；$q_t(x)=q(x\mid x_{<t})$。
- $\gamma\in\mathbb Z^+$：每轮由 $M_q$ 自回归提出的草稿 token 数。
- $\operatorname{norm}(f)(x)=f(x)/\sum_y f(y)$。
- $[z]_+=\max(0,z)$。

重要前置处理：温度、top-k、nucleus、argmax 等解码规则都先作用在 logits 上，并标准化成概率分布，之后才进入接受/拒绝算法。换言之，证明保证的是“经过所选解码规则调整后的目标分布 $p$”不变，而不是未经调整的原始 softmax 分布。argmax 可视为只在最大概率 token 上有质量 1 的退化分布。

理论上 $q$ 可以是任意分布，不要求与 $p$ 同架构，也不要求近似得好；但两者必须在同一个离散 token 空间上给出可比较的概率。$q$ 越差只会让接受率和速度下降，不会破坏正确性。

**原文定位**：主论文第 2.2 节（standardized sampling）、第 3.6 节（任意 approximation model 都保持输出分布；实验只测了同架构和相同标准化）。[第 2.2 节](https://arxiv.org/html/2211.17192#S2.SS2)，[第 3.6 节](https://arxiv.org/html/2211.17192#S3.SS6)。

> 记号陷阱：Chen et al. 恰好反过来用 $q$ 表示目标模型、$p$ 表示草稿模型。阅读两篇论文时必须先换回同一套记号。

## 4. 单 token 的 speculative sampling

给定同一上下文下的目标分布 $p$ 与草稿分布 $q$：

1. 先从草稿分布采样候选 $\tilde x\sim q$；
2. 再采样 $r\sim U(0,1)$；
3. 以

   $$
   a(\tilde x)=\min\left(1,\frac{p(\tilde x)}{q(\tilde x)}\right)
   $$

   的概率接受 $\tilde x$；
4. 如果拒绝，不是直接从 $p$ 重采样，而是从残差分布

   $$
   p'(x)=\operatorname{norm}\left([p(x)-q(x)]_+\right)
   =\frac{p(x)-\min(p(x),q(x))}{1-\beta}
   $$

   采样修正 token，其中 $\beta$ 是总体接受概率。

等价的实现判据是接受当且仅当 $r\le p(\tilde x)/q(\tilde x)$；当比值大于 1 时必然接受。由于 $\tilde x$ 是从 $q$ 采到的，理论上 $q(\tilde x)>0$，因此接受比值对实际候选有定义。

这里最容易犯的错误是：**拒绝后直接从 $p$ 采样会重复加入已被接受部分的概率质量，从而偏置结果。** 残差必须是正部 $[p-q]_+$ 再归一化。

**原文定位**：主论文第 2.3 节给出接受率与修正分布；算法 1 将其扩展到多 token；附录 A.1 给出正确性证明。[第 2.3 节](https://arxiv.org/html/2211.17192#S2.SS3)，[算法 1](https://arxiv.org/html/2211.17192#alg1)，[附录 A.1](https://arxiv.org/html/2211.17192#A1.SS1)。

## 5. 多 token 推测解码：算法 1 的完整流程

一轮 `SpeculativeDecodingStep` 如下。

### 5.1 Draft：小模型串行提出 $\gamma$ 个候选

$$
q_i(\cdot)=M_q(prefix+[x_1,\ldots,x_{i-1}]),\qquad x_i\sim q_i,\quad i=1,\ldots,\gamma.
$$

这 $\gamma$ 次调用仍然串行，但 $M_q$ 必须足够便宜。

### 5.2 Verify：大模型一次并行评分 $\gamma+1$ 个位置

$$
(p_1,\ldots,p_{\gamma+1})\leftarrow M_p(prefix+[x_1,\ldots,x_\gamma]).
$$

概念上，论文写成并行计算 $M_p(prefix)$、$M_p(prefix+[x_1])$、……、$M_p(prefix+[x_1,\ldots,x_\gamma])$。Transformer 实现中通常把草稿序列作为一段输入，通过 causal mask 在一次目标模型前向中得到全部 $\gamma+1$ 个位置的条件分布。

### 5.3 Accept：从左到右验证，遇到首个拒绝即停止

对 $i=1,\ldots,\gamma$，独立采样 $r_i\sim U(0,1)$，接受 $x_i$ 当且仅当

$$
r_i\le \min\left(1,\frac{p_i(x_i)}{q_i(x_i)}\right).
$$

设首个被拒绝的是 $x_{n+1}$，则保留 $x_1,\ldots,x_n$，丢弃它之后的所有草稿 token。后续 token 的条件上下文已经包含被拒绝 token，因此即使单独看似合理也不能再用。

### 5.4 Correct/Bonus：本轮始终额外产出一个目标 token

- 若 $n<\gamma$，从

  $$
  p'(x)=\operatorname{norm}([p_{n+1}(x)-q_{n+1}(x)]_+)
  $$

  采样修正 token $t$；
- 若全部 $\gamma$ 个草稿都接受，直接从 $p_{\gamma+1}$ 采样一个 bonus token $t$。

最终追加 $[x_1,\ldots,x_n,t]$，所以一轮至少生成 1 个、最多生成 $\gamma+1$ 个 token。最坏情况下，目标模型的串行调用次数不会比普通自回归解码更多；但总算术量仍可能更多。

**原文定位**：主论文算法 1，第 2.3 节；图 1 展示 38 token 仅用 9 次目标模型串行调用的示例，其中绿色为接受、红色为拒绝、蓝色为修正。[算法 1](https://arxiv.org/html/2211.17192#alg1)，[图 1 与第 1 节](https://arxiv.org/html/2211.17192#S1.F1)。

## 6. 为什么输出分布严格等价

### 6.1 单步证明

先算总体接受概率：

$$
\beta
=\sum_x q(x)\min\left(1,\frac{p(x)}{q(x)}\right)
=\sum_x\min(p(x),q(x)).
$$

对任意 token $x'$，最终输出它有两条互斥路径。

**路径一：候选就是 $x'$ 且被接受。**

$$
P(accepted, X=x')
=q(x')\min\left(1,\frac{p(x')}{q(x')}\right)
=\min(p(x'),q(x')).
$$

**路径二：候选被拒绝，再从残差分布采到 $x'$。**

残差分布的归一化常数是

$$
\sum_x[p(x)-q(x)]_+=1-\sum_x\min(p(x),q(x))=1-\beta.
$$

所以

$$
P(rejected, X=x')
=(1-\beta)p'(x')
=p(x')-\min(p(x'),q(x')).
$$

两条路径相加：

$$
P(X=x')=\min(p(x'),q(x'))+p(x')-\min(p(x'),q(x'))=p(x').
$$

因此单步输出严格服从 $p$。

### 6.2 从单步到整段序列

算法从左到右验证。已接受前缀下的每一个位置，都使用该真实前缀对应的 $p_i,q_i$ 做同样的单步校正；首个拒绝位置用残差恢复 $p_i$，全接受时 bonus token 直接从 $p_{\gamma+1}$ 采样。于是对任意已经生成的前缀 $x_{<t}$，都有

$$
P_{spec}(x_t\mid x_{<t})=p(x_t\mid x_{<t}).
$$

再按概率链式法则/对生成位置归纳：

$$
P_{spec}(x_{1:T})
=\prod_{t=1}^{T}P_{spec}(x_t\mid x_{<t})
=\prod_{t=1}^{T}p(x_t\mid x_{<t})
=P_p(x_{1:T}).
$$

这才是“整段输出分布不变”的完整含义。

### 6.3 “分布相同”不等于“样本逐 token 相同”

- 对随机采样，普通解码和推测解码消耗随机数的顺序不同，因此同一个伪随机种子也不必得到同一条 token 序列；保证的是随机变量的分布相同。
- 对 argmax，调整后的 $p,q$ 都是 one-hot 分布。草稿 argmax 与目标 argmax 相同时必接收，不同时拒绝并由目标 one-hot 分布修正，因此在精确算术和确定性 tie-breaking 下得到相同贪心结果。
- 实际浮点实现只可能做到“在硬件数值误差范围内”等价。并行评分与逐 token 评分的计算图不同，rounding、并行归约、top-k tie、随机数流都可能使单条样本不同。Chen et al. 第 6.1 节明确写出这一点。

**原文定位**：主论文附录 A.1 的逐 token 证明；第 3.6 节说明任意 $M_q$ 均不改变分布。Chen et al. 定理 1 给出同构证明，并在第 6.1 节强调 hardware numerics 与随机数流。[主论文附录 A.1](https://arxiv.org/html/2211.17192#A1.SS1)，[Chen 定理 1](https://arxiv.org/html/2302.01318#Thmtheorem1)，[Chen 第 6.1 节](https://arxiv.org/html/2302.01318#S6.SS1)。

## 7. 接受率、分布距离与最大耦合视角

给定前缀，接受率为

$$
\beta=\sum_x\min(p(x),q(x)).
$$

论文定义

$$
D_{LK}(p,q)=\sum_x\left|p(x)-\frac{p(x)+q(x)}2\right|
=\frac12\sum_x|p(x)-q(x)|.
$$

这其实就是标准的总变差距离（total variation distance，TV），不是 KL divergence：

$$
D_{LK}(p,q)=1-\sum_x\min(p(x),q(x)),\qquad \beta=1-D_{LK}(p,q).
$$

因此接受率的解释非常直接：$p$ 与 $q$ 重叠的概率质量越大，草稿越容易被接受。接受事件分配给 token $x$ 的质量恰好是 $\min(p(x),q(x))$，总接受概率达到两个分布耦合后样本相等概率的理论上限 $1-TV(p,q)$；从概率论角度，它就是一个最大耦合构造。

论文把不同真实前缀上的 $\beta$ 当成随机变量，并记

$$
\alpha=E[\beta]=1-E[D_{LK}(p,q)].
$$

需要区分：$\beta$ 是给定前缀时的接受概率；$\alpha$ 是跨生成轨迹/前缀的平均接受率。

**原文定位**：主论文定义 3.1–3.2、引理 3.3、定理 3.5、推论 3.6（第 3.1–3.2 节）。[第 3.1 节](https://arxiv.org/html/2211.17192#S3.SS1)，[第 3.2 节](https://arxiv.org/html/2211.17192#S3.SS2)。“最大耦合”是对论文公式的标准概率论解释，原文未使用该术语。

## 8. 一轮期望生成长度

论文为得到闭式解，作了一个简化假设：各位置的接受事件独立同分布，平均接受概率为 $\alpha$。设一轮输出 token 数为 $L\in\{1,\ldots,\gamma+1\}$，则

$$
P(L=k)=\alpha^{k-1}(1-\alpha),\quad 1\le k\le\gamma,
$$

$$
P(L=\gamma+1)=\alpha^\gamma.
$$

利用尾和公式：

$$
E[L]
=\sum_{k=1}^{\gamma+1}P(L\ge k)
=\sum_{j=0}^{\gamma}\alpha^j
=\frac{1-\alpha^{\gamma+1}}{1-\alpha}.
$$

相应地，一轮接受的草稿 token 数 $N=L-1$ 的期望是

$$
E[N]=\sum_{j=1}^{\gamma}\alpha^j
=\frac{\alpha(1-\alpha^\gamma)}{1-\alpha}.
$$

边界检查：$\alpha=0$ 时每轮仅产生 1 个修正 token；$\alpha\to1$ 时 $E[L]\to\gamma+1$。

这里的闭式公式依赖 i.i.d. 假设。实际 $\beta$ 随任务、前缀和位置变化且存在相关性；论文附录 A.3 明确把理论值与实测值之差部分归因于此假设只是近似。

**原文定位**：主论文公式 (1)、图 2（第 3.1 节）；附录 A.3、表 4讨论理论与实测差异。[公式 (1) 与图 2](https://arxiv.org/html/2211.17192#S3.SS1)，[附录 A.3](https://arxiv.org/html/2211.17192#A1.SS3)。

## 9. 延迟加速公式与适用判据

定义时间成本系数

$$
c=\frac{\text{一次 }M_q\text{ 解码步的时间}}{\text{一次 }M_p\text{ 解码步的时间}}.
$$

设一次 $M_p$ 解码步耗时为 $T$。在论文的核心硬件假设下，目标模型并行评分 $\gamma+1$ 个位置仍近似耗时 $T$；草稿模型串行运行 $\gamma$ 次耗时 $\gamma cT$。因此一轮总耗时为

$$
T_{round}=T(1+\gamma c).
$$

除以一轮期望 token 数，单 token 期望耗时为

$$
T_{spec/token}
=T\frac{(1+\gamma c)(1-\alpha)}{1-\alpha^{\gamma+1}}.
$$

相对普通解码的期望加速比为主论文定理 3.8：

$$
S(\alpha,c,\gamma)
=\frac{T}{T_{spec/token}}
=\frac{1-\alpha^{\gamma+1}}{(1-\alpha)(1+\gamma c)}.
$$

### 9.1 何时至少存在一个有收益的 $\gamma$

取 $\gamma=1$：

$$
S(\alpha,c,1)=\frac{1+\alpha}{1+c}.
$$

所以只要 $\alpha>c$ 就能获得严格加速。这是主论文推论 3.9 给出的充分条件。

### 9.2 如何选择 $\gamma$

在 $\alpha,c$ 已知且并行算力足够时，枚举正整数 $\gamma$，最大化 $S(\alpha,c,\gamma)$ 即可。$\gamma$ 并非越大越好：更长的 draft 增加 $\gamma c$，且后面的 token 只有在前面全部接受时才有价值。论文图 3 展示不同 $c$ 下的最优 $\gamma$；Chen et al. 图 1 的实测也显示速度会随 draft length 平台化甚至回退。

### 9.3 可忽略成本草稿模型

若 $c\approx0$（如 n-gram 查表或复制启发式），则

$$
S\approx\frac{1-\alpha^{\gamma+1}}{1-\alpha}\le\frac1{1-\alpha}.
$$

主论文给出的例子是 T5-XXL EnDe 配 bigram 草稿，$\alpha\approx0.2$、$\gamma=3$，理论加速约 1.25 倍。

**原文定位**：主论文定义 3.7、定理 3.8、推论 3.9（第 3.3 节），第 3.5 节与图 3，第 3.6 节的 negligible-cost models。[第 3.3 节](https://arxiv.org/html/2211.17192#S3.SS3)，[第 3.5 节](https://arxiv.org/html/2211.17192#S3.SS5)，[第 3.6 节](https://arxiv.org/html/2211.17192#S3.SS6)。

## 10. 延迟降低不等于计算量降低

定义算术成本比

$$
\hat c=\frac{M_q\text{ 每 token 算术量}}{M_p\text{ 每 token 算术量}}.
$$

论文按概念上的 $\gamma+1$ 个并行目标位置计数，一轮算术量为

$$
\hat T(\gamma\hat c+\gamma+1),
$$

所以相对普通解码，每 token 总算术量的增加因子为定理 3.11：

$$
R_{ops}
=\frac{(1-\alpha)(\gamma\hat c+\gamma+1)}{1-\alpha^{\gamma+1}}.
$$

拒绝越多，已经为后续草稿位置做的目标计算浪费越多。论文表 1 在 $c=\hat c=0$ 时举例：

| $\alpha$ | $\gamma$ | 算术量倍数 | 理论速度倍数 |
|---:|---:|---:|---:|
| 0.6 | 2 | 1.53× | 1.96× |
| 0.7 | 3 | 1.58× | 2.53× |
| 0.8 | 2 | 1.23× | 2.44× |
| 0.8 | 5 | 1.63× | 3.69× |
| 0.9 | 2 | 1.11× | 2.71× |
| 0.9 | 10 | 1.60× | 6.86× |

它优化的是 latency，不是 FLOPs。论文同时指出目标权重和 KV cache 可在一轮中读取一次，因此相对每 token 的内存访问可能按 $E[L]$ 的因子下降；这正是用额外算术并发换取 walltime 的硬件基础。

**原文定位**：主论文第 3.4 节、定理 3.11、表 1、图 4。[第 3.4 节](https://arxiv.org/html/2211.17192#S3.SS4)，[表 1](https://arxiv.org/html/2211.17192#S3.T1)，[图 4](https://arxiv.org/html/2211.17192#S3.F4)。

## 11. 主论文实验：设置与确切结果

### 11.1 设置

- 目标模型：T5 v1.1 XXL，11B 参数，encoder-decoder。
- 任务：WMT English-to-German（EnDe）翻译；CNN/DailyMail（CNNDM）摘要。正文设置段把 CNN/DM 误写成 “CCN/DM”，表格使用 CNNDM。
- 草稿模型：现有 checkpoint，T5-small 77M、T5-base 250M、T5-large 800M。
- 硬件：单张 TPU-v4。
- batch size：1。
- 解码：temperature 0（argmax）与 temperature 1（standard sampling）。
- 对照：T5X 的标准实现。
- $\alpha$ 测量：第 4.2 节说明，各配置用目标模型生成的 10K token 估计定理 3.6 中的期望。

### 11.2 表 2 与附录表 4 的合并核验

下表的 $\gamma,\alpha,Emp$ 来自主论文表 2；$c,Exp$ 来自附录表 4。`Emp` 是实测 walltime 加速，`Exp` 是定理 3.8 的预测。

| 任务 | 草稿模型 | Temp | $\gamma$ | $\alpha$ | $c$ | 理论 Exp | 实测 Emp |
|---|---|---:|---:|---:|---:|---:|---:|
| EnDe | T5-small | 0 | 7 | 0.75 | 0.02 | 3.2× | **3.4×** |
| EnDe | T5-base | 0 | 7 | 0.80 | 0.04 | 3.3× | 2.8× |
| EnDe | T5-large | 0 | 7 | 0.82 | 0.11 | 2.5× | 1.7× |
| EnDe | T5-small | 1 | 7 | 0.62 | 0.02 | 2.3× | **2.6×** |
| EnDe | T5-base | 1 | 5 | 0.68 | 0.04 | 2.4× | 2.4× |
| EnDe | T5-large | 1 | 3 | 0.71 | 0.11 | 2.0× | 1.4× |
| CNNDM | T5-small | 0 | 5 | 0.65 | 0.02 | 2.4× | **3.1×** |
| CNNDM | T5-base | 0 | 5 | 0.73 | 0.04 | 2.6× | 3.0× |
| CNNDM | T5-large | 0 | 3 | 0.74 | 0.11 | 2.0× | 2.2× |
| CNNDM | T5-small | 1 | 5 | 0.53 | 0.02 | 1.9× | **2.3×** |
| CNNDM | T5-base | 1 | 3 | 0.55 | 0.04 | 1.8× | 2.2× |
| CNNDM | T5-large | 1 | 3 | 0.56 | 0.11 | 1.6× | 1.7× |

三个关键信号：

1. 更大的草稿模型确实有更高 $\alpha$，但 $c$ 也更高，最终反而更慢；最佳是约小两个数量级的 T5-small。
2. argmax 的分布更尖，通常有更高接受率，因此比温度 1 采样更快。
3. 理论值与实测总体同量级，但并非精确预测。附录 A.3 将差异归因于实现优化差异和 i.i.d. 假设不完全成立。

原文存在一处内部不一致：第 3.3 节称实验中的 $c$ “always less than 0.05”，但附录表 4 给 T5-large 的 $c=0.11$。引用成本范围时应以逐配置表 4 为准，不应复述“始终小于 0.05”。

**原文定位**：第 4.1 节设置/结果与表 2；第 4.2 节和表 3；附录 A.3 与表 4。[第 4.1 节与表 2](https://arxiv.org/html/2211.17192#S4.SS1)，[表 3](https://arxiv.org/html/2211.17192#S4.T3)，[附录表 4](https://arxiv.org/html/2211.17192#A1.T4)。

### 11.3 只测接受率、未测 walltime 的其他配置

主论文只为 T5 实现并报告 walltime；GPT-like 和 LaMDA 部分仅测 $\alpha$：

| 目标模型/任务 | 草稿模型 | $\alpha$ (T=0) | $\alpha$ (T=1) |
|---|---|---:|---:|
| GPT-like 97M / lm1b | unigram | 0.03 | 0.03 |
| GPT-like 97M / lm1b | bigram | 0.05 | 0.05 |
| GPT-like 97M / lm1b | GPT-like 6M | 0.88 | 0.89 |
| LaMDA 137B / dialog | LaMDA 100M | 0.61 | 0.57 |
| LaMDA 137B / dialog | LaMDA 2B | 0.71 | 0.71 |
| LaMDA 137B / dialog | LaMDA 8B | 0.75 | 0.74 |

LaMDA 的输出始终经过 top-40 filter；这不影响 argmax，但会影响标准采样。不要把这些 $\alpha$ 数据写成 GPT/LaMDA 的实测加速结果。

**原文定位**：主论文第 4.2 节、表 3及其脚注。[表 3](https://arxiv.org/html/2211.17192#S4.T3)。

## 12. Chen et al. 同期论文的交叉证据

Chen、Borgeaud、Irving、Lespiau、Sifre、Jumper 的 *Accelerating Large Language Model Decoding with Speculative Sampling* 于 2023-02-02 提交 arXiv。它独立给出相同的 modified rejection sampling 结构。主论文第 5 节也注明，这项独立实现是在其首次发布后出现的，并在 Chinchilla 70B 上得到相近的 2–2.5 倍加速。

### 12.1 额外的工程解释

Chen et al. 把大模型一次短序列 scoring 接近一次单 token sampling 的原因拆为三项：

- 小 batch 下线性层受权重内存带宽限制，增加少量位置仍可能保持 memory-bound；
- attention 读取既有 KV cache 的成本占主导，短 draft 不显著增加这部分数据量；
- 模型并行的 all-reduce 对少量 activation 往往偏 latency-bound。

论文也明确说这些条件不是无条件成立：position encoding、nucleus sampling 的排序、硬件和实现细节都可能增加 scoring 开销。

### 12.2 Chinchilla 70B 的确切结果

- 目标模型：Chinchilla 70B；草稿模型：专为低采样延迟训练的 4B、8 层模型。
- 硬件：两者都部署于 16 张 TPU-v4；目标模型 14.1 ms/token，草稿模型 1.8 ms/token。
- batch size 1，$K=4$。

| 任务/解码 | 指标：普通 → SpS | token 时间：普通 → SpS | 加速 |
|---|---:|---:|---:|
| XSum, nucleus $p=0.8$ | ROUGE-2 0.112 → 0.114 | 14.1 → 7.52 ms | 1.92× |
| XSum, greedy | ROUGE-2 0.157 → 0.156 | 14.1 → 7.00 ms | 2.01× |
| HumanEval 100-shot, nucleus $p=0.95$, temp 0.8 | 45.1% → 47.0% | 14.1 → 5.73 ms | 2.46× |

评测规模为 XSum 11,305 条、最多生成 128 token；HumanEval 16,400 个样本、最多 512 token。指标的小幅差异不是算法改变了理论分布的证据，因为两种运行使用不同随机数流与不同硬件计算图；论文以 benchmark parity 做经验核验。

Chen et al. 还实测了 draft length：$K$ 增大时，一轮生成更多 token，但草稿调用和 scoring 开销增加、有效接受比例下降、全序列延迟方差上升；XSum nucleus 在 $K=3$ 最优。这个结果直接支持“$\gamma$ 需要按 workload 调参，不能越大越好”。

**一手来源**：[Chen et al. arXiv](https://arxiv.org/abs/2302.01318)、[HTML 全文](https://arxiv.org/html/2302.01318)、[算法 2](https://arxiv.org/html/2302.01318#alg2)、[第 4.1–4.2 节](https://arxiv.org/html/2302.01318#S4)、[表 1 与第 6.1 节](https://arxiv.org/html/2302.01318#S6.SS1)、[第 6.3 节](https://arxiv.org/html/2302.01318#S6.SS3)、[定理 1](https://arxiv.org/html/2302.01318#Thmtheorem1)。

## 13. 局限与适用条件

### 13.1 必须满足的性能条件

1. **目标调用要能从并行位置获益。** 定理 3.8 假设并行评分 $\gamma+1$ 个位置的 walltime 近似一次目标步；如果硬件已 compute-bound，或长 context/attention 让多位置 scoring 明显变贵，公式会过度乐观。
2. **需要富余算力。** 推测解码通常增加总算术量；没有并行计算余量时不会降低延迟。主论文第 6 节把这列为核心限制。
3. **更适合 latency-oriented、低 batch 场景。** 主论文只测 batch 1；Chen 也定位于 latency-critical、small-batch。高 batch 服务本来就能用 batching 吃满算力，推测解码的收益可能缩小，吞吐量甚至下降。
4. **草稿模型必须“又准又便宜”。** 关键不是参数量本身，而是实测的 $\alpha/c$ 组合；T5-large 的接受率最高却因 $c=0.11$ 反而最慢。
5. **生成要足够长。** 定理 3.8 明确假设生成长度足够；短输出时启动成本和至少一次目标调用会限制加速上限。

### 13.2 正确性在工程上的边界

1. $p$、$q$ 必须在同一 token 空间上计算，且温度/top-k/top-p 等标准化顺序必须明确一致；真正保证不变的是进入校正步骤的目标分布。
2. 当 $p=q$ 时拒绝概率为 0，残差的归一化常数也是 0。数学上残差分支永远不可达；实现必须避免在不可达分支仍计算并采样 0/0。
3. 浮点误差、低精度量化、并行归约顺序、top-k 边界 tie 和 PRNG 管理会影响逐样本复现。更稳妥的表述是“理论上分布严格等价，实际在硬件数值精度内等价”。
4. 遇到 EOS、最大长度或 stop sequence 时必须立即截断，不能因为一轮已验证出多个 token 就越过终止条件。
5. 论文附录 A.5 的 lenience 参数会用可控偏差换更高接受率；主论文强调除该节外的实验均使用 $l=1$ 的严格版本。使用 lenience 后不应再宣称输出分布完全相同。

### 13.3 论文尚未充分覆盖的范围

- 主论文 walltime 实验只覆盖 T5-XXL、两项文本任务、单 TPU-v4、batch 1；GPT-like 与 LaMDA 只有接受率，没有端到端 walltime。
- $\beta$ 的 i.i.d. 假设只是近似，固定 $\gamma$ 也不是最优策略。论文估计若有 oracle 动态选 $\gamma$，典型 $c,\alpha$ 下、无限算力假设中，额外加速上界可比固定 $\gamma$ 高约 60%，但留作未来工作。
- Beam search 只在附录 A.4 给出方案草图：草稿 beam width $u\ge w$，验证成本约 $w+u\gamma$ 个目标位置；完整分析留作未来工作。
- 原论文没有在 PMLR 页面或正文提供作者官方代码链接。论文只说明基于 T5X 实现了算法，因此第三方复现不能当作原论文实验实现的逐行依据。

**原文定位**：主论文第 3.3–3.6 节、第 6 节、附录 A.4–A.5；Chen et al. 第 4.1 节、第 6.3 节。[主论文讨论](https://arxiv.org/html/2211.17192#S6)，[Beam search](https://arxiv.org/html/2211.17192#A1.SS4)，[Lenience](https://arxiv.org/html/2211.17192#A1.SS5)。

## 14. 实现时的最小正确性清单

1. 草稿阶段保存每个位置的 $q_i$，不能事后用错误前缀重算。
2. 目标阶段用完整草稿前缀和 causal mask 一次得到 $p_1,\ldots,p_{\gamma+1}$。
3. 接受比值必须取候选 token 上的标量 $p_i(x_i)/q_i(x_i)$，并裁到 1。
4. 只能保留首个拒绝位置之前的连续草稿前缀。
5. 拒绝时用 $\operatorname{norm}([p_i-q_i]_+)$，不能直接从 $p_i$ 重采样。
6. 全接受时从 $p_{\gamma+1}$ 采 bonus token，才能达到最多 $\gamma+1$ token/轮。
7. 对 $p=q$、完全不重叠分布、极小概率、argmax、top-k/top-p、EOS 和长度边界写单元测试。
8. 分布级测试应比较大量样本的经验频率，而不是要求普通解码和推测解码在同一 seed 下逐 token 一致。
9. 性能测试至少报告 batch、prompt/生成长度、$\gamma$、$\alpha$、草稿/目标单步时间比 $c$、目标多位置 scoring 时间和端到端速度。

## 15. 可用于成文的核心判断

- 推测解码的核心创新不是“小模型预测大模型”，而是用差分分布校正，把任意草稿分布变成目标分布的精确采样器。
- 接受率恰好是 $1-TV(p,q)$；草稿模型优化的直接目标应同时考虑分布重叠与实际延迟，而不是只追求更低 perplexity 或更大参数量。
- 加速来自减少串行深度和权重/KV 访问次数，不来自减少 FLOPs；它本质上是用并行算力换 latency。
- “2–3×”是特定硬件、batch 1 和任务上的实测值，不是算法常数。更可迁移的判断式是

  $$
  S=\frac{1-\alpha^{\gamma+1}}{(1-\alpha)(1+\gamma c)}.
  $$

- “lossless”应准确写成“目标条件分布与整段联合分布不变”；除确定性贪心和理想数值条件外，不承诺逐样本完全相同。

## 16. 一手来源索引

1. Leviathan, Kalman, Matias. *Fast Inference from Transformers via Speculative Decoding*. ICML 2023 / PMLR 202:19274–19286：[PMLR](https://proceedings.mlr.press/v202/leviathan23a.html)，[PDF](https://proceedings.mlr.press/v202/leviathan23a/leviathan23a.pdf)，[arXiv v2](https://arxiv.org/abs/2211.17192v2)，[HTML](https://arxiv.org/html/2211.17192)。
2. Chen, Borgeaud, Irving, Lespiau, Sifre, Jumper. *Accelerating Large Language Model Decoding with Speculative Sampling*. arXiv:2302.01318v1：[arXiv](https://arxiv.org/abs/2302.01318v1)，[PDF](https://arxiv.org/pdf/2302.01318v1)，[HTML](https://arxiv.org/html/2302.01318)。
