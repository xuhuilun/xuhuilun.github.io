export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">关于作者</h1>
      <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
        我是 Lun XuHui，专注大模型、Transformer、LoRA、RLHF 与算法工程的技术博主。这个博客面向 AI 学习者与工程师，目标是构建可持续的论文笔记与实践知识库。
      </p>
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">写作方向</h2>
        <ul className="mt-5 space-y-3 text-slate-600 dark:text-slate-300">
          <li>• Transformer 架构与注意力机制</li>
          <li>• LoRA / RLHF / DPO / MLOps 实践</li>
          <li>• AI 论文读书笔记与复现实验</li>
          <li>• 知识库构建与长期学习路线</li>
        </ul>
      </div>
    </main>
  );
}
