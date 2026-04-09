# HKSTP

Static landing page prototype (Mountex / HKSTP Unified Portal).

仓库：<https://github.com/ViviY333/HKSTP>

## GitHub Pages 在线预览

开启 Pages 后（见下方「首次部署」），站点地址一般为：

**<https://viviy333.github.io/HKSTP/>**

根路径会跳转到 `mountex-hkstp-landing.html`。

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
| `applied.html` | 申请流程页（落地页 **Apply** / **APPLY NOW** 跳转至此） |
| `mountex-hkstp-apply*.css` / `mountex-hkstp-apply*.js` | 申请页样式与交互 |
| `logo.png` | 页头/页脚 Logo |
| `unicornstudio_hero_remix.json` | Unicorn Studio 工程（与 HTML 内嵌同步维护时可更新） |

设计参考：[Figma — Mountex](https://www.figma.com/design/Ts9muxMGlZa56IlqTrVfQ8/Mountex?node-id=439-12139)

## 首次部署 GitHub Pages

先推送本仓库到 GitHub，再任选一种方式：

### 方式 A：从分支发布（最简单）

1. **Settings → Pages**。  
2. **Build and deployment** → Source：**Deploy from a branch**。  
3. Branch：**`main`**，文件夹：**`/ (root)`**，保存。  
4. 约 1～2 分钟后访问：<https://viviy333.github.io/HKSTP/>

### 方式 B：GitHub Actions（已含工作流）

1. **Settings → Pages**。  
2. Source 选 **GitHub Actions**。  
3. 保存后，对 `main` 的每次 push 会由 `.github/workflows/pages.yml` 自动部署（也可在 **Actions** 里手动 **Run workflow**）。
