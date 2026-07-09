---
title: "让 feature-dev 与 planning-with-files 打出组合拳"
description: "记录 feature-dev 与 planning-with-files 的协作方式：用结构化开发流程配合文件化计划，解决 Agent 长任务中的上下文丢失和跨会话恢复问题。"
publishDate: "2026-07-09"
tags:
  - "AI"
  - "Claude Code"
  - "Coding Agent"
  - "效率工具"
---

> 适用场景：Java / Spring Boot 后端开发，使用 Claude Code 作为 Coding Agent。同样适用于其他语言栈的项目开发。

---

## 一个真实的问题

作为一名后端开发，你拿到一个新需求——比如「为 OA 系统新增一个请假审批流程」。你打开 Claude Code，准备让 Agent 帮你从需求分析一路写到代码审查。

但很快你会发现两个痛点：

1. **Agent 做到一半，上下文炸了。** Phase 2 探索了一堆文件，Phase 3 你回答了 5 个边界问题，结果会话太长，前面的关键信息被截断。Agent 开始「忘记」之前的决定。
2. **第二天回来，一切归零。** 昨天花了 2 小时让 Agent 理解了代码架构，今天打开新会话——Agent 完全不记得昨天干了什么。你得从头把需求、架构、决策再说一遍。

这两个问题的本质是一样的：**大模型的上下文窗口是易失性的，而功能开发是跨会话的持久化工作。**

---

## 两个技能，两个使命

Claude Code 有两个互补的技能（Skill/Plugin），恰好各自解决一半问题：

|                  | `feature-dev`                                               | `planning-with-files-zh`               |
| ---------------- | ----------------------------------------------------------- | -------------------------------------- |
| **定位**         | 执行引擎                                                    | 持久化大脑                             |
| **核心能力**     | 7 阶段结构化流程 + 并行 Agent 编排                          | 三大文件充当「磁盘记忆」+ 跨会话恢复   |
| **解决什么问题** | 「怎么做」——从需求到代码的完整流水线                        | 「怎么不忘记」——每个阶段的产物写入磁盘 |
| **持久性**       | ❌ 上下文丢失则状态全丢                                      | ✅ 写入文件，随时可恢复                 |
| **Agent 驱动**   | ✅ 3 个探索 Agent、3 个架构师 Agent、3 个审查 Agent 并行工作 | ❌ 无 Agent 编排能力                    |
| **错误管理**     | ❌ 无结构化错误追踪                                          | ✅ 专属错误表 + 三次失败协议            |


**一眼就能看出：它们天生就该一起用。** `feature-dev` 是引擎，`planning-with-files-zh` 是油箱。光有引擎跑不远，光有油箱动不了。

---

## 架构总览

```plain
┌──────────────────────────────────────────────────────────┐
│              planning-with-files-zh（持久层）            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ task_plan.md │  │ findings.md  │  │ progress.md  │   │
│  │ 计划+决策+错误│ │ 发现+审查结果│  │ 逐会话日志   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                  │           │
│         └─────────────────┼──────────────────┘           │
│                           │ 每个 Phase 落盘               │
│                           ▼                               │
│  ┌──────────────────────────────────────────────────┐    │
│  │        feature-dev（执行引擎）                    │   │
│  │  Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ ... ──▶ Phase 7 │
│  │  需求发现    代码探索    澄清问题              总结   │
│  │   ↓ 3个Agent并行探索    ↓ 3个架构师并行设计            │
│  │                          ↓ 3个审查员并行审查          │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## 各 Phase 协作明细

下面是一个完整功能开发周期中，两个技能在每个阶段的协作方式：

### Phase 1：需求发现（Discovery）

```plain
feature-dev 做的事：
  └── 理解需求，跟用户确认目标、约束条件、非功能性需求

planning-with-files-zh 做的事：
  └── 在 task_plan.md 中写入：
      - 需求一句话描述
      - 约束条件（性能/兼容性/安全）
      - 7 个 Phase 的 checklist（全部标记为 pending）
```

**写入 `task_plan.md` 示例：**

```markdown
# 任务：新增请假审批流程

## 目标
为 OA 系统新增「员工请假申请 → 部门经理审批 → 人事确认」的 BPMN 审批流程

## 约束
- 必须兼容现有 Camunda 流程引擎
- 审批节点通过 Kafka 消息驱动
- 遵循现有 workflow-worker → workflow-service 分层架构

