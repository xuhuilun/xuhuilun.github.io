## Transformer 是什么

像 GPT、BERT 这类模型，本质上都需要从海量文本中学习语言规律。模型要学会哪些词经常一起出现，一个词在不同上下文中是什么意思，一句话内部有哪些依赖关系，以及上文如何影响下一个词。

Transformer 的注意力机制正好适合做这件事。它可以让每个位置直接关注其他位置，而不是只依赖局部信息。这也是为什么 Transformer 后来不只用于翻译，还广泛用于文本生成、问答、代码生成、图像理解和多模态模型。

<a id="self-attention"></a>
## Self-Attention：让每个词重新理解自己

Self-Attention，中文常叫“自注意力”。名字有点抽象，但意思很直白：句子里的每个词，都去看看句子里的其他词，然后决定“我应该重点参考谁”。

```text
小明把书放进书包，因为它很重。
```

这里的“它”指什么？大概率是“书”，不是“书包”。对人来说，这件事很自然。对模型来说，它需要计算“它”和其他词之间的关系。

可以把 Self-Attention 想成一场会议：每个词都是一个参会者，每个参会者都会听其他人的发言，谁的信息更重要，就多听谁一点。最后每个词都更新自己的理解。

所以 Self-Attention 的输出不是简单地复制原句，而是生成一组“带上下文理解的新表示”。

<a id="qkv"></a>
## Q、K、V：注意力机制的三个角色

Transformer 里最容易把新手劝退的三个字母就是 Q、K、V。它们分别是 Query、Key、Value。

我们可以用“查资料”来理解。假设你在图书馆找一本关于“深度学习入门”的书：Q 是你的问题，K 是每本书的标签，V 是书的实际内容。

注意力机制的过程大概是：拿 Q 去和所有 K 做匹配；匹配度越高，说明越相关；根据匹配度，从对应的 V 里取信息；最后把取到的信息加权合成新的表示。

简单记法是：Q 表示“我想知道什么”，K 表示“我能提供什么线索”，V 表示“我真正携带的信息”。

<a id="attention-formula"></a>
## 一个核心公式：Scaled Dot-Product Attention

Transformer 论文里最核心的公式是：

```text
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V
```

`QK^T` 的作用是计算 Query 和 Key 的匹配程度。你可以理解成：当前 token 的问题，和其他 token 的线索，到底有多匹配？匹配程度越高，说明越应该关注。

`d_k` 是 Key 向量的维度。当向量维度比较大时，点积结果可能变得很大。结果太大，经过 softmax 后容易让分布变得特别尖锐：一个位置权重接近 1，其他位置接近 0。这样模型训练会不稳定。

所以要除以 `sqrt(d_k)`，把数值缩放到更合适的范围。面试里经常问这个点，标准回答可以是：为了避免点积结果随维度增大而过大，导致 softmax 分布过尖、梯度不稳定，所以使用 `sqrt(d_k)` 做缩放。

softmax 的作用是把一堆相关性分数变成概率分布。最后乘以 V，就是“从被关注的对象那里取信息”。整个公式翻译成人话就是：先算我和其他位置有多相关，再把相关性变成权重，最后按权重汇总其他位置的信息。

<a id="multi-head"></a>
## Multi-Head Attention：从多个角度看一句话

如果只有一个注意力头，模型只能用一种方式理解句子。但一句话里的关系往往不止一种。

```text
我 昨天 在 北京 买 了 一 台 新 手机
```

模型可能需要同时关注时间关系、地点关系、动作关系、对象关系和修饰关系。Multi-Head Attention 的意思就是：不要只用一个观察角度，而是用多个注意力头并行观察。

每个 head 都有自己的一组 Q、K、V 投影，可以学习不同类型的关系。最后把多个 head 的结果拼接起来，再经过一次线性变换，得到最终输出。

生活化理解：一个人看电影，可能只注意剧情。多个人一起看，有人注意台词，有人注意镜头，有人注意配乐，有人注意人物关系。最后大家汇总观点，理解会更完整。

<a id="position"></a>
## 位置编码：模型怎么知道词的顺序？

注意力机制本身很擅长建模“谁和谁相关”，但它天然不知道顺序。

```text
我喜欢你
你喜欢我
```

这两句话的词差不多，但意思不一样。区别就在顺序。所以 Transformer 需要额外加入位置信息，这就是位置编码。

位置编码的作用是告诉模型：这个 token 在第几个位置，不同位置之间相隔多远，顺序变化会影响语义。

