# Favicon Implementation Plan

## 目标

按 `docs/favicon-design.md` 的已确认规范，将现有插画 favicon 替换为与首页一致的原生四色矩阵，同时保持所有现有引用路径不变。

## 实施步骤

### 1. 创建矢量母版

- 新增 `public/img/favicon.svg`。
- 使用 512x512 画布、32px 外边距、192px 色块、64px 间距和 54px 圆角。
- 校验 SVG 的坐标、颜色和独立性，不使用字体、滤镜或外链资源。

### 2. 生成位图资产

- 从同一几何参数生成 RGBA 母版。
- 替换 `favicon.png` 及 16、32、48、64、96、128、192、512px PNG。
- 替换 `favicon.ico`，内含 16、32、48px 三档。
- 不修改 `app/layout.tsx` 或旧静态 HTML，不增加项目依赖。

### 3. 资产验证

- 检查每个 PNG 的尺寸和 RGBA 模式。
- 检查透明背景与四种颜色的实际像素值。
- 检查 ICO 的内嵌尺寸集合。
- 检查仓库内所有 favicon 引用均有对应文件。
- 生成浅色和深色背景预览，检查 16、32、128px 表现。

### 4. 项目验证

- 运行 `npm run typecheck`。
- 运行 `npm run build`。
- 检查 Git 差异，确保没有无关修改或临时文件。

### 5. Git 交付

- 在 `feature/favicon-design` 提交并推送实现。
- 将功能分支合并到 `main`。
- 推送 `main`，删除已合并的本地和远端功能分支。

## 完成标准

- SVG、九个 PNG 和 ICO 均符合设计规格。
- 16px 预览中四个色块互相分离，浅色和深色背景均可辨认。
- 类型检查和生产构建通过。
- 实现已合并并推送到远端主分支。
