# CampusFit Quest

> 面向缺乏运动动力的大学生的游戏化激励工具——把运动从「靠自律」变成「有反馈、有陪伴、有目标感」的校园游戏体验。

纯前端 demo（React + Tailwind v4 + localStorage）。视觉走 **Varsity Athletic** 路线：oxblood / cream / jersey-yellow，Big Shoulders Display + Instrument Sans + JetBrains Mono，halftone 纸纹、varsity 戳章、宿舍门牌号、4 人徽章。

## 跑起来

```bash
npm install
npm run dev
```

打开 [http://localhost:5173](http://localhost:5173)。状态写入 `localStorage`，刷新不丢。

右下角有一个 `DEMO · ⚙` 浮动控制台：
- **01** 走完整 onboarding 流程（重置为新用户）
- **02** 重置为已激活的 demo 用户（默认状态）
- **03** 手动触发 "Lily 刚完成今日任务" 推送

## 5 个页面

| Tab | 解决什么 |
|---|---|
| Home | 今天打开干嘛 — 主任务 + Verify + 周进度 + 小队同步 |
| Quests | 今天还想多做点 — 5 类任务（Daily/Bonus/Social/Challenge/Comeback） |
| Squad | 跟谁一起 — 1–6 人弹性，宿舍徽章，击掌限定已完成成员 |
| Badges | 长期回看动力 — 个人 + 小队双线 |
| Ranks | 跟别人比 — XP / Most Improved / Squad 三榜分层，默认 Most Improved |

## 关键差异化交互

**Verify Workout** —— 任务**不是**一键 Complete，而是模拟 HealthKit 1.5 秒读取，显示真实步数和分钟。这是相对一般打卡 demo 最大的体感差异。一次校验通过会触发 5 处状态联动：Toast、Home 周进度条、任务卡 muted+✓、Squad 同步条、Badges/Ranks 红点。

## 5 个产品判断（V3 设计原则）

每个判断点在对应页面有 inline design note：

1. **Verify Workout 校验机制** — self-report 作弊成本为 0，加上 HealthKit 校验让游戏化系统站得住脚
2. **Comeback 改为零惩罚而非奖励徽章** — 修复 V1 的反向激励：理性用户不会再「故意中断换徽章」
3. **排行榜分三层（XP / Most Improved / Squad）** — 默认进 Most Improved 保护普通用户的第一印象
4. **小队 1–6 人弹性，单人完整可用** — 把社交从启动门槛改成升级体验
5. **Onboarding 砍到 3 步、≤90 秒** — 注册流失漏斗的硬约束

## 技术栈

- React 19 + Vite 8
- Tailwind CSS v4（CSS-first @theme，无 config 文件）
- motion (Framer Motion 继任) — 动效与过渡
- localStorage — 状态持久化（key `campusfit.v3.state`）
- 无后端，无路由库

```
src/
├── App.jsx              # Shell + 路由 + 推送时序
├── lib/
│   ├── seed.js          # 全部 mock 数据
│   └── store.jsx        # useReducer + localStorage + 业务规则
├── components/          # 12 个原子组件（Crest / Calendar21 / VerifyButton …）
└── pages/               # 5 个 Tab + Onboarding
```

## License

MIT.
