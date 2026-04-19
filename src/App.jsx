import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Calendar,
  Info,
  XCircle
} from 'lucide-react';

// ----------------------------------------------------------------------
// 模拟数据 (Mock Data) - 增加了课程详情描述
// ----------------------------------------------------------------------
const INITIAL_COURSES = [
  { id: 'COMP2116', name: '软件工程', credits: 3, teacher: 'Dr. Kim', day: '周二', time: '14:30-17:30', capacity: 40, enrolled: 38, type: '专业必修 (Major Core)', preReq: 'COMP1001 计算机科学导论', description: '本课程重点介绍软件开发的生命周期、敏捷开发模型(Agile)、UML系统建模以及软件测试原则。学生将以小组形式完成一个完整的全栈项目原型。' },
  { id: 'COMP2011', name: '数据结构与算法', credits: 4, teacher: 'Dr. Wong', day: '周一', time: '10:00-12:00', capacity: 50, enrolled: 50, type: '专业必修 (Major Core)', preReq: 'COMP1001 计算机科学导论', description: '深入研究各种数据结构（如树、图、哈希表）以及基础算法设计（贪心、动态规划、分治法），强调时空复杂度分析。' },
  { id: 'MATH1010', name: '离散数学', credits: 3, teacher: 'Dr. Chan', day: '周四', time: '09:00-12:00', capacity: 60, enrolled: 45, type: '通识必修 (General Core)', preReq: '无 (None)', description: '涵盖集合论、图论、逻辑推理和组合数学，为计算机科学的算法设计提供坚实的数学基础支撑。' },
  { id: 'LANG1002', name: '大学英语 II', credits: 2, teacher: 'Prof. Smith', day: '周三', time: '14:00-16:00', capacity: 30, enrolled: 20, type: '语言选修 (Language Elective)', preReq: 'LANG1001 大学英语 I', description: '提升学术英语阅读与写作能力，重点训练科技论文的文献综述与专业术语表达。' },
  { id: 'COMP3015', name: '数据库系统', credits: 3, teacher: 'Dr. Lei', day: '周五', time: '10:00-13:00', capacity: 45, enrolled: 30, type: '专业选修 (Major Elective)', preReq: 'COMP2011 数据结构', description: '学习关系型数据库原理，掌握 SQL 语言高级查询、事务处理机制(ACID)以及数据库规范化设计。' },
];

const INITIAL_GRADES = [
  { id: 'COMP1001', name: '计算机科学导论', credits: 3, score: 92, grade: 'A' },
  { id: 'MATH1001', name: '高等数学 I', credits: 4, score: 85, grade: 'B+' },
  { id: 'LANG1001', name: '大学英语 I', credits: 2, score: 78, grade: 'B-' },
];

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五'];

