# 🎓 MPU Course Management System
**COMP2116: Software Engineering - Final Project**

![Graphical Abstract](./abstract.png) 
> [cite_start]**Graphical Abstract Description**: A modern academic management system prototype integrated with a Gemini AI advisor. [cite: 43, 44]

---

## [cite_start]1. Purpose of the Software [cite: 45, 87]

### Target Market
[cite_start]This project aims to provide an intuitive and efficient course registration portal for students at Macao Polytechnic University (MPU), solving the complex interaction issues of traditional systems. [cite: 48]

### Development Process Applied
[cite_start]We adopted the **Agile Development** model. [cite: 46]

* **Reason for Selection**: Compared to the traditional Waterfall model, Agile development allows for rapid iterations. [cite_start]Considering this project integrates experimental AI features (Gemini API), the Agile model enables us to continuously test UI interactions and optimize AI prompts during development, ensuring the final delivered software meets user expectations. [cite: 47]

---

## [cite_start]2. Software Development Plan [cite: 49, 88]

### [cite_start]Development Process Iterations [cite: 50]
* **Sprint 1**: Requirement analysis and UI prototyping (using Tailwind CSS).
* **Sprint 2**: Core logic development (course registration validation, credit calculation).
* **Sprint 3**: AI API integration and functional testing.
* **Sprint 4 (New!)**: Developed a secure Authentication Module. Implemented mock login interface and route protection using React State to intercept unauthorized users, enhancing the system's commercial viability.

### [cite_start]Members & Roles [cite: 51]
| Name | Student ID | Roles & Responsibilities | Contribution Portion |
| :--- | :--- | :--- | :--- |
| Xu Rui | p2421552 | Project Manager, Front-end Developer, AI Feature Integration | 35% |
| Sun Donghao | p2421132 | Back-end Developer, Database Administration | 35% |
| Xu Zhengchi | p2421336 | Front-end Developer, UI Design | 10% |
| Wang Jingqi | p2421584 | Back-end Developer, Database Administration | 10% |
| Zhang Junwei | p2421135 | Front-end Developer, UI Design | 10% |

### [cite_start]Schedule [cite: 52]
* **April 14, 2026**: Completed environment setup and foundational framework.
* **April 16, 2026**: Completed course registration logic and styling.
* **April 18, 2026**: Completed AI advisor integration and GitHub deployment.

### [cite_start]Algorithm [cite: 53]
The system utilizes a **Context-Aware AI Recommendation Algorithm**. By collecting the student's major background, historical grades, and current course availability, it encapsulates these into structured data. It then calls the LLM via API for intelligent logical reasoning to generate personalized course recommendations.

### Current Status & Future Plan
* [cite_start]**Current Status**: At the Pilot stage; core functionalities are fully demonstrable. [cite: 32, 54]
* [cite_start]**Future Plan**: Plan to introduce a backend database (e.g., Firebase) for data persistence and develop a teacher administration interface. [cite: 55]

---

## [cite_start]3. Environments [cite: 61]

* [cite_start]**Programming Language**: JavaScript (ES6+), HTML5, CSS3 [cite: 62]
* [cite_start]**Frameworks & Libraries**: React.js, Tailwind CSS (v3), Lucide-React [cite: 62]
* **Running Requirements**: Node.js v18+ environment required; [cite_start]Chrome browser recommended. [cite: 62]

---

## [cite_start]4. Demonstration [cite: 60, 95]

[cite_start]📺 **Demo Video URL**: [Insert your YouTube or other video URL here] [cite: 60]

---

## [cite_start]5. Declaration [cite: 63]

This project is built with React and Vite, utilizing open-source libraries such as Tailwind CSS and Lucide-React. AI features are powered by the Google Gemini API. [cite_start]All business logic codes are originally developed by our project team. [cite: 64]