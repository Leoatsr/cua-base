# Wave 4.A · MapsPage 像素古籍风世界地图

UI 重构第 4 波 · 第 1 步 — **世界地图独立页面（大地图 + minimap + 4 location）**

---

## 这一波做了什么

✅ MapsPage.tsx · 像素古籍风世界地图
- 顶栏 · 跟 Manual / Codex 风格统一
- 大地图（左侧 · SVG · 像素风 · 装饰山+树+路径）
- 详情面板（右上 · location 详情 + 设施 chip + 进入按钮）
- Minimap（右中 · 缩略全景 · 同步选中状态）
- 图例（右下 · 已开放 vs 敬请期待）
- 4 location · 萌芽镇 / 共创之都 / 议政高地 / 大集会广场（敬请期待）
- 单击选中 + 双击进入
- ESC 返回首页

✅ 文件清单
```
🆕 src/pages/MapsPage.tsx       (~600 行 · SVG 大地图 + minimap + 详情)
🆕 src/lib/mapsData.ts          (4 location 数据)
```

---

## ⚠️ Wave 4.A 范围（vs Wave 4.B）

✅ **本波包含**：
- 大地图视觉
- minimap 缩略图
- location 选中/hover 高亮
- 进入按钮 → `navigate('/play?scene=Main')` 跳转 + query string

⏳ **本波不含**（留给 Wave 4.B · 2-3h）：
- /play 路由解析 query string
- Phaser 加载完后自动 emit 'switch-scene'
- loading state · scene unavailable 边界处理

⚠️ **影响**：本波装上后 · 点击"进入" 会跳到 `/play?scene=SproutCity` · 但 Phaser **不会自动切到共创之都** · 仍然在默认场景。Wave 4.B 实现后才能真正自动切场景。

---

## 安装

```powershell
cd D:\projects\cua-base

$zip = "C:\Users\ghani\Downloads\cua-spike-wave4a.zip"
Test-Path $zip

tar -xf $zip
Copy-Item -Path .\cua-spike-wave4a\* -Destination . -Recurse -Force
Remove-Item -Path .\cua-spike-wave4a -Recurse -Force

# 验证
Test-Path src\pages\MapsPage.tsx
Test-Path src\lib\mapsData.ts
```

期望 2 个 `True`。

---

## ⚠️ 必须改 App.tsx · 把 MapsPage import 拆出来

跟 Wave 3.A / 3.B 同样套路：

```powershell
cd D:\projects\cua-base

Copy-Item src\App.tsx D:\projects\backup-cua\App.tsx.before-wave4a -ErrorAction SilentlyContinue

$content = [System.IO.File]::ReadAllText("$PWD\src\App.tsx", [System.Text.UTF8Encoding]::new($false))

# 旧 import:
# import { MapsPage } from './pages/ComingSoon';
# 新 import:
# import { MapsPage } from './pages/MapsPage';

$old = "import { MapsPage } from './pages/ComingSoon';"
$new = "import { MapsPage } from './pages/MapsPage';"
$content = $content.Replace($old, $new)

[System.IO.File]::WriteAllText("$PWD\src\App.tsx", $content, [System.Text.UTF8Encoding]::new($false))

# 验证
Write-Host "=== 修改后 imports ==="
Select-String -Path src\App.tsx -Pattern "ManualPage|CodexPage|MapsPage" | Format-Table LineNumber, Line -Wrap
```

期望看到：
```
LineNumber  Line
----------  ----
        66  import { ManualPage } from './pages/ManualPage';
        67  import { CodexPage } from './pages/CodexPage';
        68  import { MapsPage } from './pages/MapsPage';
       312  <Route path="/manual" element={<ManualPage />} />
       313  <Route path="/codex" element={<CodexPage />} />
       314  <Route path="/maps" element={<MapsPage />} />
```

⚠️ **如果 ComingSoon.tsx 不再被任何地方 import** · 可以保留（未来其他占位用） · 也可以删（看你）。

---

## 跑

```powershell
pnpm dev
```

打开 `http://localhost:5173/maps` · 浏览器**硬刷新** Ctrl+Shift+R

---

## 测试清单

```
☐ 1. 顶栏 · 返回首页 + 世界地图标题 + 手册/图鉴/进入游戏链接
☐ 2. 左侧大地图 · 看到主大陆 + 4 location 标记
☐ 3. 大地图装饰：3 座山（右上）+ 7 棵树 + 虚线路径
☐ 4. 4 location 像素圆点：
       萌芽镇 🌱（左下 · 绿色 chip）
       共创之都 🏛（中央 · 金色 chip）
       议政高地 ⚖（右上 · 玉色 chip）
       大集会广场 🎪（中下 · 灰色 · 敬请期待）
☐ 5. 单击 location · 详情面板更新（默认萌芽镇）
☐ 6. 双击可用 location · 跳转 /play?scene=XXX
☐ 7. 双击大集会广场 · 不跳转（available=false）
☐ 8. Hover location · 大地图 + minimap 同步显示金色脉动圈
☐ 9. 详情面板 · 图标 + 名字 + 区域 chip + 长描述 + 设施 chip + 进入按钮
☐ 10. 大集会广场详情 · 显示"此区域暂未开放" 而非进入按钮
☐ 11. Minimap · 缩略全景 + 4 location 小点
☐ 12. 点 minimap location · 大地图同步选中
☐ 13. 图例 · 已开放（金色）vs 敬请期待（灰色）
☐ 14. ESC · 返回首页
☐ 15. 大地图右下提示："点击选中 · 双击进入"
```

---

## ⚠️ 已知限制（留给 Wave 4.B）

- ⚠️ **进入按钮跳转 /play?scene=Main** · 但当前 /play 不解析 query · 仍进默认场景
- ⚠️ **大集会广场** 显示在地图但 available=false · 双击无效（设计如此）
- ⚠️ **minimap 不可拖动** · 仅可点击 location · 不支持视口拖动
- ⚠️ **大地图不支持缩放** · 固定 viewBox 16:10

---

## ⚠️ 紧急回滚

```powershell
Copy-Item D:\projects\backup-cua\App.tsx.before-wave4a src\App.tsx
Remove-Item src\pages\MapsPage.tsx -Force
Remove-Item src\lib\mapsData.ts -Force
```

---

## Push

```powershell
git add .
git commit -m "Wave 4.A: MapsPage pixel rewrite

MapsPage (~600 lines):
- SVG big map: pixelated landmass + grid + decor (mountains + trees + path lines)
- 4 location markers: sproutown / sproutcity / govhill / dasaiji
- Minimap (sticky right): synced hover + selection
- Details panel: highlights chips + 'enter' button
- Click to select / double-click to enter
- ESC returns to landing
- Top bar consistent with Manual / Codex

mapsData.ts: 4 LOCATIONS data (id, region, longDesc, highlights, sceneKey, etc)

App.tsx: import MapsPage from ./pages/MapsPage (no longer ComingSoon stub)

Wave 4.B (next, 2-3h):
- /play route parses ?scene= query string
- Phaser auto switches to scene after load
- Edge cases: loading state, unavailable scene"

git push
```

---

## 下一步

回我**一个**：

- **"全好 · push + 进 Wave 4.B"** = 实现 query string 跨路由切 scene · 2-3h
- **"全好 · push + 暂停找用户测"** ✅ 强推
- **"X 有问题"** + 描述