## 阶段
| # | 阶段 | 状态 |
|---|------|------|
| 1 | 需求澄清 | complete |
| 2 | 代码探索 | pending |
| 3 | 澄清问题 | pending |
| ... | ... | ... |
```

### Phase 2：代码探索（Codebase Exploration）

```plain
feature-dev 做的事：
  └── 并行启动 3 个 code-explorer Agent：
      - Agent 1：找到相似功能（如已有的审批流程）并追踪实现
      - Agent 2：绘制当前架构分层和核心抽象
      - Agent 3：识别扩展点和可复用模式

planning-with-files-zh 做的事：
  └── 将 Agent 的发现写入 findings.md：
      - 相似功能清单 + 关键文件路径
      - 架构分层图
      - 可复用的抽象/接口/工具类
```

> ⚠️ **安全边界**：Agent 的输出内容只能写入 `findings.md`，不写入 `task_plan.md`。  
> 这是因为 `task_plan.md` 会被钩子反复注入上下文——如果混入了外部内容，可能被当作指令执行（间接提示注入）。

### Phase 3：澄清问题（Clarifying Questions）

```plain
feature-dev 做的事：
  └── 基于代码探索发现，列出所有模糊点：
      - "审批驳回后是回到申请人还是直接结束？"
      - "多人审批时是串签还是会签？"
      - "超时未审批怎么处理？"
  └── 等你回答后，把决策记下来

planning-with-files-zh 做的事：
  └── 将你的回答写入 task_plan.md 的「关键决策」区
```

### Phase 4：架构设计（Architecture Design）

```plain
feature-dev 做的事：
  └── 并行启动 3 个 code-architect Agent：
      - Agent A（最小改动派）：最大复用现有代码，改动最少
      - Agent B（清晰架构派）：抽象优雅，可维护性优先
      - Agent C（务实平衡派）：速度与质量折中
  └── 三份方案让你选择

planning-with-files-zh 做的事：
  └── 将三份方案的对比、你选择的方案及理由写入 task_plan.md
```

### Phase 5：编码实现（Implementation）

```plain
feature-dev 做的事：
  └── 按你批准的架构逐步实现：
      - 新增实体类 → Service → Controller
      - 注册 BPMN 节点类型
      - 配置 Kafka 消息路由
      - 编写单元测试

planning-with-files-zh 做的事：
  └── 每完成一个文件就写入 progress.md：
      - ✅ 新增 WorkflowNodeTypeEnum.LEAVE_APPROVAL
      - ✅ 新增 LeaveApprovalProcessService.java
      - ✅ 新增 LeaveApprovalController.java
      - ❌ 单元测试遇到 NPE → 记录到 task_plan.md 错误表
```

**`progress.md` 写法：**

```markdown
## 2026-07-09 会话

### 已完成
- [x] WorkflowNodeTypeEnum 新增 LEAVE_APPROVAL 枚举值
- [x] 新增 LeaveApprovalProcessService（继承 AbstractNodeProcessService）
- [x] NodeProcessService.java 新增路由分支
- [ ] 单元测试（遇到 NPE，待解决）

### 当前状态
- Phase 5 实现中，进度 60%
```

**`task_plan.md` 错误表写法：**

```markdown
## 错误记录
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| LeaveApprovalProcessService.getFormData() NPE | 1 | 排查中：疑似未注入 WorkflowDataOperateService |
```

### Phase 6：质量审查（Quality Review）

```plain
feature-dev 做的事：
  └── 并行启动 3 个 code-reviewer Agent：
      - Reviewer 1：简洁性 / DRY / 可读性
      - Reviewer 2：Bug / 逻辑错误 / 空指针风险
      - Reviewer 3：项目规范一致性

planning-with-files-zh 做的事：
  └── 审查发现写入 findings.md，修复后更新状态
```

### Phase 7：总结（Summary）

```plain
feature-dev 做的事：
  └── 汇总所有变更，标记完成

planning-with-files-zh 做的事：
  └── task_plan.md 全部阶段标记为 complete
  └── 写入总结：做了什么 / 关键决策 / 修改文件清单 / 后续建议
```

---

## 跨会话恢复：告别「第二天归零」

这是 `planning-with-files-zh` 最核心的价值。假设你在 Phase 5 编码实现了一半，下班了。

**第二天回来，你只需要：**

```bash
# 运行 session-catchup 脚本
python .claude/skills/planning-with-files-zh/scripts/session-catchup.py .
```

它会输出：

```plain
📋 上次会话：2026-07-09
📌 当前阶段：Phase 5 - 编码实现（进度 60%）
📝 已修改文件：
   - WorkflowNodeTypeEnum.java ✅
   - LeaveApprovalProcessService.java ✅
   - LeaveApprovalController.java ✅
