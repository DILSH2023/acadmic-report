import React, { useState } from 'react';
import { Copy, Check, Download, FolderTree, FileCode } from 'lucide-react';

import appPyRaw from '../../student_progress_tracker/app.py?raw';
import databasePyRaw from '../../student_progress_tracker/database.py?raw';
import requirementsRaw from '../../student_progress_tracker/requirements.txt?raw';
import readmeRaw from '../../student_progress_tracker/README.md?raw';
import styleCssRaw from '../../student_progress_tracker/static/css/style.css?raw';
import scriptJsRaw from '../../student_progress_tracker/static/js/script.js?raw';
import indexHtmlRaw from '../../student_progress_tracker/templates/index.html?raw';
import loginHtmlRaw from '../../student_progress_tracker/templates/login.html?raw';
import registerHtmlRaw from '../../student_progress_tracker/templates/register.html?raw';
import dashboardHtmlRaw from '../../student_progress_tracker/templates/dashboard.html?raw';
import attendanceHtmlRaw from '../../student_progress_tracker/templates/attendance.html?raw';
import performanceHtmlRaw from '../../student_progress_tracker/templates/performance.html?raw';
import assignmentsHtmlRaw from '../../student_progress_tracker/templates/assignments.html?raw';
import goalsHtmlRaw from '../../student_progress_tracker/templates/goals.html?raw';
import reportsHtmlRaw from '../../student_progress_tracker/templates/reports.html?raw';
import adminHtmlRaw from '../../student_progress_tracker/templates/admin.html?raw';

interface ProjectFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'student_progress_tracker/app.py',
    language: 'python',
    description: 'Main Python Flask application with authentication, student routes, admin panel, and Chart.js JSON API.',
    content: appPyRaw,
  },
  {
    path: 'student_progress_tracker/database.py',
    language: 'python',
    description: 'SQLite database initializer creating all 8 tables (Students, Admin, Subjects, Attendance, Examination, Assignments, Assignment_Submissions, Study_Goals) and sample seed records.',
    content: databasePyRaw,
  },
  {
    path: 'student_progress_tracker/requirements.txt',
    language: 'text',
    description: 'Python package dependencies (Flask & Werkzeug).',
    content: requirementsRaw,
  },
  {
    path: 'student_progress_tracker/templates/index.html',
    language: 'html',
    description: 'Landing page introducing the Student Progress Tracker modules.',
    content: indexHtmlRaw,
  },
  {
    path: 'student_progress_tracker/templates/login.html',
    language: 'html',
    description: 'Unified Student & Admin login form with role selector and demo credentials.',
    content: loginHtmlRaw,
  },
  {
    path: 'student_progress_tracker/templates/register.html',
    language: 'html',
    description: 'Student registration form with client-side password matching validation.',
    content: registerHtmlRaw,
  },
  {
    path: 'student_progress_tracker/templates/dashboard.html',
    language: 'html',
    description: 'Student dashboard displaying summary cards and interactive Chart.js graphs.',
    content: dashboardHtmlRaw,
  },
  {
    path: 'student_progress_tracker/templates/attendance.html',
    language: 'html',
    description: 'Subject-wise attendance table with automatic 75% eligibility status.',
    content: attendanceHtmlRaw,
  },
  {
    path: 'student_progress_tracker/templates/performance.html',
    language: 'html',
    description: 'Examination marks form, subject-wise ledger, and performance trend chart.',
    content: performanceHtmlRaw,
  },
  {
    path: 'student_progress_tracker/templates/assignments.html',
    language: 'html',
    description: 'Assignment tracker for pending deadlines and completed submissions.',
    content: assignmentsHtmlRaw,
  },
  {
    path: 'student_progress_tracker/templates/goals.html',
    language: 'html',
    description: 'Daily and weekly study goal planner with completion percentage tracking.',
    content: goalsHtmlRaw,
  },
  {
    path: 'student_progress_tracker/templates/reports.html',
    language: 'html',
    description: 'Printable & downloadable PDF Student Progress Report transcript.',
    content: reportsHtmlRaw,
  },
  {
    path: 'student_progress_tracker/templates/admin.html',
    language: 'html',
    description: 'Faculty Administrator Console to manage students, subjects, attendance, exams, and assignments.',
    content: adminHtmlRaw,
  },
  {
    path: 'student_progress_tracker/static/css/style.css',
    language: 'css',
    description: 'Custom Bootstrap 5 theme, sidebar layout, and @media print PDF styles.',
    content: styleCssRaw,
  },
  {
    path: 'student_progress_tracker/static/js/script.js',
    language: 'javascript',
    description: 'Form validation, Chart.js dynamic fetch integration, and PDF print handler.',
    content: scriptJsRaw,
  },
  {
    path: 'student_progress_tracker/README.md',
    language: 'markdown',
    description: 'Project structure, database schema documentation, and local setup instructions.',
    content: readmeRaw,
  },
];

export const FlaskSourceExplorer: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>(PROJECT_FILES[0].path);
  const [copied, setCopied] = useState(false);

  const activeFile =
    PROJECT_FILES.find((f) => f.path === selectedPath) || PROJECT_FILES[0];

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeFile.content).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (file: ProjectFile) => {
    const filename = file.path.split('/').pop() || 'file.txt';
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">
            Python Flask + SQLite + Bootstrap 5 Project Files ({PROJECT_FILES.length} Files)
          </h2>
          <p className="text-xs text-[#64748B]">
            All required files under <code className="font-mono text-[#4F46E5]">student_progress_tracker/</code> and <code className="font-mono text-[#4F46E5]">database/student_tracker.db</code> are generated in the workspace. Select any file below to inspect, copy, or download.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied File' : 'Copy Code'}
          </button>
          <button
            type="button"
            onClick={() => handleDownloadFile(activeFile)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download {activeFile.path.split('/').pop()}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* File Tree Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#4F46E5]" />
            <span className="text-xs font-bold text-[#0F172A]">
              student_progress_tracker/
            </span>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {PROJECT_FILES.map((f) => {
              const isSelected = f.path === selectedPath;
              const shortPath = f.path.replace('student_progress_tracker/', '');
              return (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => setSelectedPath(f.path)}
                  className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 transition-colors ${
                    isSelected
                      ? 'bg-[#EEF2FF] text-[#4F46E5] font-bold'
                      : 'text-[#0F172A] hover:bg-[#F8FAFC] font-medium'
                  }`}
                >
                  <span className="text-xs font-mono truncate flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    {shortPath}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B] shrink-0">
                    {f.language}
                  </span>
                </button>
              );
            })}
            <div className="px-4 py-2.5 bg-[#ECFDF5]/60 text-xs font-mono text-[#047857] flex items-center justify-between">
              <span>database/student_tracker.db</span>
              <span className="text-[10px] font-sans font-semibold">SQLite Binary (Active)</span>
            </div>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8 bg-[#0F172A] rounded-2xl border border-[#1E293B] shadow-ambient overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1E293B] flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-white">
                {activeFile.path}
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-0.5">
                {activeFile.description}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1 text-xs font-semibold bg-[#1E293B] text-[#E2E8F0] hover:bg-[#334155] rounded-md transition-colors shrink-0"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-5 text-xs font-mono text-[#E2E8F0] overflow-x-auto max-h-[680px] leading-relaxed">
            <code>{activeFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
