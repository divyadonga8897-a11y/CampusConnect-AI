"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  Coins, 
  FileText, 
  Image as ImageIcon, 
  Mail, 
  Settings, 
  LogOut, 
  User as UserIcon,
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  AlertTriangle,
  History,
  Briefcase
} from "lucide-react";
import { adminService } from "@/services/adminService";

// Validation schemas for Zod forms
const deptSchema = z.object({
  id: z.string().min(2, "Code must be at least 2 characters."),
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  hod: z.string().min(3, "HOD name is required.")
});

const courseSchema = z.object({
  id: z.string().min(3, "Code must be at least 3 characters."),
  name: z.string().min(3, "Name must be at least 3 characters."),
  dept_id: z.string().min(2, "Department is required."),
  duration: z.string().min(2, "Duration is required."),
  intake: z.number().min(10, "Intake capacity must be >= 10.")
});

const feeSchema = z.object({
  course_id: z.string().min(3, "Course is required."),
  academic_year: z.string().min(4, "Academic year is required."),
  tuition: z.number().min(1000, "Tuition must be >= 1000."),
  hostel: z.number().min(0, "Hostel must be >= 0."),
  other: z.number().min(0, "Other fee must be >= 0."),
  fee_type: z.enum(["Convener", "Management", "Scholarship"])
});