⚠️ 待解决错误：
   - LeaveApprovalProcessService.getFormData() NPE
```

Agent 会基于这些信息**无缝接续**，不需要你重新描述半个字。

这就是「五问重启测试」——任何时候中断后恢复，你都能立刻回答：

| 问题           | 答案来源                  |
| -------------- | ------------------------- |
| 我在哪里？     | `task_plan.md` 的当前阶段 |
| 我要去哪里？   | 剩余未完成阶段            |
| 目标是什么？   | `task_plan.md` 的目标声明 |
| 我学到了什么？ | `findings.md`             |
| 我做了什么？   | `progress.md`             |


---

## 一键配置：让你的项目永久生效

核心思路：**把协作规则写进项目根目录的 `CLAUDE.md`**，Agent 每次进项目自动加载。

### 第一步：创建 `CLAUDE.md`

在项目根目录（如 `D:\Codes\office-app-flow\`）创建 `CLAUDE.md`：

```markdown
# office-app-flow 项目指南

办公业务流程管理系统（Spring Boot + Camunda BPMN + Kafka）。

## 技能协作规则：feature-dev + planning-with-files-zh

在开发需求时，本项目同时使用两个技能，必须配合使用：

- **`feature-dev:feature-dev`**：7 阶段功能开发流程引擎
- **`planning-with-files-zh`**：持久化文件规划系统

### 启动顺序

1. **先调用 `planning-with-files-zh`**，确保项目根目录存在三个规划文件
2. **再调用 `feature-dev:feature-dev`**，在各 Phase 中持续更新上述文件

### 各 Phase 写入规则

| feature-dev Phase | 写入目标 | 写入内容 |
|---|---|---|
| Phase 1: Discovery | `task_plan.md` | 需求描述、约束条件、阶段规划 |
| Phase 2: Exploration | `findings.md` | Agent 发现的架构模式、相似功能、关键文件清单 |
| Phase 3: Clarifying | `task_plan.md` | 用户对边界情况、异常处理等问题的决策回复 |
| Phase 4: Architecture | `task_plan.md` | 多方案对比、选择理由、实施文件清单 |
| Phase 5: Implementation | `progress.md` + `task_plan.md` | 每完成一个文件/类就记入 progress.md；错误记入 task_plan.md 错误表 |
| Phase 6: Review | `findings.md` | 审查发现的问题及修复状态 |
| Phase 7: Summary | `task_plan.md` | 标记全部阶段 complete，写入总结 |

### 强制规则

1. **安全边界**：Agent/网页/搜索等外部来源的内容**只写入 `findings.md`**，禁止写入 `task_plan.md`
2. **即时落盘**：每个 Phase 完成后**立即**更新对应文件
3. **错误必录**：遇到任何错误必须记录到 `task_plan.md` 错误表，三次失败后向用户求助
4. **恢复优先**：新会话开始时，先读取三个规划文件恢复上下文
5. **决策前重读**：做重大决策前，重新读取 `task_plan.md` 刷新目标
```

> 💡 `CLAUDE.md` 建议提交到 Git，这样团队其他使用 Claude Code 的同事也能共享这套规则。

### 第二步：创建 `.claude/settings.json`

在项目根目录创建 `.claude/settings.json`：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if [ -f \"$CLAUDE_PROJECT_DIR/task_plan.md\" ]; then echo '[planning-with-files] ACTIVE PLAN'; cat \"$CLAUDE_PROJECT_DIR/task_plan.md\" 2>/dev/null || true; fi"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "if [ -f \"$CLAUDE_PROJECT_DIR/progress.md\" ]; then echo '[planning-with-files] Consider updating progress.md'; fi"
          }
        ]
      }
    ]
  }
}
```

钩子的作用：

| 钩子          | 触发时机                 | 效果                                                         |
| ------------- | ------------------------ | ------------------------------------------------------------ |
| `PreToolUse`  | Edit / Write / Bash 之前 | 将 `task_plan.md` 当前内容注入上下文，Agent 始终知道当前计划 |
| `PostToolUse` | Edit / Write 之后        | 提醒 Agent 更新 `progress.md`                                |


> 💡 `.claude/` 目录建议加入 `.gitignore`，因为可能包含个人偏好。

---

## 完整工作流演示

假设你在一个新项目中使用这套配置，对话大概是这样的：

