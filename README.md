# 🎓 学生选课与成绩管理系统 (MPU Course Management System)
**COMP2116: Software Engineering - Final Project**

![Graphical Abstract](./abstract.png) 
> [cite_start]**项目摘要图说明**：这是一个集成了 Gemini AI 导师的现代化教务管理原型系统。[cite: 44]

---

## [cite_start]1. 软件目的 (Purpose of the Software) [cite: 45, 87]

### 软件定位与市场 (Target Market)
[cite_start]本项目旨在为澳门理工大学（MPU）学生提供一个直观、高效的教务选课门户，解决传统系统交互复杂的问题。 [cite: 48]

### 开发过程模型 (Development Process Applied)
[cite_start]我们采用了 **敏捷开发 (Agile Development)** 模型。 [cite: 46]

* [cite_start]**选择原因**：相比于传统的瀑布模型，敏捷开发允许我们进行快速迭代。考虑到本项目集成了实验性的 AI 功能（Gemini API），敏捷模型能让我们在开发过程中不断测试 UI 交互并优化 AI 提示词（Prompt），确保最终交付的软件符合用户预期。 [cite: 47]

---

## [cite_start]2. 软件开发计划 (Software development plan) [cite: 49, 88]

### 开发阶段 (Development Process)
### 开发阶段 (Development Process Iterations)
* **Sprint 1**: 需求分析与 UI 原型设计（使用 Tailwind CSS）。
* **Sprint 2**: 核心逻辑开发（选课校验、学分计算）。
* **Sprint 3**: AI 接口集成与功能测试。
* **Sprint 4 (New!)**: 开发安全身份验证模块 (Authentication Module)。通过 React State 管理拦截未登录用户，完成 Mock Login 界面设计，提升系统的商业可用性。

### [cite_start]团队成员与分工 (Members & Roles) [cite: 51]
| 成员姓名 | 学号 | 职责描述 | 贡献占比 |
| :--- | :--- | :--- | :--- |
| [徐锐] | [p2421552] | 项目经理、前端开发、AI 功能集成 | 35% |
| [孙东昊] | [p2421132] | 后端开发、数据库管理 | 35% |
| [徐政驰] | [p2421336] | 前端开发、UI 设计 | 10% |
| [王敬祺] | [p2421134] | 后端开发、数据库管理 | 10% |
| [张珺玮] | [p2421135] | 前端开发、UI 设计 | 10% |

### [cite_start]开发时间表 (Schedule) [cite: 52]
* 2026年4月14日：完成环境搭建与基础框架。
* 2026年4月16日：完成选课逻辑与样式美化。
* 2026年4月18日：完成 AI 导师集成与 GitHub 部署。

### [cite_start]核心算法 (Algorithm) [cite: 53]
系统采用 **“情境感知 AI 推荐算法”**。通过采集学生的专业背景、历史成绩和当前课程余量，将其封装为结构化数据，通过 API 调用 LLM 进行智能逻辑推理，生成个性化选课建议。

### 当前状态与未来计划 (Status & Future Plan)
* [cite_start]**当前状态**：处于 Pilot (原型) 阶段，核心功能已可演示。 [cite: 32, 54]
* [cite_start]**未来计划**：计划引入后端数据库（如 Firebase）实现数据持久化，并开发教师端管理界面。 [cite: 55]

---

## [cite_start]3. 开发与运行环境 (Environments) [cite: 61]

* [cite_start]**编程语言**：JavaScript (ES6+), HTML5, CSS3 [cite: 62]
* [cite_start]**框架与库**：React.js, Tailwind CSS (v3), Lucide-React [cite: 62]
* [cite_start]**运行要求**：需要 Node.js v18+ 环境，建议使用 Chrome 浏览器访问。 [cite: 62]

---

## [cite_start]4. 软件演示 (Demonstration) [cite: 60, 95]

[cite_start]📺 **演示视频链接**：[此处填入你的 YouTube 或其他视频网址] [cite: 60]

---

## [cite_start]5. 开源声明 (Declaration) [cite: 63]

[cite_start]本项目基于 React 和 Vite 构建，使用了开源库 Tailwind CSS 和 Lucide-React。AI 功能由 Google Gemini API 提供支持。所有业务逻辑代码由本项目组原创开发。 [cite: 64]