// ----------------------------------------------------------------------
// 主应用程序组件
// ----------------------------------------------------------------------
export default function CourseManagementSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [availableCourses, setAvailableCourses] = useState(INITIAL_COURSES); 
  const [myCourses, setMyCourses] = useState([]); 
  const [notification, setNotification] = useState(null); 
  const [selectedCourseInfo, setSelectedCourseInfo] = useState(null); // 课程详情弹窗状态

  const studentInfo = {
    name: '张三 (Zhang San)',
    id: 'P2100000',
    major: '计算机科学 (Computing)',
    year: 'Year 2',
    maxCredits: 12 
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'P2100000' && loginForm.password === '123456') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('学号或密码错误！请使用测试账号登录。');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
    setActiveTab('dashboard');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEnroll = (course) => {
    if (myCourses.some(c => c.id === course.id)) return showNotification('您已选择该课程！', 'error');
    if (course.enrolled >= course.capacity) return showNotification('该课程选课人数已满！', 'error');
    
    const currentCredits = myCourses.reduce((sum, c) => sum + c.credits, 0);
    if (currentCredits + course.credits > studentInfo.maxCredits) {
      return showNotification(`选课失败！超过本学期最大限制 (${studentInfo.maxCredits} 学分)`, 'error');
    }

    setMyCourses([...myCourses, course]);
    setAvailableCourses(availableCourses.map(c => 
      c.id === course.id ? { ...c, enrolled: c.enrolled + 1 } : c
    ));
    showNotification(`成功选修 ${course.name}`);
    setSelectedCourseInfo(null); // 选课后自动关闭详情弹窗
  };

  const handleDrop = (courseId) => {
    const courseToDrop = myCourses.find(c => c.id === courseId);
    setMyCourses(myCourses.filter(c => c.id !== courseId));
    setAvailableCourses(availableCourses.map(c => 
      c.id === courseId ? { ...c, enrolled: c.enrolled - 1 } : c
    ));
    showNotification(`已退选 ${courseToDrop.name}`);
  };

  const currentTermCredits = useMemo(() => myCourses.reduce((sum, c) => sum + c.credits, 0), [myCourses]);
  
  const { totalCredits, gpa } = useMemo(() => {
    let earnedCredits = 0;
    let totalPoints = 0;
    INITIAL_GRADES.forEach(course => {
      earnedCredits += course.credits;
      let point = course.score >= 90 ? 4.0 : course.score >= 85 ? 3.5 : course.score >= 80 ? 3.0 : course.score >= 75 ? 2.5 : course.score >= 70 ? 2.0 : 1.0;
      totalPoints += point * course.credits;
    });
    return { totalCredits: earnedCredits, gpa: (totalPoints / earnedCredits).toFixed(2) };
  }, []);

  // 0. 登录页面视图
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-emerald-800 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"><span className="text-emerald-900 font-black text-3xl">MPU</span></div>
            <h1 className="text-2xl font-bold text-white mb-2">教务管理系统</h1>
            <p className="text-emerald-200 text-sm">Student Portal Login</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center"><AlertCircle size={16} className="mr-2 shrink-0" />{loginError}</div>)}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">学号 (Student ID)</label>
                <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="text-gray-400" size={18} /></div>
                  <input type="text" required className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="请输入测试学号: P2100000" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">密码 (Password)</label>
                <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="text-gray-400" size={18} /></div>
                  <input type="password" required className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="请输入测试密码: 123456" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors">登 录 (Sign In)</button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500"><p>测试账号: P2100000 | 密码: 123456</p></div>
          </div>
        </div>
      </div>
    );
  }

  // 1. 仪表盘视图
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 border-emerald-200">欢迎回来, {studentInfo.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4"><div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><GraduationCap size={24} /></div><div><p className="text-sm text-gray-500">当前平均绩点 (GPA)</p><p className="text-2xl font-bold text-gray-800">{gpa}</p></div></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4"><div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><BookOpen size={24} /></div><div><p className="text-sm text-gray-500">已获总学分</p><p className="text-2xl font-bold text-gray-800">{totalCredits}</p></div></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4"><div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><LayoutDashboard size={24} /></div><div><p className="text-sm text-gray-500">本学期已选学分</p><p className="text-2xl font-bold text-gray-800">{currentTermCredits} / {studentInfo.maxCredits}</p></div></div>
      </div>
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

  // 2. 选课中心视图 (增加了详情按钮)
  const renderCourseSelection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b pb-2 border-emerald-200">
        <h2 className="text-2xl font-bold text-gray-800">2026年 秋季学期选课</h2>
        <div className="text-sm text-gray-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          已选: <span className="font-bold text-emerald-600">{currentTermCredits}</span> / {studentInfo.maxCredits} 学分
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">全校可选课程池</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map(course => {
            const isEnrolled = myCourses.some(c => c.id === course.id);
            const isFull = course.enrolled >= course.capacity;
            return (
              <div key={course.id} className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col ${isEnrolled ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'} transition-all`}>
                <div className="flex justify-between items-start mb-2"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-mono">{course.id}</span><span className="text-sm font-semibold text-emerald-600">{course.credits} 学分</span></div>
                <h4 className="font-bold text-lg text-gray-800 mb-1">{course.name}</h4>
                <p className="text-sm text-gray-500 mb-4 flex-grow">👨‍🏫 {course.teacher} <br/> 🕒 {course.day} {course.time}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <span className={`text-xs ${isFull ? 'text-red-500 font-bold' : 'text-gray-500'}`}>余量: {course.capacity - course.enrolled}</span>
                  <div className="flex space-x-2">
                    <button onClick={() => setSelectedCourseInfo(course)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="查看详情">
                      <Info size={20} />
                    </button>
                    {isEnrolled ? (<button onClick={() => handleDrop(course.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-sm font-medium">退选</button>) 
                    : isFull ? (<span className="px-4 py-1.5 text-red-400 font-medium text-sm">已满</span>) 
                    : (<button onClick={() => handleEnroll(course)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium">选修</button>)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 3. 我的课表视图 (全新功能！)
  const renderTimetable = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 border-emerald-200">我的日程课表 (Weekly Timetable)</h2>
      {myCourses.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p>您还没有选修任何课程。请前往“选课中心”添加课程。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {WEEKDAYS.map(day => {
            const dayCourses = myCourses.filter(c => c.day === day);
            return (
              <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-emerald-600 text-white text-center py-2 font-bold">{day}</div>
                <div className="p-4 min-h-[300px] bg-gray-50/50">
                  {dayCourses.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center mt-4">无课程</p>
                  ) : (
                    <div className="space-y-3">
                      {dayCourses.map(course => (
                        <div key={course.id} className="bg-white p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm text-sm">
                          <p className="font-bold text-gray-800 mb-1">{course.name}</p>
                          <p className="text-gray-500 mb-1 font-mono text-xs">{course.id}</p>
                          <p className="text-emerald-600 font-medium">{course.time}</p>
                          <p className="text-gray-500 mt-1 flex items-center"><User size={12} className="mr-1"/> {course.teacher}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // 4. 成绩查询视图
  const renderGrades = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 border-emerald-200">历史成绩单</h2>
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-600 text-white"><th className="p-4 font-semibold">课程代码</th><th className="p-4 font-semibold">课程名称</th><th className="p-4 font-semibold text-center">学分</th><th className="p-4 font-semibold text-center">最终得分</th><th className="p-4 font-semibold text-center">等第</th></tr>
          </thead>
          <tbody>
            {INITIAL_GRADES.map((grade, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors"><td className="p-4 font-medium text-gray-600">{grade.id}</td><td className="p-4 text-gray-800">{grade.name}</td><td className="p-4 text-center text-gray-600">{grade.credits}</td><td className="p-4 text-center font-bold text-gray-700">{grade.score}</td><td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-sm font-bold ${grade.grade.startsWith('A') ? 'bg-green-100 text-green-700' : grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{grade.grade}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 主渲染入口
  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <aside className="w-64 bg-emerald-900 text-emerald-50 flex flex-col shadow-xl z-10">
        <div className="p-6 text-center border-b border-emerald-800">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg"><span className="text-emerald-900 font-black text-2xl">MPU</span></div>
          <h1 className="font-bold text-lg tracking-wide">教务系统</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-700 text-white shadow-md' : 'hover:bg-emerald-800 text-emerald-200'}`}><LayoutDashboard size={20} /><span>仪表盘概览</span></button>
          <button onClick={() => setActiveTab('courseSelection')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'courseSelection' ? 'bg-emerald-700 text-white shadow-md' : 'hover:bg-emerald-800 text-emerald-200'}`}><BookOpen size={20} /><span>选课中心</span></button>
          <button onClick={() => setActiveTab('timetable')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'timetable' ? 'bg-emerald-700 text-white shadow-md' : 'hover:bg-emerald-800 text-emerald-200'}`}><Calendar size={20} /><span>我的课表</span></button>
          <button onClick={() => setActiveTab('grades')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'grades' ? 'bg-emerald-700 text-white shadow-md' : 'hover:bg-emerald-800 text-emerald-200'}`}><GraduationCap size={20} /><span>成绩查询</span></button>
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-emerald-800 hover:text-red-400 text-emerald-200 transition-all"><LogOut size={20} /><span>退出登录</span></button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-8 flex justify-between items-center z-10">
          <div className="text-gray-500 font-medium">2025-2026 学年 秋季学期</div>
          <div className="flex items-center space-x-3"><span className="text-sm font-medium text-gray-700">{studentInfo.name}</span><div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center"><User size={16} /></div></div>
        </header>

        {notification && (
          <div className={`absolute top-20 right-8 px-6 py-4 rounded-xl shadow-xl z-50 flex items-center animate-in slide-in-from-top-4 fade-in ${notification.type === 'error' ? 'bg-red-50 text-red-700 border-l-4 border-red-500' : 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500'}`}><span className="font-medium">{notification.message}</span></div>
        )}

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'courseSelection' && renderCourseSelection()}
            {activeTab === 'timetable' && renderTimetable()}
            {activeTab === 'grades' && renderGrades()}
          </div>
        </div>

        {/* 课程详情模态框 (Modal) */}
        {selectedCourseInfo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all">
              <div className="bg-emerald-600 p-6 text-white flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="bg-emerald-500 px-2 py-0.5 rounded text-xs font-mono">{selectedCourseInfo.id}</span>
                    <span className="bg-emerald-700 px-2 py-0.5 rounded text-xs">{selectedCourseInfo.type}</span>
                  </div>
                  <h3 className="text-xl font-bold">{selectedCourseInfo.name}</h3>
                </div>
                <button onClick={() => setSelectedCourseInfo(null)} className="text-white/80 hover:text-white"><XCircle size={24} /></button>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-gray-700">
                  <div><h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">课程简介 (Syllabus)</h4><p className="text-sm leading-relaxed">{selectedCourseInfo.description}</p></div>
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
                    <div><h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">先修要求 (Prerequisite)</h4><p className="text-sm font-medium">{selectedCourseInfo.preReq}</p></div>
                    <div><h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">授课教师 (Instructor)</h4><p className="text-sm font-medium">{selectedCourseInfo.teacher}</p></div>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm"><span className="text-gray-500">上课时间：</span><span className="font-bold text-gray-800">{selectedCourseInfo.day} {selectedCourseInfo.time}</span></div>
                    <div className="text-sm"><span className="text-gray-500">课程学分：</span><span className="font-bold text-emerald-600">{selectedCourseInfo.credits} Credits</span></div>
                  </div>
                </div>
                <div className="mt-6">
                  {myCourses.some(c => c.id === selectedCourseInfo.id) ? (
                    <button className="w-full bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-xl cursor-not-allowed">已选修此课程</button>
                  ) : (
                    <button onClick={() => handleEnroll(selectedCourseInfo)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors">立刻选修该课程</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}