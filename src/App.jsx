import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  User, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Sparkles,
  Loader2
} from 'lucide-react';

// ----------------------------------------------------------------------
// 模拟数据 (Mock Data)
// ----------------------------------------------------------------------

// 初始可选课程库
const INITIAL_COURSES = [
  { id: 'COMP2116', name: '软件工程 (Software Engineering)', credits: 3, teacher: 'Dr. Kim', schedule: '周二 14:30-17:30', capacity: 40, enrolled: 38 },
  { id: 'COMP2011', name: '数据结构与算法', credits: 4, teacher: 'Dr. Wong', schedule: '周一 10:00-12:00', capacity: 50, enrolled: 50 }, // 已满
  { id: 'MATH1010', name: '离散数学', credits: 3, teacher: 'Dr. Chan', schedule: '周四 09:00-12:00', capacity: 60, enrolled: 45 },
  { id: 'LANG1002', name: '大学英语 II', credits: 2, teacher: 'Prof. Smith', schedule: '周三 14:00-16:00', capacity: 30, enrolled: 20 },
  { id: 'COMP3015', name: '数据库系统', credits: 3, teacher: 'Dr. Lei', schedule: '周五 10:00-13:00', capacity: 45, enrolled: 30 },
];

// 学生初始成绩数据
const INITIAL_GRADES = [
  { id: 'COMP1001', name: '计算机科学导论', credits: 3, score: 92, grade: 'A' },
  { id: 'MATH1001', name: '高等数学 I', credits: 4, score: 85, grade: 'B+' },
  { id: 'LANG1001', name: '大学英语 I', credits: 2, score: 78, grade: 'B-' },
];

