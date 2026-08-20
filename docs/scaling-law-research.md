# Scaling Law 论文研究底稿

## 研究范围

本文档为技术笔记提供一手来源依据，主线是 Kaplan 等人 2020 年论文《Scaling Laws for Neural Language Models》，并用 Hoffmann 等人 2022 年论文《Training Compute-Optimal Large Language Models》（Chinchilla）说明后来对计算最优训练配比的修正。

核心来源：

- Jared Kaplan et al., [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361), arXiv:2001.08361，2020。PDF：[arxiv.org/pdf/2001.08361](https://arxiv.org/pdf/2001.08361)。
- Jordan Hoffmann et al., [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556), arXiv:2203.15556，2022。PDF：[arxiv.org/pdf/2203.15556](https://arxiv.org/pdf/2203.15556)。
- Google DeepMind, [An empirical analysis of compute-optimal large language model training](https://deepmind.google/blog/an-empirical-analysis-of-compute-optimal-large-language-model-training/)（论文官方介绍）。

## Kaplan 2020：研究问题与实验口径

论文研究自回归语言模型的交叉熵损失如何随三类尺度变化：非词嵌入参数量 $N$、训练数据 token 数 $D$、训练计算量 $C$。主要实验使用 decoder-only Transformer 和 WebText2，模型规模约跨越 $10^3$ 到 $10^9$ 个非词嵌入参数；作者还比较了网络深宽比、注意力头数及部分其他架构设置。[Kaplan 2020，第 1、2 节，第 2-7 页]

作者采用的近似训练计算量为

$$
C \approx 6NBS = 6ND,
$$

其中 $B$ 是每步处理的 token 数，$S$ 是优化步数，$D=BS$ 是训练期间处理的 token 总数；系数 6 近似覆盖前向与反向计算。此处 $N$ 不含 embedding 参数，且估算忽略了与上下文长度成比例的注意力项。[Kaplan 2020，第 1.3、2.1 节，第 6-7 页；附录 C，第 22-23 页]

## 三条基础幂律

当性能仅受单一资源瓶颈限制时，测试损失可分别拟合为：

$$
L(N)=\left(\frac{N_c}{N}\right)^{\alpha_N},
\qquad
\alpha_N\approx0.076,
\quad N_c\approx8.8\times10^{13},
$$

$$
L(D)=\left(\frac{D_c}{D}\right)^{\alpha_D},
\qquad
\alpha_D\approx0.095,
\quad D_c\approx5.4\times10^{13},
$$

$$
L(C_{\min})=
\left(\frac{C^{\min}_c}{C_{\min}}\right)^{\alpha^{\min}_C},
\qquad
\alpha^{\min}_C\approx0.050,
\quad C^{\min}_c\approx3.1\times10^8\ \text{PF-days}.
$$

这里 $C_{\min}$ 表示在足够小 batch 下达到某个损失所需的最小非 embedding 计算量，不等于所有实验实际消耗的固定 batch 计算量。论文明确建议用 $L(C_{\min})$ 而不是未校正的 $L(C)$ 外推计算效率。[Kaplan 2020，式 (1.1)-(1.3)，第 4 页；第 6 节，第 15-16 页]

这些指数很小，意味着收益稳定但递减。例如参数翻倍时，容量受限区间的损失仅乘以 $2^{-0.076}\approx0.95$，约下降 5%。$N_c$、$D_c$ 的数值会随词表和分词方式缩放，不应解释为具有普适意义的常数。[Kaplan 2020，第 1.2 节，第 5 页]

## 参数量与数据量的联合规律

论文提出同时描述模型容量瓶颈和数据瓶颈的经验式：

$$
L(N,D)=
\left[
\left(\frac{N_c}{N}\right)^{\alpha_N/\alpha_D}
+\frac{D_c}{D}
\right]^{\alpha_D}.
$$

其两个极限分别回到 $L(N)$ 与 $L(D)$。对完整联合数据重新拟合得到

$$
\alpha_N=0.076,\qquad
\alpha_D=0.103,\qquad
N_c=6.4\times10^{13},\qquad
D_c=1.8\times10^{13}.
$$

因此，固定相对过拟合程度时，数据量应近似满足

$$
D\propto N^{\alpha_N/\alpha_D}\approx N^{0.74}.
$$

直观上，模型扩大 8 倍时，数据约扩大 5 倍即可维持相近的过拟合惩罚。这个结论是早停测试损失上的经验关系，不是“任意模型都应只训练 $N^{0.74}$ token”的通用配方。[Kaplan 2020，式 (1.5)、(4.1)-(4.4)，第 5、10-12 页；表 2，第 11 页]

## 学习曲线与样本效率

在无限数据近似下，越过训练初始瞬态后，有限步数的损失可拟合为

$$
L(N,S)=
\left(\frac{N_c}{N}\right)^{\alpha_N}
+
\left(\frac{S_c}{S_{\min}(S)}\right)^{\alpha_S},
$$

其中 $S_c\approx2.1\times10^3$、$\alpha_S\approx0.76$，$S_{\min}$ 是把 batch 效率校正后达到相同损失所需的最小步数。不同规模模型的学习曲线在此参数化下近似具有相同形状；大模型达到相同损失所需的优化步数和样本更少，因而具有更高样本效率。[Kaplan 2020，式 (1.6)，第 5 页；第 5 节，第 12-14 页]

论文还拟合关键 batch size：

$$
B_{\mathrm{crit}}(L)=\frac{B_*}{L^{1/\alpha_B}},
\qquad B_*\approx2\times10^8\ \text{tokens},
\quad \alpha_B\approx0.21.
$$

$B_{\mathrm{crit}}$ 是训练时间与计算效率之间的折中点，并非应无条件采用的固定 batch。[Kaplan 2020，式 (1.4)、第 5.1 节，第 5、12-13 页]

## Kaplan 的 compute-optimal 结论

在固定计算预算、数据可用且模型规模不受限制的理想条件下，作者由学习曲线推导：

$$
N_{\mathrm{opt}}\propto C_{\min}^{0.73},
\qquad
B_{\mathrm{crit}}\propto C_{\min}^{0.24},
\qquad
S_{\min}\propto C_{\min}^{0.03},
$$

于是用于指数分析的最小数据量满足

$$
D=B_{\mathrm{crit}}S_{\min}\propto C_{\min}^{0.27}.
$$

论文的表述是：预算每增加 10 倍，最优参数量约增加 5 倍，处理的数据量约增加 2 倍，而串行优化步数几乎不变；应把大部分新增计算投入更大的模型，在明显收敛之前停止训练。[Kaplan 2020，式 (1.7)、(6.1)-(6.5)，图 14，第 5、16 页]

这里要区分理想化的最小计算量与实际按关键 batch 训练的口径。论文的 batch 校正式为

$$
C_{\min}=\frac{C}{1+B/B_{\mathrm{crit}}(L)}.
$$

当 $B=B_{\mathrm{crit}}$ 时，实际训练约需 $2S_{\min}$、$2C_{\min}$，处理的 token 约为 $2B_{\mathrm{crit}}S_{\min}$；常数因子不改变上述 0.27 指数。[Kaplan 2020，第 5.1、6.3 节，第 13、17 页]

该结论来自参数量、训练步数和关键 batch 的联合拟合。附录 B 的模型还给出：计算最优训练应停在约高于同规模模型收敛损失 $\alpha_N/\alpha_S\approx10\%$ 的位置。[Kaplan 2020，式 (B.5)，第 20-21 页]

## Chinchilla 2022：对最优分配的修正

Hoffmann 等人重新研究同一问题：在约束 $C\approx6ND$ 下，选择使最终预训练损失最小的 $N$ 和 $D$：

$$
(N_{\mathrm{opt}}(C),D_{\mathrm{opt}}(C))
=
\arg\min_{N,D:\,6ND=C} L(N,D).
$$

他们训练了 400 多个模型，参数规模从约 7000 万到 160 亿，训练数据从 50 亿到 5000 亿 token，并用三种方法估计计算最优前沿。[Hoffmann 2022，摘要和第 1、3 节，第 1-7 页]

第三种方法采用可解释的损失分解：

$$
\hat L(N,D)=E+\frac{A}{N^\alpha}+\frac{B}{D^\beta},
$$

其中 $E$ 代表数据分布的不可约损失，后两项分别代表有限模型容量和有限训练数据造成的损失。结合 $C\approx6ND$，闭式最优解具有

$$
N_{\mathrm{opt}}(C)=G\left(\frac{C}{6}\right)^a,
\qquad
D_{\mathrm{opt}}(C)=G^{-1}\left(\frac{C}{6}\right)^b,
$$

$$
a=\frac{\beta}{\alpha+\beta},
\qquad
b=\frac{\alpha}{\alpha+\beta}.
$$

[Hoffmann 2022，式 (2)-(4)，第 6-7 页]

附录给出的具体拟合是

$$
L(N,D)=1.69+\frac{406.4}{N^{0.34}}+\frac{410.7}{D^{0.28}}.
$$

[Hoffmann 2022，附录 D.2，式 (10)，第 25 页]

三种估计结果分别为：

| 方法 | $N_{\mathrm{opt}}\propto C^a$ | $D_{\mathrm{opt}}\propto C^b$ |
| --- | ---: | ---: |
| 训练曲线最小值 | 0.50 | 0.50 |
| IsoFLOP 曲线 | 0.49 | 0.51 |
| 参数化损失拟合 | 0.46 | 0.54 |
| Kaplan 2020（对照） | 0.73 | 0.27 |

因此 Chinchilla 的核心修正是：计算预算增加时，模型参数和训练 token 应近似等比例增加；模型每翻倍，token 数也应翻倍。论文的经验表可概括成约 20 token/参数，例如 10 亿参数对应约 202 亿 token、100 亿参数对应约 2051 亿 token。这个比例是该实验域的 compute-optimal 近似，不是模型“学会语言”所需的硬性常数。[Hoffmann 2022，表 2、表 3，第 8 页]

## Chinchilla 实证验证

论文用与 Gopher 相同的训练计算预算训练 Chinchilla：

- Gopher：280B 参数，约 300B token。
- Chinchilla：70B 参数，1.4T token，参数约小 4 倍、数据约多 4 倍。

Chinchilla 在论文所测的大多数下游任务上超过 Gopher、GPT-3、Jurassic-1 和 MT-NLG，并把推理与微调成本一并降低。MMLU 平均准确率为 67.5%，比 Gopher 高 7 个百分点以上。这构成了对“同计算预算下，小一些但训练更久”预测的直接大规模验证。[Hoffmann 2022，摘要、第 1 节和第 4 节，第 1-2、8-15 页]

## 如何解释两篇论文的差异

两篇论文并不在“是否应训练到完全收敛”上冲突：两者都认为计算最优模型通常不应训练到最低可能损失。差异在于训练应持续多久、多少预算应分配给 token。Kaplan 建议新增预算主要投入参数量；Chinchilla 发现 Kaplan 明显低估了训练 token 的价值，并把最优指数从约 $(0.73,0.27)$ 修正为接近 $(0.5,0.5)$。[Hoffmann 2022，第 1 节，第 1 页；表 2，第 8 页]

造成差异的实验因素包括：Chinchilla 使用更多且更大规模的训练运行，明确构造 IsoFLOP 曲线，并直接拟合 $L(N,D)$ 的容量项与数据项；论文也指出其多数分析运行超过 5 亿参数，而 Kaplan 数据中的多数运行更小。更关键的是，Kaplan 对所有模型使用固定 token 数和固定学习率日程。Chinchilla 的消融显示，学习率日程长度应与训练 token 数匹配；用较长的固定日程读取较短训练的中间 loss，会高估短训练的损失、低估较少数据的有效性，从而把最优分配推向过大的模型。[Hoffmann 2022，第 2、3 节，第 3-8 页]

技术笔记中应把 Chinchilla 写成“后续经验修正”，不应继续把 $N\propto C^{0.73}$ 当作现代 LLM 训练的默认工程建议。

## 限制与写作边界

### Kaplan 2020 的限制

- 幂律是经验拟合，作者明确表示尚无扎实理论解释，也缺乏对修正项的系统认识，超出实验区间的可信范围不确定。[附录 C，第 22 页]
- 最小数据区间拟合较差；论文没有系统研究正则化与数据增强。[附录 C，第 22-23 页]
- $C\approx6NBS$ 忽略长上下文注意力成本；当 $n_{ctx}\gtrsim12d_{model}$ 时可能明显失真。[附录 C，第 23 页]
- 关键 batch size 对实验范围外损失的外推不可靠，可能改变并行度与串行步数结论。[附录 C，第 22-23 页]
- 指数与常数来自特定数据分布、tokenizer、优化设置和以交叉熵为目标的 Transformer；平滑 loss 改善不保证任一具体下游能力同步改善。[第 8 节，第 18-19 页]

### Chinchilla 2022 的限制

- 大规模直接对照只有 Chinchilla 与 Gopher 两个训练运行，缺少中间尺度的同等验证。[第 5 节，第 15 页]
- 方法仍假设计算、模型和 token 之间服从幂律；论文观察到高预算区间有凹曲率，可能仍高估最优模型规模。[第 5 节，第 15 页]
- 分析运行均少于一个数据 epoch，结论未直接覆盖多 epoch 数据复用。[第 5 节，第 15 页]
- 更大数据集只有在质量足够时才有价值；训练数据扩张会放大去重、测试集污染、偏见、毒性和隐私风险。[第 5 节，第 16 页]
- compute-optimal 只优化预训练损失。实际部署还需计入推理次数、延迟、显存、数据可得性与研发周期；训练最优不必然等于全生命周期成本最优。

## 可直接用于技术笔记的结论

1. Scaling law 描述的是在给定实验域内，交叉熵损失随参数、数据和计算量呈平滑幂律下降；它是经验预测工具，不是能力涌现的完整理论。
2. 幂律指数远小于 1，核心工程含义是可预测的递减收益：保持其他瓶颈不限制时，持续扩大规模仍改善 loss，但代价按幂次快速增加。
3. 单独扩大 $N$ 或 $D$ 最终都会遇到另一侧瓶颈；联合损失面和固定计算量上的高效前沿比单变量曲线更有决策价值。
4. Kaplan 2020 奠定了 $L(N)$、$L(D)$、$L(C)$ 及联合拟合框架，但其 $N\propto C^{0.73}$、$D\propto C^{0.27}$ 的训练配比已被 Chinchilla 的近等比例缩放修正。
5. Chinchilla 的工程结论可简写为“同预算下，很多早期大模型过大且训练不足”；约 20 token/参数是论文实验范围内的经验起点，不是跨数据、架构与目标都成立的常数。
6. 任何外推都应报告数据分布、tokenizer、模型定义、FLOP 口径和拟合范围；不能只引用一个指数而省略成立条件。
