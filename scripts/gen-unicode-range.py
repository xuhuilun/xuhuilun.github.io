"""从子集字体 cmap 生成 unicode-range 声明（供 scripts/subset-font.ps1 调用）"""
import sys

from fontTools.ttLib import TTFont

if len(sys.argv) != 2:
    print("usage: python gen-unicode-range.py <font.woff2>", file=sys.stderr)
    sys.exit(1)

font = TTFont(sys.argv[1])
cps = sorted(font.getBestCmap().keys())

ranges = []
start = prev = cps[0]
for cp in cps[1:]:
    if cp == prev + 1:
        prev = cp
    else:
        ranges.append((start, prev))
        start = prev = cp
ranges.append((start, prev))

parts = ["U+%04X" % a if a == b else "U+%04X-%04X" % (a, b) for a, b in ranges]
print(",".join(parts))