// ----------------------------------------------------------------------
// 主应用程序组件
// ----------------------------------------------------------------------
export default function CourseManagementSystem() {
  // 状态管理
  const [activeTab, setActiveTab] = useState('dashboard'); // 当前激活的标签页
  const [availableCourses, setAvailableCourses] = useState(INITIAL_COURSES); // 可选课程
  const [myCourses, setMyCourses] = useState([]); // 当前学期已选课程
  const [notification, setNotification] = useState(null); // 系统通知提醒
  const [aiRecommendation, setAiRecommendation] = useState(''); // AI 推荐结果
  const [isAiLoading, setIsAiLoading] = useState(false); // AI 加载状态
  const [showAiModal, setShowAiModal] = useState(false); // 控制 AI 弹窗

  // 学生信息
  const studentInfo = {
    name: '张三 (Zhang San)',
    id: 'P2100000',
    major: '计算机科学 (Computing)',
    year: 'Year 2',
    maxCredits: 12 // 每学期最大选课学分
  };

  // 显示系统提示信息的辅助函数
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // AI 智能选课顾问逻辑 (Gemini API Integration)
  const generateAIRecommendation = async () => {
    setShowAiModal(true);
    setIsAiLoading(true);
    setAiRecommendation('');

    const apiKey = ""; // 运行时提供密钥
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // 构建提示词，融合学生的真实数据进行个性化推荐
    const prompt = `
      你是澳门理工大学 (MPU) 的资深学术导师。请根据以下学生信息，为他推荐本学期最应该选修的 1 到 2 门课程。
      【学生信息】
      姓名: ${studentInfo.name}
      专业: ${studentInfo.major}
      当前已获总学分: ${INITIAL_GRADES.reduce((sum, c) => sum + c.credits, 0)}
      【历史成绩】
      ${INITIAL_GRADES.map(g => `- ${g.name} (${g.credits}学分): ${g.score}分, 等第 ${g.grade}`).join('\n')}
      【当前可选课程库】
      ${availableCourses.filter(c => !myCourses.some(mc => mc.id === c.id)).map(c => `- ${c.name} (${c.id}, ${c.credits}学分, 余量: ${c.capacity - c.enrolled})`).join('\n')}

      要求：
      1. 语气友好、专业、充满鼓励。
      2. 结合他的专业背景（计算机科学）和之前的成绩优势（如数学、编程表现）进行分析。
      3. 推荐 1-2 门最合适的课程，并给出明确的推荐理由。
      4. 提醒他注意学分上限（最多 ${studentInfo.maxCredits} 学分）。
      5. 回复请使用中文排版清晰，不需要使用复杂的Markdown语法，仅使用纯文本换行即可。
    `;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: "你是一个专业的大学选课指导AI助手。" }] }
    };

    // 带有指数退避策略的请求处理
    const fetchWithRetry = async (url, options, retries = 5) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(url, options);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return await res.json();
        } catch (err) {
          if (i === retries - 1) throw err;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    };

    try {
      const result = await fetchWithRetry(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiRecommendation(text || "抱歉，AI 导师暂时无法提供建议，请稍后再试。");
    } catch (error) {
      console.error("Gemini API Error:", error);
      setAiRecommendation("请求失败，请检查网络或 API 配置后重试。");
    } finally {
      setIsAiLoading(false);
    }
  };

  // 选课逻辑
  const handleEnroll = (course) => {
    // 规则校验 1: 是否已选
    if (myCourses.some(c => c.id === course.id)) {
      showNotification('您已选择该课程！', 'error');
      return;
    }
    // 规则校验 2: 课程是否已满
    if (course.enrolled >= course.capacity) {
      showNotification('该课程选课人数已满！', 'error');
      return;
    }
    // 规则校验 3: 学分上限检查
    const currentCredits = myCourses.reduce((sum, c) => sum + c.credits, 0);
    if (currentCredits + course.credits > studentInfo.maxCredits) {
      showNotification(`选课失败！超过本学期最大限制 (${studentInfo.maxCredits} 学分)`, 'error');
      return;
    }

    // 更新状态
    setMyCourses([...myCourses, course]);
    setAvailableCourses(availableCourses.map(c => 
      c.id === course.id ? { ...c, enrolled: c.enrolled + 1 } : c
    ));
    showNotification(`成功选修 ${course.name}`);
  };

  // 退课逻辑
  const handleDrop = (courseId) => {
    const courseToDrop = myCourses.find(c => c.id === courseId);
    setMyCourses(myCourses.filter(c => c.id !== courseId));
    setAvailableCourses(availableCourses.map(c => 
      c.id === courseId ? { ...c, enrolled: c.enrolled - 1 } : c
    ));
    showNotification(`已退选 ${courseToDrop.name}`);
  };

  // 计算当前学期已选学分
  const currentTermCredits = useMemo(() => {
    return myCourses.reduce((sum, c) => sum + c.credits, 0);
  }, [myCourses]);

  // 计算历史总学分和 GPA (简化的 GPA 计算逻辑)
  const { totalCredits, gpa } = useMemo(() => {
    let earnedCredits = 0;
    let totalPoints = 0;
    
    INITIAL_GRADES.forEach(course => {
      earnedCredits += course.credits;
      // 简单绩点映射逻辑
      let point = 0;
      if (course.score >= 90) point = 4.0;
      else if (course.score >= 85) point = 3.5;
      else if (course.score >= 80) point = 3.0;
      else if (course.score >= 75) point = 2.5;
      else if (course.score >= 70) point = 2.0;
      else point = 1.0;
      
      totalPoints += point * course.credits;
    });

    return {
      totalCredits: earnedCredits,
      gpa: (totalPoints / earnedCredits).toFixed(2)
    };
  }, []);


  // --- 视图组件渲染 ---

  // 1. 仪表盘视图
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 border-emerald-200">欢迎回来, {studentInfo.name}</h2>
      
      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">当前平均绩点 (GPA)</p>
            <p className="text-2xl font-bold text-gray-800">{gpa}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">已获总学分</p>
            <p className="text-2xl font-bold text-gray-800">{totalCredits}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">本学期已选学分</p>
            <p className="text-2xl font-bold text-gray-800">{currentTermCredits} / {studentInfo.maxCredits}</p>
          </div>
        </div>
      </div>

      {/* 学生信息卡片 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">学籍信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="text-gray-500">学号:</span> <span className="font-medium">{studentInfo.id}</span></div>
          <div><span className="text-gray-500">年级:</span> <span className="font-medium">{studentInfo.year}</span></div>
          <div><span className="text-gray-500">专业:</span> <span className="font-medium">{studentInfo.major}</span></div>
          <div><span className="text-gray-500">学籍状态:</span> <span className="font-medium text-emerald-600">在读 (Active)</span></div>
        </div>
      </div>
    </div>
  );

  // 2. 选课中心视图
  const renderCourseSelection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b pb-2 border-emerald-200">
        <h2 className="text-2xl font-bold text-gray-800">2026年 秋季学期选课</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={generateAIRecommendation}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all transform hover:scale-105"
          >
            <Sparkles size={16} />
            <span>✨ 咨询 AI 学术导师</span>
          </button>
          <div className="text-sm text-gray-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            已选: <span className="font-bold text-emerald-600">{currentTermCredits}</span> / {studentInfo.maxCredits} 学分
          </div>
        </div>
      </div>

      {/* 我的课表 */}
      {myCourses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CheckCircle2 className="mr-2 text-emerald-500" size={20}/> 我的已选课程
          </h3>
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-emerald-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/50 text-emerald-800 border-b border-emerald-100">
                  <th className="p-4 font-semibold">课程代码</th>
                  <th className="p-4 font-semibold">课程名称</th>
                  <th className="p-4 font-semibold">学分</th>
                  <th className="p-4 font-semibold">上课时间</th>
                  <th className="p-4 font-semibold text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {myCourses.map(course => (
                  <tr key={`my-${course.id}`} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-700">{course.id}</td>
                    <td className="p-4">{course.name}</td>
                    <td className="p-4">{course.credits}</td>
                    <td className="p-4 text-sm text-gray-600">{course.schedule}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDrop(course.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors text-sm font-medium"
                      >
                        退选 (Drop)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 可选课程列表 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">全校可选课程</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map(course => {
            const isEnrolled = myCourses.some(c => c.id === course.id);
            const isFull = course.enrolled >= course.capacity;
            
            return (
              <div key={course.id} className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col ${isEnrolled ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'} transition-all`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-mono">{course.id}</span>
                  <span className="text-sm font-semibold text-emerald-600">{course.credits} 学分</span>
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-1">{course.name}</h4>
                <p className="text-sm text-gray-500 mb-4 flex-grow">👨‍🏫 {course.teacher} <br/> 🕒 {course.schedule}</p>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <span className={`text-xs ${isFull ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    余量: {course.capacity - course.enrolled} / {course.capacity}
                  </span>
                  
                  {isEnrolled ? (
                    <span className="text-emerald-500 font-medium text-sm flex items-center">
                      <CheckCircle2 size={16} className="mr-1" /> 已选
                    </span>
                  ) : isFull ? (
                    <span className="text-red-400 font-medium text-sm cursor-not-allowed">
                      已满
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleEnroll(course)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      选修
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 3. 成绩查询视图
  const renderGrades = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 border-emerald-200">历史成绩单</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="p-4 font-semibold">课程代码</th>
              <th className="p-4 font-semibold">课程名称</th>
              <th className="p-4 font-semibold text-center">学分</th>
              <th className="p-4 font-semibold text-center">最终得分</th>
              <th className="p-4 font-semibold text-center">等第 (Grade)</th>
            </tr>
          </thead>
          <tbody>
            {INITIAL_GRADES.map((grade, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors">
                <td className="p-4 font-medium text-gray-600">{grade.id}</td>
                <td className="p-4 text-gray-800">{grade.name}</td>
                <td className="p-4 text-center text-gray-600">{grade.credits}</td>
                <td className="p-4 text-center font-bold text-gray-700">{grade.score}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    grade.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                    grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {grade.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        * 注：此处仅显示已归档的正式成绩。本学期在修课程成绩将在期末考试后公布。
      </p>
    </div>
  );

  // 主渲染入口
  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      
      {/* 侧边导航栏 */}
      <aside className="w-64 bg-emerald-900 text-emerald-50 flex flex-col shadow-xl z-10">
        <div className="p-6 text-center border-b border-emerald-800">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
            {/* 模拟校徽或Logo */}
            <span className="text-emerald-900 font-black text-2xl">MPU</span>
          </div>
          <h1 className="font-bold text-lg tracking-wide">教务管理系统</h1>
          <p className="text-emerald-300 text-xs mt-1">Student Portal</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-700 text-white font-semibold shadow-md' : 'hover:bg-emerald-800 text-emerald-200'}`}
          >
            <LayoutDashboard size={20} />
            <span>仪表盘</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('courseSelection')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'courseSelection' ? 'bg-emerald-700 text-white font-semibold shadow-md' : 'hover:bg-emerald-800 text-emerald-200'}`}
          >
            <BookOpen size={20} />
            <span>选课中心</span>
          </button>

          <button 
            onClick={() => setActiveTab('grades')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'grades' ? 'bg-emerald-700 text-white font-semibold shadow-md' : 'hover:bg-emerald-800 text-emerald-200'}`}
          >
            <GraduationCap size={20} />
            <span>成绩查询</span>
          </button>
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-emerald-800 text-emerald-200 transition-all">
            <LogOut size={20} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* 顶部信息栏 */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-8 flex justify-between items-center z-10">
          <div className="text-gray-500 font-medium">
            2025-2026 学年 秋季学期
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">{studentInfo.name}</span>
            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </header>

        {/* 悬浮通知弹窗 (Toast Notification) */}
        {notification && (
          <div className={`absolute top-20 right-8 px-6 py-4 rounded-xl shadow-xl z-50 flex items-center animate-in slide-in-from-top-4 fade-in ${
            notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700' : 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800'
          }`}>
            {notification.type === 'error' ? <AlertCircle className="mr-3" size={20} /> : <CheckCircle2 className="mr-3" size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* 动态内容渲染 */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'courseSelection' && renderCourseSelection()}
            {activeTab === 'grades' && renderGrades()}
          </div>
        </div>

        {/* AI 推荐结果弹窗 */}
        {showAiModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold flex items-center">
                  <Sparkles className="mr-2" /> AI 学术导师建议
                </h3>
                <button onClick={() => setShowAiModal(false)} className="text-white/80 hover:text-white transition-colors">
                  <XCircle size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">AI 正在分析您的学术数据并生成个性化建议...</p>
                  </div>
                ) : (
                  <div className="prose prose-purple max-w-none text-gray-700 leading-relaxed">
                    {/* 简单的文本换行渲染 */}
                    {aiRecommendation.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 min-h-[1rem]">{line.replace(/\*\*/g, '')}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 bg-gray-50 border-t flex justify-end shrink-0">
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}