原始论文使用的是基于 sin 和 cos 的位置编码。你不需要一上来记复杂公式，只要先理解它的目的：Embedding 负责表示“这个词是什么”，位置编码负责表示“这个词在哪里”。

```text
输入表示 = Token Embedding + Positional Encoding
```

<a id="encoder-decoder"></a>
## Encoder 和 Decoder 各自干什么？

原始 Transformer 是 Encoder-Decoder 架构，常用于机器翻译这类“输入一段序列，输出另一段序列”的任务。

```text
输入：I love machine learning.
输出：我喜欢机器学习。
```

Encoder 的任务是读懂输入序列。它会经过多层结构，每层通常包含 Multi-Head Self-Attention、Feed Forward Network、Residual Connection 和 Layer Normalization。你可以把 Encoder 理解成“阅读理解模块”：它不急着生成答案，而是先把输入内容充分理解好。

Decoder 的任务是一步步生成目标序列。它和 Encoder 类似，但多了一些特殊设计：Masked Self-Attention、Encoder-Decoder Attention 和 Feed Forward Network。

Masked Self-Attention 的作用是防止模型在生成时偷看未来。比如模型正在生成第 3 个词，它只能看前面已经生成的第 1、第 2 个词，不能提前看到第 4 个词。Encoder-Decoder Attention 的作用是让 Decoder 在生成时参考 Encoder 理解出来的输入信息。

<a id="interview"></a>
## Transformer 和 GPT、BERT 的关系

Transformer 是一个基础架构，GPT 和 BERT 是在这个架构思想上发展出来的代表模型。

BERT 主要使用 Encoder-only 架构，更适合理解类任务，比如文本分类、情感分析、命名实体识别、句子匹配和阅读理解。因为 Encoder 可以双向看上下文，所以 BERT 很擅长理解一句话或一段话的整体含义。

GPT 主要使用 Decoder-only 架构，更适合生成类任务，比如文本续写、对话、摘要、代码生成和问答生成。GPT 的核心目标通常是根据前文预测下一个 token。它一次生成一点，不断把新生成的内容接回上下文里继续预测。

Encoder-Decoder 架构适合明确的序列转换任务，比如翻译、摘要和改写。简单记：Encoder-only 偏理解，Decoder-only 偏生成，Encoder-Decoder 偏转换。

## 面试高频问题整理

### Transformer 为什么适合并行计算？

因为注意力机制可以同时计算序列中各个位置之间的关系。在训练时，输入序列的多个 token 可以一起参与矩阵计算，非常适合 GPU/TPU 这类硬件。关键词是：矩阵计算、并行化、注意力权重、硬件友好。

### 为什么要除以 sqrt(d_k)？

因为 Q 和 K 的点积会随着维度增大而变大。如果不缩放，softmax 可能进入饱和区域，导致注意力分布过尖，训练不稳定。除以 `sqrt(d_k)` 可以控制数值范围，让 softmax 输出更平滑。

### Multi-head 的意义是什么？

Multi-head 让模型从多个角度理解序列关系。不同 head 可以关注不同模式，比如语义关系、语法关系、长距离依赖、局部搭配和指代关系。最后把多个 head 的信息融合起来，表达能力更强。

### 为什么需要位置编码？

因为注意力机制本身不直接包含顺序信息。如果没有位置编码，模型很难区分词相同但顺序不同的句子。位置编码给 token 加上位置信息，让模型知道每个 token 在序列中的位置。

### Self-Attention 和 Encoder-Decoder Attention 有什么区别？

Self-Attention 的 Q、K、V 来自同一个序列，也就是自己看自己内部。而 Encoder-Decoder Attention 中，Q 通常来自 Decoder，K 和 V 来自 Encoder，也就是输出端拿自己的查询，去输入端理解结果里找相关信息。

## 小结

Transformer 的关键不是公式有多复杂，而是它让序列中的每个位置都能直接建模与其他位置的关系。

Token Embedding 告诉模型“词是什么”，位置编码告诉模型“词在哪里”，Self-Attention 告诉模型“谁和谁有关”，Multi-Head Attention 让模型从多个角度看关系，Encoder 和 Decoder 则把理解与生成组织成完整架构。

## 参考资料

- Vaswani, A. et al. Attention Is All You Need: https://arxiv.org/abs/1706.03762
- NeurIPS 2017 论文页面: https://papers.nips.cc/paper/7181-attention-is-all-you-need
- NeurIPS 论文 PDF: https://papers.neurips.cc/paper/7181-attention-is-all-you-need.pdf