```plain
👤 你：帮我新增一个请假审批功能

🤖 Agent：
   📖 读取 CLAUDE.md → 知道要 combine 两个 skill
  
   [planning-with-files-zh] 初始化：
   ✅ 创建 task_plan.md
   ✅ 创建 findings.md
   ✅ 创建 progress.md
  
   [feature-dev Phase 1] 需求发现：
   "我理解你需要新增一个审批流程。请确认：
   1. 流程节点：申请 → 经理审批 → 人事确认？
   2. 是否需要支持驳回和撤回？
   3. 审批人是由前端指定还是后端规则匹配？"
  
   👤 你：节点是申请→经理审批→人事确认，支持驳回，审批人由前端指定
  
   🤖 Agent：
   ✅ 写入 task_plan.md（需求 + 约束）
   
   [feature-dev Phase 2] 代码探索：
   🚀 启动 Agent 1：查找已有的审批流程实现
   🚀 启动 Agent 2：分析 Camunda 流程引擎集成方式
   🚀 启动 Agent 3：分析 Kafka 消息路由和 Worker 调度
  
   三个 Agent 返回结果 →
   ✅ 写入 findings.md（6 个关键文件路径 + 3 个可复用模式）
   
   [feature-dev Phase 3] 澄清问题：
   "基于代码探索，我有几个问题：
   1. 驳回后流程回到申请人还是直接结束？
   2. 审批超时（如 48 小时未处理）怎么办？
   3. 是否需要审批历史记录表？"
  
   👤 你：驳回回到申请人修改重提；超时自动通过；需要历史记录
   
   🤖 Agent：
   ✅ 写入 task_plan.md 关键决策区
   
   [feature-dev Phase 4] 架构设计：
   🚀 启动 3 个架构师 Agent，给出 3 套方案……
   
   （展示方案给你，你选了务实平衡方案）
   
   ✅ 写入 task_plan.md
   
   [feature-dev Phase 5] 编码实现：
   正在实现 LeaveApprovalProcessService.java ...
   ✅ 写入 progress.md
   
   ❌ 遇到错误 → 写入 task_plan.md 错误表
   
   ...（继续直到完成）...
```

---

## 常见问题

### Q1：小需求（比如修一个 Bug）也要走完整 7 阶段吗？

不需要。小需求可以跳过 Phase 2（代码探索）和 Phase 4（多方案架构设计），直接从 Phase 1 → Phase 5 快速完成。但 `task_plan.md` 仍然要写——即使只有 5 行，也比零上下文强。

### Q2：CLAUDE.md 会不会很占上下文？

一份精心编写的 CLAUDE.md 通常在 50-80 行之间（约 1.5K tokens）。相比一个典型开发会话 100K+ tokens 的上下文窗口，占比不到 2%，但价值巨大——它相当于给 Agent 装了一个「标准作业程序」。

### Q3：planning-with-files-zh 的三个文件和 Git 的关系？

+ `task_plan.md` → **建议提交**。它是项目的「功能开发日志」，对团队有参考价值。
+ `findings.md` → 建议提交。记录架构理解和审查发现，是隐性知识显性化。
+ `progress.md` → 看团队偏好。如果你不想把每次会话的细节暴露给团队，可以 `.gitignore`。

### Q4：换项目 / 换开发环境了怎么办？

只需要做两件事：

1. 把上述 `CLAUDE.md` 模板复制到新项目根目录，根据项目技术栈微调
2. 把 `.claude/settings.json` 复制过去（或者用 `update-config` skill 配置）

两个 skill 本身是全局安装的（`feature-dev` 是插件、`planning-with-files-zh` 在 `~/.claude/skills/`），不需要重新安装。

---

## 总结

```plain
feature-dev（引擎）     +     planning-with-files-zh（大脑）
       │                              │
       │ 7 阶段流程                    │ 3 个 Markdown 文件
       │ 并行 Agent 编排               │ 跨会话持久化
       │ 多方案架构设计                │ 错误追踪 + 恢复
       │ 多角度质量审查                │ 安全边界隔离
       │                              │
       └──────────┬───────────────────┘
                  │
          CLAUDE.md（胶水层）
          告诉 Agent 怎么协作
                  │
                  ▼
         每次进项目自动生效
```

**总结：** `CLAUDE.md` 写规则，`planning-with-files-zh` 做硬盘，`feature-dev` 做引擎——三件事配置一次，永久受益。

---

_本文基于 Claude Code + feature-dev@claude-plugins-official + planning-with-files-zh v2.2.0 编写，配置示例适用于 Spring Boot 后端项目，但对前端、全栈、数据工程等项目同样适用。_

