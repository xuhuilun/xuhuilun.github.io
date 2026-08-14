# 重新生成思源黑体子集（public/fonts/source-han-sans.woff2）并同步 globals.css 的 unicode-range
# 用法: pwsh scripts/subset-font.ps1
# 依赖: Python + fonttools[woff]（pip install "fonttools[woff]"）
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$cache = Join-Path $root 'fonts-tmp'
$otf = Join-Path $cache 'SourceHanSansCN-VF.otf'
$out = Join-Path $root 'public\fonts\source-han-sans.woff2'
$otfUrl = 'https://github.com/adobe-fonts/source-han-sans/raw/release/Variable/OTF/Subset/SourceHanSansCN-VF.otf'

# 1. 下载思源黑体可变字体（缓存，不提交到仓库）
New-Item -ItemType Directory -Path $cache -Force | Out-Null
if (-not (Test-Path $otf)) {
  Write-Host '[subset-font] 下载 SourceHanSansCN-VF.otf ...'
  Invoke-WebRequest -Uri $otfUrl -OutFile $otf -UseBasicParsing -TimeoutSec 300
}

# 2. 提取站点用到的全部字符 + 常用标点/符号安全垫
$enc = [System.Text.Encoding]::UTF8
$all = New-Object System.Text.StringBuilder
foreach ($dir in @('content', 'app', 'components', 'lib', 'styles')) {
  Get-ChildItem (Join-Path $root $dir) -Recurse -File -Include *.mdx, *.tsx, *.ts, *.css -ErrorAction SilentlyContinue |
    ForEach-Object { [void]$all.Append([System.IO.File]::ReadAllText($_.FullName, $enc)) }
}
$set = New-Object 'System.Collections.Generic.HashSet[char]'
foreach ($ch in $all.ToString().ToCharArray()) { [void]$set.Add($ch) }
$extra = '，。、；：？！～·—…《》〈〉【】「」『』〔〕（）￥％＃＠＆＊＋－＝×÷≤≥≠±∞°①②③④⑤⑥⑦⑧⑨⑩✓✗★☆→←↑↓⇒⇐∝∑∏∫√∈⊂⊆∪∩∅∀∃∼≈≡'
foreach ($ch in $extra.ToCharArray()) { [void]$set.Add($ch) }
for ($i = 0xFF01; $i -le 0xFF5E; $i++) { [void]$set.Add([char]$i) }
$text = (($set | Sort-Object) -join '')
$charsFile = Join-Path $cache 'chars-padded.txt'
[System.IO.File]::WriteAllText($charsFile, $text, $enc)
Write-Host "[subset-font] 子集字符数: $($text.Length)"

# 3. 子集化 -> woff2 可变字体
python -m fontTools.subset $otf --text-file=$charsFile --flavor=woff2 --output-file=$out
Write-Host "[subset-font] woff2 大小: $([math]::Round((Get-Item $out).Length / 1KB, 1)) KB"

# 4. 从子集 cmap 生成 unicode-range，并更新 globals.css 中第一个 @font-face 的声明
$ur = (python (Join-Path $PSScriptRoot 'gen-unicode-range.py') $out | Select-Object -Last 1).Trim()
if (-not $ur.StartsWith('U+')) { throw 'unicode-range 生成失败' }

$cssPath = Join-Path $root 'styles\globals.css'
$css = [System.IO.File]::ReadAllText($cssPath, $enc)
$newDecl = "unicode-range: $ur;"
$css = [regex]::Replace($css, 'unicode-range: [^;]+;', $newDecl, 1)
[System.IO.File]::WriteAllText($cssPath, $css, (New-Object System.Text.UTF8Encoding $false))
Write-Host "[subset-font] 已更新 globals.css 的 unicode-range"