export default function AdminDashboardClient() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard, college, departments, courses, fees, admissions, gallery, enquiries
  
  // Dashboard statistics
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lists databases
  const [enquiries, setEnquiries] = useState<any[]>([]);

  // Alerts
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  useEffect(() => {
    // Session token authorization check
    adminService.getCurrentUser()
      .then((res) => {
        if (!res.success) {
          router.push("/admin/login");
        } else {
          setCurrentUser(res.data);
          loadDashboardData();
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      adminService.getStats(),
      adminService.getLogs(),
      adminService.getEnquiries()
    ]).then(([statsRes, logsRes, enqRes]) => {
      setStats(statsRes.data || null);
      setLogs(logsRes.data || []);
      setEnquiries(enqRes.data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  const handleLogout = () => {
    adminService.logout().then(() => {
      router.push("/admin/login");
    });
  };

  const triggerAlert = (msg: string, type: "success" | "error" = "success") => {
    setAlertMessage(msg);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 4000);
  };

  // Forms states
  const [editingId, setEditingId] = useState<string | null>(null);

  // Department Form
  const { register: regDept, handleSubmit: subDept, reset: resDept } = useForm({
    resolver: zodResolver(deptSchema)
  });

  const onDeptSubmit = async (data: any) => {
    let res;
    if (editingId) {
      res = await adminService.updateDepartment(editingId, data.name, data.description, data.hod);
    } else {
      res = await adminService.createDepartment(data.id, data.name, data.description, data.hod);
    }
    if (res.success) {
      triggerAlert(editingId ? "Department updated successfully" : "Department created successfully");
      resDept();
      setEditingId(null);
      loadDashboardData();
    } else {
      triggerAlert(res.error || "Operation failed", "error");
    }
  };

  // Course Form
  const { register: regCourse, handleSubmit: subCourse, reset: resCourse } = useForm({
    resolver: zodResolver(courseSchema)
  });

  const onCourseSubmit = async (data: any) => {
    let res;
    if (editingId) {
      res = await adminService.updateCourse(editingId, data.name, data.duration, data.intake, "Overview details");
    } else {
      res = await adminService.createCourse(data.id, data.name, data.dept_id, data.duration, data.intake, "Overview details");
    }
    if (res.success) {
      triggerAlert(editingId ? "Course updated successfully" : "Course created successfully");
      resCourse();
      setEditingId(null);
      loadDashboardData();
    } else {
      triggerAlert(res.error || "Operation failed", "error");
    }
  };

  // Fee Form
  const { register: regFee, handleSubmit: subFee, reset: resFee } = useForm({
    resolver: zodResolver(feeSchema)
  });

  const onFeeSubmit = async (data: any) => {
    let res;
    if (editingId) {
      res = await adminService.updateFee(editingId, data.tuition, data.hostel, data.other);
    } else {
      res = await adminService.createFee(data.course_id, data.academic_year, data.tuition, data.hostel, data.other, data.fee_type);
    }
    if (res.success) {
      triggerAlert(editingId ? "Fee structure updated" : "Fee structure added");
      resFee();
      setEditingId(null);
      loadDashboardData();
    } else {
      triggerAlert(res.error || "Operation failed", "error");
    }
  };

  const handleEnquiryStatus = async (id: number, status: string) => {
    const res = await adminService.updateEnquiryStatus(id, status);
    if (res.success) {
      triggerAlert(`Enquiry marked as ${status.toLowerCase()}`);
      loadDashboardData();
    } else {
      triggerAlert(res.error || "Status update failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex bg-navy-950 text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-navy-900 border-r border-navy-800/40 p-6 flex flex-col justify-between hidden sm:flex shrink-0">
        <div className="space-y-8">
          <div>
            <div className="text-emerald-450 font-black text-sm uppercase tracking-widest">SSIET Console</div>
            <div className="text-[10px] text-navy-450 uppercase font-semibold mt-1">College Discovery CMS</div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => { setCurrentView("dashboard"); setEditingId(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "dashboard" ? "bg-emerald-500/10 text-emerald-400" : "text-navy-300 hover:bg-navy-800/30"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Home
            </button>
            <button
              onClick={() => { setCurrentView("departments"); setEditingId(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "departments" ? "bg-emerald-500/10 text-emerald-400" : "text-navy-300 hover:bg-navy-800/30"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Departments
            </button>
            <button
              onClick={() => { setCurrentView("courses"); setEditingId(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "courses" ? "bg-emerald-500/10 text-emerald-400" : "text-navy-300 hover:bg-navy-800/30"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </button>
            <button
              onClick={() => { setCurrentView("fees"); setEditingId(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "fees" ? "bg-emerald-500/10 text-emerald-400" : "text-navy-300 hover:bg-navy-800/30"
              }`}
            >
              <Coins className="w-4 h-4" />
              Fee Structures
            </button>
            <button
              onClick={() => { setCurrentView("enquiries"); setEditingId(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "enquiries" ? "bg-emerald-500/10 text-emerald-400" : "text-navy-300 hover:bg-navy-800/30"
              }`}
            >
              <Mail className="w-4 h-4" />
              Enquiries Inbox
            </button>
          </nav>
        </div>

        {/* User profile footer info */}
        <div className="pt-4 border-t border-navy-800/40 space-y-4">
          {currentUser && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold truncate text-white">{currentUser.full_name}</div>
                <div className="text-[9px] font-black text-navy-450 uppercase">{currentUser.role}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 overflow-y-auto">
        {/* Banner Alert Notification */}
        {alertMessage && (
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-2.5 text-xs sm:text-sm border ${
            alertType === "success" 
              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" 
              : "bg-red-950/20 border-red-500/30 text-red-400"
          }`}>
            <Check className="w-4.5 h-4.5 shrink-0" />
            <span>{alertMessage}</span>
          </div>
        )}

        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-navy-800/40 mb-8">
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tight">
              {currentView} console
            </h1>
            <p className="text-navy-350 text-xs mt-1">
              Welcome back, managing credentials lists and directories information.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="glass h-28 rounded-2xl" />
              ))}
            </div>
            <div className="glass h-64 rounded-2xl" />
          </div>
        ) : (
          <>
            {/* VIEW 1: DASHBOARD HOME */}
            {currentView === "dashboard" && (
              <div className="space-y-8">
                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass p-5 rounded-2xl border border-navy-800/30 text-center">
                      <BookOpen className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                      <div className="text-3xl font-extrabold text-white">{stats.courses}</div>
                      <div className="text-[10px] text-navy-450 uppercase font-black tracking-widest mt-1">Total Courses</div>
                    </div>
                    <div className="glass p-5 rounded-2xl border border-navy-800/30 text-center">
                      <Building2 className="w-5 h-5 text-emerald-450 mx-auto mb-2" />
                      <div className="text-3xl font-extrabold text-white">{stats.departments}</div>
                      <div className="text-[10px] text-navy-450 uppercase font-black tracking-widest mt-1">Departments</div>
                    </div>
                    <div className="glass p-5 rounded-2xl border border-navy-800/30 text-center">
                      <Mail className="w-5 h-5 text-gold-450 mx-auto mb-2" />
                      <div className="text-3xl font-extrabold text-white">{stats.student_enquiries}</div>
                      <div className="text-[10px] text-navy-450 uppercase font-black tracking-widest mt-1">Student Enquiries</div>
                    </div>
                    <div className="glass p-5 rounded-2xl border border-navy-800/30 text-center">
                      <ImageIcon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                      <div className="text-3xl font-extrabold text-white">{stats.gallery_images}</div>
                      <div className="text-[10px] text-navy-450 uppercase font-black tracking-widest mt-1">Gallery Images</div>
                    </div>
                  </div>
                )}

                {/* Audit Logs Table */}
                <div className="glass p-6 sm:p-8 rounded-3xl border border-navy-800/30">
                  <h2 className="text-base sm:text-lg font-black text-white mb-6 flex items-center gap-3">
                    <History className="w-5 h-5 text-emerald-400" />
                    Admin Action Audit Logs
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-navy-800/50 text-navy-400 uppercase tracking-wider font-semibold">
                          <th className="py-3 px-4">User</th>
                          <th className="py-3 px-4">Action</th>
                          <th className="py-3 px-4">Module</th>
                          <th className="py-3 px-4">Description</th>
                          <th className="py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr key={log.id} className="border-b border-navy-850 hover:bg-navy-900/35 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-white">{log.user_name}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.action === "CREATE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" :
                                log.action === "UPDATE" ? "bg-blue-500/10 text-blue-400 border border-blue-500/15" :
                                "bg-red-500/10 text-red-400 border border-red-500/15"
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-navy-200">{log.module}</td>
                            <td className="py-3.5 px-4 text-navy-300">{log.description}</td>
                            <td className="py-3.5 px-4 text-navy-450">{log.created_at}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: DEPARTMENTS CRUD */}
            {currentView === "departments" && (
              <div className="space-y-8 max-w-2xl">
                <div className="glass p-6 sm:p-8 rounded-3xl border border-navy-800/30">
                  <h2 className="text-white font-bold text-sm sm:text-base mb-6">
                    {editingId ? "Update Department" : "Add New Department"}
                  </h2>
                  <form onSubmit={subDept(onDeptSubmit)} className="space-y-4">
                    {!editingId && (
                      <div>
                        <label htmlFor="dept-code" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Code/Slug ID</label>
                        <input id="dept-code" type="text" {...regDept("id")} placeholder="e.g. cse" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                      </div>
                    )}
                    <div>
                      <label htmlFor="dept-name" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Name</label>
                      <input id="dept-name" type="text" {...regDept("name")} placeholder="e.g. Computer Science Engineering" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                    </div>
                    <div>
                      <label htmlFor="dept-desc" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Description</label>
                      <textarea id="dept-desc" rows={4} {...regDept("description")} placeholder="Outlines of courses, milestones..." className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                    </div>
                    <div>
                      <label htmlFor="dept-hod" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Head of Department (HOD)</label>
                      <input id="dept-hod" type="text" {...regDept("hod")} placeholder="Dr. Sastry" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                    </div>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:from-emerald-450 hover:to-emerald-550 transition-colors">
                      {editingId ? "Update Parameters" : "Publish Department"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW 3: COURSES CRUD */}
            {currentView === "courses" && (
              <div className="space-y-8 max-w-2xl">
                <div className="glass p-6 sm:p-8 rounded-3xl border border-navy-800/30">
                  <h2 className="text-white font-bold text-sm sm:text-base mb-6">
                    {editingId ? "Update Course Details" : "Add New Course"}
                  </h2>
                  <form onSubmit={subCourse(onCourseSubmit)} className="space-y-4">
                    {!editingId && (
                      <>
                        <div>
                          <label htmlFor="course-id" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Course Code/ID</label>
                          <input id="course-id" type="text" {...regCourse("id")} placeholder="e.g. b-tech-cse" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                        </div>
                        <div>
                          <label htmlFor="course-dept" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Department ID</label>
                          <input id="course-dept" type="text" {...regCourse("dept_id")} placeholder="e.g. cse" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                        </div>
                      </>
                    )}
                    <div>
                      <label htmlFor="course-name" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Course Name</label>
                      <input id="course-name" type="text" {...regCourse("name")} placeholder="e.g. B.Tech Computer Science Engineering" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="course-duration" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Duration</label>
                        <input id="course-duration" type="text" {...regCourse("duration")} placeholder="e.g. 4 Years" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                      </div>
                      <div>
                        <label htmlFor="course-intake" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Intake Capacity</label>
                        <input id="course-intake" type="number" {...regCourse("intake", { valueAsNumber: true })} placeholder="120" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                      </div>
                    </div>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:from-emerald-450 hover:to-emerald-550 transition-colors">
                      Submit Course Details
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW 4: FEES CRUD */}
            {currentView === "fees" && (
              <div className="space-y-8 max-w-2xl">
                <div className="glass p-6 sm:p-8 rounded-3xl border border-navy-800/30">
                  <h2 className="text-white font-bold text-sm sm:text-base mb-6">
                    {editingId ? "Update Tuition/Hostel Fees" : "Create Fee Structure"}
                  </h2>
                  <form onSubmit={subFee(onFeeSubmit)} className="space-y-4">
                    {!editingId && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="fee-course" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Course Code</label>
                          <input id="fee-course" type="text" {...regFee("course_id")} placeholder="e.g. b-tech-cse" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                        </div>
                        <div>
                          <label htmlFor="fee-year" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Academic Year</label>
                          <input id="fee-year" type="text" {...regFee("academic_year")} placeholder="e.g. 2025-2026" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                        </div>
                      </div>
                    )}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="fee-tuition" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Tuition Fee</label>
                        <input id="fee-tuition" type="number" {...regFee("tuition", { valueAsNumber: true })} placeholder="75000" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                      </div>
                      <div>
                        <label htmlFor="fee-hostel" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Hostel Fee</label>
                        <input id="fee-hostel" type="number" {...regFee("hostel", { valueAsNumber: true })} placeholder="35000" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                      </div>
                      <div>
                        <label htmlFor="fee-other" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Other Charges</label>
                        <input id="fee-other" type="number" {...regFee("other", { valueAsNumber: true })} placeholder="5000" className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900" />
                      </div>
                    </div>
                    {!editingId && (
                      <div>
                        <label htmlFor="fee-type-select" className="text-[10px] font-black uppercase text-navy-450 block mb-1">Admission Quota Type</label>
                        <select id="fee-type-select" {...regFee("fee_type")} className="w-full px-4 py-2.5 rounded-xl glass-light border border-navy-800 text-white focus:outline-none bg-navy-900 text-xs sm:text-sm">
                          <option value="Convener">Convener Quota</option>
                          <option value="Management">Management Quota</option>
                          <option value="Scholarship">Scholarship Quota</option>
                        </select>
                      </div>
                    )}
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:from-emerald-455 hover:to-emerald-555 transition-colors">
                      Commit Fee Struct
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW 5: ENQUIRIES INBOX */}
            {currentView === "enquiries" && (
              <div className="glass p-6 sm:p-8 rounded-3xl border border-navy-800/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-navy-800/50 text-navy-400 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Course Interest</th>
                        <th className="py-3 px-4">Message</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((enq) => (
                        <tr key={enq.id} className="border-b border-navy-850 hover:bg-navy-900/35 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">{enq.student_name}</td>
                          <td className="py-3.5 px-4 text-navy-300">
                            <div>{enq.email}</div>
                            <div className="text-[10px] text-navy-450 mt-0.5">{enq.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-emerald-450">{enq.course_interest.toUpperCase()}</td>
                          <td className="py-3.5 px-4 text-navy-305 max-w-xs truncate">{enq.message}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              enq.status === "New" ? "bg-blue-500/10 text-blue-400 border border-blue-500/15" :
                              enq.status === "Contacted" ? "bg-orange-500/10 text-orange-400 border border-orange-500/15" :
                              "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                            }`}>
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 space-x-2">
                            {enq.status === "New" && (
                              <button
                                onClick={() => handleEnquiryStatus(enq.id, "Contacted")}
                                className="px-2 py-1 rounded bg-navy-800 text-[10px] font-bold uppercase tracking-wider text-navy-200 hover:text-white"
                              >
                                Mark Contacted
                              </button>
                            )}
                            {enq.status !== "Resolved" && (
                              <button
                                onClick={() => handleEnquiryStatus(enq.id, "Resolved")}
                                className="px-2 py-1 rounded bg-emerald-500/10 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-white border border-emerald-500/20"
                              >
                                Mark Resolved
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
