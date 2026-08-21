# Chinchilla 论文研究底稿

## 研究范围

本文档为 Hoffmann 等人 2022 年论文《Training Compute-Optimal Large Language Models》的中文技术笔记提供事实依据。内容以 NeurIPS 2022 终版论文和官方补充材料为主，以 arXiv 版本、Google DeepMind 官方文章、Gopher 原论文和 Kaplan 等人的 scaling law 论文作交叉核验。

核心一手来源：

- Jordan Hoffmann et al., [Training Compute-Optimal Large Language Models](https://proceedings.neurips.cc/paper_files/paper/2022/hash/c1e2faff6f588870935f114ebe04a3e5-Abstract-Conference.html), NeurIPS 2022。终版 PDF：[Paper](https://proceedings.neurips.cc/paper_files/paper/2022/file/c1e2faff6f588870935f114ebe04a3e5-Paper-Conference.pdf)，官方补充材料：[Supplemental](https://proceedings.neurips.cc/paper_files/paper/2022/file/c1e2faff6f588870935f114ebe04a3e5-Supplemental-Conference.pdf)。
- Jordan Hoffmann et al., [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556), arXiv:2203.15556，2022。PDF：[arxiv.org/pdf/2203.15556](https://arxiv.org/pdf/2203.15556)。
- Google DeepMind, [An empirical analysis of compute-optimal large language model training](https://deepmind.google/blog/an-empirical-analysis-of-compute-optimal-large-language-model-training/)，2022 年 4 月 12 日。
- Jack W. Rae et al., [Scaling Language Models: Methods, Analysis & Insights from Training Gopher](https://arxiv.org/abs/2112.11446)，2021。
- Jared Kaplan et al., [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)，2020。

## 研究问题与核心结论

论文研究一个具体的资源分配问题：给定自回归 Transformer 的预训练计算预算 $C$，参数量 $N$ 和训练 token 数 $D$ 应如何分配，才能使最终预训练损失最低：

$$
N_{\mathrm{opt}}(C),D_{\mathrm{opt}}(C)
=
\arg\min_{N,D:\operatorname{FLOPs}(N,D)=C}L(N,D).
$$

论文用 400 多个训练运行估计这个前沿。模型规模从约 70M 到 16B 以上；摘要把训练量概括为 5B 到 500B token，正文写作 5B 到 400B 以上。三种相互独立的拟合方法都得到相近结论：增加计算预算时，最优参数量和最优训练 token 数应近似等比例增加。[终版论文摘要、第 1 节、第 3 节]

若使用最简近似 $N_{\mathrm{opt}}\propto C^{0.5}$、$D_{\mathrm{opt}}\propto C^{0.5}$，计算预算增加 10 倍时，两者都约增加

$$
10^{0.5}\approx3.16
$$

倍。Kaplan 2020 的对照结论是 $N_{\mathrm{opt}}\propto C^{0.73}$、$D_{\mathrm{opt}}\propto C^{0.27}$，即 10 倍预算主要用于把参数量扩大约 5.37 倍，而数据量只扩大约 1.86 倍。Chinchilla 的核心修正不是“模型越小越好”，而是此前的计算最优配方明显低估了继续训练和增加数据的价值。[终版论文第 1、2、3 节，表 2]

## 训练计算量口径

论文在解析推导中采用常见近似：

$$
C\approx6ND,
$$

其中 $N$ 是参数量，$D$ 是训练期间处理的 token 总数。直观上，参数与 token 的一次前向乘加约按 $2ND$ FLOPs 计，反向传播近似为前向的两倍，因此总训练成本约为 $2ND+4ND=6ND$。[官方补充材料 F 节]

正式实验使用更细的 FLOPs 计算，包含 embedding、Q/K/V 投影、attention logits、softmax、attention reduction、dense block 和最终 logits，并把 embedding 参数计入参数总量。补充材料表 A5 中，精细计算与 $6ND$ 的比值在所列模型上约为 0.99 到 1.10，因此该近似足以支持论文的缩放分析，但不应视为任意架构和上下文长度下的精确成本公式。[官方补充材料 F 节、表 A5]

Gopher 预算在论文中有两个口径：正文图表使用 $5.76\times10^{23}$ FLOPs；补充材料用更精确方法重算后得到约 $6.3\times10^{23}$ FLOPs。技术笔记宜写作“约 $6\times10^{23}$ FLOPs”。[终版论文图 2；官方补充材料 F 节]

## 三种最优前沿估计方法

### 方法一：训练曲线包络

作者固定一系列模型规模，每个规模训练 4 个不同的 token horizon，horizon 跨 16 倍。每个运行使用余弦学习率日程，在对应 horizon 内把学习率衰减 10 倍。作者平滑并线性插值完整训练曲线，在每个计算量位置比较所有运行的损失，抽取最低损失形成计算效率包络，再对包络上的最优参数量和 token 数拟合幂律：

$$
N_{\mathrm{opt}}\propto C^a,
\qquad
D_{\mathrm{opt}}\propto C^b.
$$

结果为 $a=0.50$、$b=0.50$。被选中的最低损失点都位于相应训练运行最后 15% 内，这也支持将余弦周期长度与计划训练 token 数匹配。[终版论文第 3.1 节；官方补充材料 B、D.1 节]

### 方法二：IsoFLOP 曲线

作者选择 9 个固定训练预算，范围为 $6\times10^{18}$ 到 $3\times10^{21}$ FLOPs。在每个预算下改变模型规模，并由预算确定 token 数；每次训练的余弦周期与目标训练量匹配。把最终损失对参数量作图后，每个预算都形成有清晰谷底的 IsoFLOP 曲线。作者用抛物线拟合谷底，再对各预算对应的最优 $N$ 和 $D$ 拟合幂律。

结果为 $a=0.49$、$b=0.51$。同一方法在 C4 和 GitHub code 上分别得到 $(0.50,0.50)$ 与 $(0.53,0.47)$，说明近似等比例缩放在这些单 epoch 实验中并非 MassiveText 独有。[终版论文第 3.2 节；官方补充材料 C 节、表 A2]

### 方法三：参数化联合损失

作者把前两种方法的最终损失联合拟合为：

$$
\hat L(N,D)=E+\frac{A}{N^\alpha}+\frac{B}{D^\beta}.
$$

三个部分分别表示：

- $E$：理想生成过程在数据分布上的不可约损失，可理解为自然文本熵的经验下界；
- $A/N^\alpha$：有限模型容量造成的函数逼近误差；
- $B/D^\beta$：有限数据和有限优化步数造成的训练不足。

拟合在对数损失空间使用 Huber loss，$\delta=10^{-3}$，通过 L-BFGS 和网格初值降低局部最优影响。论文给出的经验参数为：

$$
E=1.69,
\qquad A=406.4,
\qquad B=410.7,
\qquad \alpha=0.34,
\qquad \beta=0.28.
$$

[终版论文第 3.3 节；官方补充材料 D.2 节、式 (9)-(10)]

将 $D=C/(6N)$ 代入联合损失并对 $N$ 求导，可得：

$$
N_{\mathrm{opt}}(C)
=
\left(\frac{\alpha A}{\beta B}\right)^{\frac{1}{\alpha+\beta}}
\left(\frac{C}{6}\right)^{\frac{\beta}{\alpha+\beta}},
$$

$$
D_{\mathrm{opt}}(C)
=
\left(\frac{\beta B}{\alpha A}\right)^{\frac{1}{\alpha+\beta}}
\left(\frac{C}{6}\right)^{\frac{\alpha}{\alpha+\beta}}.
$$

因此：

$$
a=\frac{\beta}{\alpha+\beta},
\qquad
b=\frac{\alpha}{\alpha+\beta},
\qquad
a+b=1.
$$

方法三得到 $a=0.46$、$b=0.54$，并在 Gopher 预算处预测比前两种方法更小的最优模型。[终版论文第 3.3、3.4 节]

## 缩放指数与误差范围

| 方法 | $a$：$N_{\mathrm{opt}}\propto C^a$ | $b$：$D_{\mathrm{opt}}\propto C^b$ |
| --- | ---: | ---: |
| 训练曲线包络 | 0.50（0.488, 0.502） | 0.50（0.501, 0.512） |
| IsoFLOP 曲线 | 0.49（0.462, 0.534） | 0.51（0.483, 0.529） |
| 参数化联合损失 | 0.46（0.454, 0.455） | 0.54（0.542, 0.543） |
| Kaplan 2020 | 0.73 | 0.27 |

括号是 bootstrap 的第 10 和第 90 百分位：每次抽取原数据的 80%，共拟合 100 次。它们不是标准误，也不是严格的 95% 置信区间。[终版论文表 2]

论文表 2 把方法三的中心值和区间写成 `0.46 (0.454, 0.455)`。按通常的两位小数舍入，两者略显不一致，可能是底层精度或排版口径造成；研究底稿保留论文原值，不自行修正。

## 计算最优配方的数量级

方法一在补充材料表 A3 中给出以下预测：

| 参数量 | 最优训练 token | 训练 FLOPs |
| ---: | ---: | ---: |
| 400M | 8.0B | $1.92\times10^{19}$ |
| 1B | 20.2B | $1.21\times10^{20}$ |
| 10B | 205.1B | $1.23\times10^{22}$ |
| 67B | 1.5T | $5.76\times10^{23}$ |
| 175B | 3.7T | $3.85\times10^{24}$ |
| 280B | 5.9T | $9.90\times10^{24}$ |
| 1T | 21.2T | $1.27\times10^{26}$ |

[官方补充材料表 A3]

这些数值在论文实验域附近对应约 20 token/参数，因此“Chinchilla ratio”常被简写为 $D\approx20N$。它是基于特定数据、tokenizer、模型族和单 epoch 假设的经验起点，不是跨架构普适常数。

在 Gopher 的计算预算下：

- 方法一预测约 67B 参数、1.5T token；
- 方法二的图示预测约 63B 参数、1.4T token；
- 方法三预测约 40B 参数，明显小于前两种方法；
- 论文因此把合理区间表述为 40B 到 70B，并因数据与计算效率选择区间上端训练 70B Chinchilla。

[终版论文图 2-4、第 4 节]

因此不应把 70B 写成三种方法共同给出的唯一理论最优点。Chinchilla 是用于验证最优区间方向的工程选择。

## Chinchilla 与 Gopher 训练对照

| 项目 | Chinchilla | Gopher |
| --- | ---: | ---: |
| 参数量 | 70B | 280B |
| 训练 token | 1.4T | 300B |
| Transformer 层数 | 80 | 80 |
| attention heads | 64 | 128 |
| key/value size | 128 | 128 |
| $d_{\mathrm{model}}$ | 8,192 | 16,384 |
| FFN size | 32,768 | 65,536 |
| 最大学习率 | $1\times10^{-4}$ | $4\times10^{-5}$ |
| batch size（token） | 1.5M $\rightarrow$ 3M | 3M $\rightarrow$ 6M |
| 优化器 | AdamW | Adam |

[终版论文第 4.1 节、表 3；官方补充材料 G 节]

Chinchilla 的其他训练设置：

- 训练语料为 MassiveText，与 Gopher 相同，但为适应更长训练调整了子集采样比例；
- MassiveWeb、Books、C4、News、GitHub、Wikipedia 的采样比例分别为 45%、30%、10%、10%、4%、1%；
- 使用 SentencePiece，词表大小为 32,000，不执行 NFKC normalization；其 token 与 Gopher 词表有 94.15% 相同；
- 前向和反向计算使用 bfloat16，分布式优化器状态保存 float32 权重副本；
- 使用 TPUv3/TPUv4、JAX 和 Haiku；
- feed-forward size 始终为 $4d_{\mathrm{model}}$；训练中途将 batch size 翻倍。

[终版论文第 4.1 节；官方补充材料表 A1、模型卡表 A13]

论文把 Chinchilla 描述为参数量缩小 4 倍、数据量增加约 4 倍，并声明两者预训练 FLOPs 相同。按表中数字直接计算，$1.4T/300B\approx4.67$，所以“4 倍数据”是取整后的公开表述，而非精确比值。

还应注意，这不是只改变 $N/D$ 的严格控制实验：Chinchilla 和 Gopher 同时存在优化器、tokenizer、高精度权重副本和数据采样比例差异。补充材料用较小模型验证了 AdamW 和高精度副本的收益，但大规模下游性能差异仍不能全部严格归因于参数量与 token 分配。[终版论文第 4.1 节；官方补充材料 G 节]

## 下游评测结果

### 语言建模与知识任务

- Chinchilla 在 The Pile 报告的所有子集上都取得比 Gopher 更低的 bits-per-byte；在 WikiText-103 上 perplexity 为 7.16，Gopher 为 7.75。[终版论文第 4.2 节；官方补充材料表 A7]
- MMLU 5-shot 平均准确率为 67.6%，Gopher 为 60.0%，提高 7.6 个百分点；57 个子任务中胜 51、平 2、负 4。[终版论文第 4.2 节；官方补充材料图 A9、表 A8-A9]
- BIG-bench 62 项平均准确率为 65.1%，Gopher 为 54.4%，提高 10.7 个百分点，仅 4 项低于 Gopher。[终版论文第 4.2 节；官方补充材料表 A10]

### 阅读理解与常识推理

| 任务 | Chinchilla | Gopher |
| --- | ---: | ---: |
| LAMBADA zero-shot | 77.4 | 74.5 |
| RACE-m few-shot | 86.8 | 75.1 |
| RACE-h few-shot | 82.3 | 71.6 |
| HellaSwag zero-shot | 80.8% | 79.2% |
| PIQA zero-shot | 81.8% | 81.8% |
| Winogrande zero-shot | 74.9% | 70.1% |
| SIQA zero-shot | 51.3% | 50.6% |
| BoolQ zero-shot | 83.7% | 79.3% |

[终版论文表 4、表 5]

TruthfulQA 上，Chinchilla 的 0-shot、5-shot、10-shot 准确率分别为 43.6%、58.5%、66.7%；Gopher 报告的 0-shot 和 10-shot 为 29.5%、43.7%。[终版论文第 4.2 节]

### 闭卷问答

- Natural Questions：Chinchilla 的 5-shot、64-shot 为 31.5%、35.5%，Gopher 为 24.5%、28.2%。
- TriviaQA unfiltered：Chinchilla 的 0-shot、5-shot 为 67.0%、73.2%，Gopher 为 52.8%、63.6%。
- TriviaQA filtered：Chinchilla 的 0-shot、5-shot、64-shot 为 55.4%、64.1%、64.6%，均高于 Gopher。

[官方补充材料表 A11]

### 偏见与毒性

Winogender 整体正确率为 78.3%，Gopher 为 71.4%，但不同性别和 `gotcha` 分组的改善不均，说明更好的语言建模性能没有消除偏见。[官方补充材料 H.3、I 节、表 A12]

在 25,000 个无提示生成样本中，PerspectiveAPI toxicity 的均值、中位数和 95 分位分别为：

| 指标 | Chinchilla | Gopher |
| --- | ---: | ---: |
| 均值 | 0.087 | 0.081 |
| 中位数 | 0.066 | 0.064 |
| 95 分位 | 0.238 | 0.230 |

作者认为差异可以忽略，并据此指出无条件文本生成中的毒性与语言建模 loss 改善并无明显相关性。需要准确表述为“毒性没有明显变化”，不能写成“Chinchilla 的毒性数值更低”。[官方补充材料 I 节]

## 局限与适用边界

### 论文明确列出的局限

- 大规模直接对照只有 Chinchilla 与 Gopher 两个训练运行，没有中间规模的同等验证。
- 最优前沿被假设为计算量、模型规模和 token 数之间的幂律；高预算处已经观察到 $\log N_{\mathrm{opt}}$ 的凹曲率，可能意味着论文仍高估了大规模最优参数量。
- 缩放分析主要覆盖少于一个整体数据 epoch 的训练，未验证重复多 epoch 使用数据时的最优关系。
- 扩充训练数据只有在数据质量足够时才有价值；更大网页语料还会放大去重、评测污染、偏见、毒性、隐私和数据审查问题。

[终版论文第 5 节；官方补充材料 C、E 节]

### 复现与统计边界

- NeurIPS checklist 明确说明训练代码和数据是 proprietary，没有随论文发布完整复现资产。
- Chinchilla 没有按多个随机种子重复训练，因此没有大规模训练的随机波动误差条。
- bootstrap 区间只反映在已有实验点上重新采样后的拟合稳定性，不能覆盖数据、优化器、架构和外推形式的系统误差。
- “所有分析训练少于一轮”指整体数据分布；按采样子集计算，1.4T token 中 MassiveWeb 约使用 1.24 epoch，Wikipedia 约使用 3.40 epoch，两种表述的统计对象不同。

[终版论文 checklist；官方补充材料表 A1]

### 工程解释边界

- 论文目标是固定预训练 FLOPs 下最小化预训练 loss，不是把数据采集、训练、微调、推理和服务成本合并后的全生命周期最优。
- 更小的 Chinchilla 确实减少推理显存和计算，但若模型会被调用多少次已知，最优参数量可能还应显式计入推理成本。
- 约 20 token/参数只应作为在相近 dense autoregressive Transformer 和数据条件下的先验；MoE、检索增强、长上下文、多模态、新优化器以及不同质量的数据都会移动最优点。
- 平均预训练 loss 和基准分数改善不保证安全性、事实可靠性或每一类下游能力都同步改善。

## 原文口径差异

技术笔记引用数字时应采用以下优先级：NeurIPS 终版正文或补充材料优先，其次是 arXiv 与官方博客。

1. **Chinchilla 训练 token**：NeurIPS 终版和 arXiv 论文写 1.4T；DeepMind 官方博客写 1.3T。正文应采用 1.4T，并可在注释中说明官方博客存在不同口径。
2. **MMLU**：论文摘要写 67.5%，终版正文和补充材料表 A8 写 67.6%。详细结果应采用 67.6%。
3. **实验 token 范围**：摘要写 5B 到 500B，正文写 5B 到 400B 以上。宜概括为约 5B-500B。
4. **Gopher FLOPs**：正文预测图使用 $5.76\times10^{23}$，补充材料精算为 $6.3\times10^{23}$。宜写约 $6\times10^{23}$。
5. **“4 倍数据”**：论文与博客采用取整表述；按 1.4T 与 300B 计算实际约为 4.67 倍。
6. **LaMDA token 数**：arXiv v1 表 1 显示 168B，而 NeurIPS 终版显示 768B。若文章需要该横向对比，应使用终版 768B；这一差异不影响 Chinchilla 主结论。

## 可用于正式技术笔记的结论

1. Chinchilla 研究的是固定预训练计算量下参数量与训练 token 的分配，不是单独寻找“最好的模型大小”。
2. 三种方法共同支持近似 $N_{\mathrm{opt}}\propto C^{0.5}$、$D_{\mathrm{opt}}\propto C^{0.5}$，但预测的具体最优点并不完全相同。
3. 联合损失函数把损失拆成不可约项、容量项和数据项；在 $C\approx6ND$ 约束下，两项的幂律指数解析地决定预算分配指数。
4. Gopher 预算下的合理预测区间约为 40B-70B，而非唯一的 70B；Chinchilla 选择 70B/1.4T 是兼顾数据和工程效率的验证实验。
5. Chinchilla 以相近预训练 FLOPs 在大量任务上超过 280B Gopher，并因参数更少降低推理和微调成本，支持“许多早期大模型过大且训练不足”的判断。
6. 约 20 token/参数是论文实验域内的经验先验。真正训练新模型前，仍应使用本模型族、本数据和本优化设置的小规模 IsoFLOP 实验重新校准。
