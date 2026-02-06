
# 银河证券虚拟管理系统 (Galaxy Virtual Securities)

这是一个基于 Next.js 16 + TypeScript + Tailwind CSS 构建的高端、工业感虚拟证券管理系统。

## 核心特性

- **跨域行情镜像**: 模拟 A 股与港股实时行情同步，提供毫秒级数据看板。
- **全业务交易矩阵**:
  - **常规交易**: 模拟沪深京及港股通交易流程。
  - **新股申购 (IPO)**: 一键参与虚拟资产初始定价。
  - **大宗交易 (Block)**: 支持机构协议成交与折价定价。
  - **一键打板 (Flash Board)**: 毫秒级涨停板抢单引擎模拟。
- **审计与合规控制**:
  - **客户资金管理**: 完备的资金上下分审计流程。
  - **权限下发**: 支持 ADMIN, OPERATOR, CLIENT 三级权限体系。
- **工业感 UI/UX**:
  - 采用铝感金属材质设计。
  - 霓虹橙 (#FF4500) 核心强调色。
  - 完备的深色模式与网格背景。

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **状态管理**: 基于 MockDB 的轻量化持久逻辑
- **UI 组件**: Tailwind CSS + Lucide Icons + Recharts
- **数据库模拟**: 内存态 MongoDB 镜像实现

## 快速开始

该项目设计为轻量化、即插即用的虚拟环境。

1. **进入管理后台**: 默认通过 `/admin/dashboard` 访问。
2. **资金操作**: 在 `客户管理` 页面选择用户进行上分/下分操作。
3. **API 接入**: 使用 `可视化接入` 面板生成 API 密钥，以便第三方客户端对接。

---
*银河证券虚拟引擎 v3.1 - 由银河核心技术组提供支持*

---

## 部署到 Vercel（快速指南） ✅

1. 在 Vercel 控制台中新建项目并连接到 GitHub 仓库 `AthenDrakomin-hub/galaxy-securities-virtual-management-system`。
2. 在 **Environment Variables** 中设置：
   - `MONGODB_URI` = 你的 Atlas 连接字符串（示例在 `.env.production.example`）
   - `NEXTAUTH_SECRET` = 随机的 32+ 字节密钥
   - `NEXTAUTH_URL` = `https://<your-vercel-domain>`
   - `USE_REAL_DB` = `true`
3. 构建设置：使用默认的 **Framework Preset**（Next.js），构建命令 `npm run build`，输出目录留空（Next.js 自动处理）。
4. 部署后，检查构建日志；常见问题：
   - 若缺少页面导致构建失败，请确认所有 `app/` 下的 `page.tsx` 都已提交并位于仓库中。
   - 若需要初始化数据库，请运行 `node scripts/seed-atlas.js`（在本地或 CI 环境，须设置 `MONGODB_URI`）。

---
