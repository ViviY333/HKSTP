# HKSTP

Static landing page prototype (Mountex / HKSTP Unified Portal).

## 本地预览

在仓库目录执行：

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

浏览器打开：<http://127.0.0.1:8765/mountex-hkstp-landing.html>

（若直接 `file://` 打开，Unicorn 背景依赖页内嵌 JSON；静态资源需与 HTML 同目录。）

## 文件

| 文件 | 说明 |
|------|------|
| `mountex-hkstp-landing.html` | 落地页 |
| `mountex-hkstp-landing.css` | 主样式 |
| `mountex-hkstp-landing-sections.css` | 区块与页脚等 |
| `mountex-hkstp-landing.js` | 交互与计划卡片 |
| `logo.png` | 页头/页脚 Logo |
| `unicornstudio_hero_remix.json` | Unicorn Studio 工程（与 HTML 内嵌同步维护时可更新） |

设计参考：[Figma — Mountex](https://www.figma.com/design/Ts9muxMGlZa56IlqTrVfQ8/Mountex?node-id=439-12139)
