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
  LogOut, 
  User as UserIcon,
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  AlertTriangle,
  History,
  TrendingUp,
  Inbox
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { StatCard } from "@/components/ui/StatCard";

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
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard, departments, courses, fees, enquiries
  
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
  const { register: regDept, handleSubmit: subDept, reset: resDept, setValue: setDeptValue } = useForm({
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
  const { register: regCourse, handleSubmit: subCourse, reset: resCourse, setValue: setCourseValue } = useForm({
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
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between hidden md:flex shrink-0 shadow-sm">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black text-slate-900 tracking-tight">SSIET Console</span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-9">Discovery CMS</div>
          </div>

          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard Home", icon: LayoutDashboard },
              { id: "departments", label: "Departments", icon: Building2 },
              { id: "courses", label: "Courses & Programs", icon: BookOpen },
              { id: "fees", label: "Fee Structures", icon: Coins },
              { id: "enquiries", label: "Enquiries Inbox", icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setCurrentView(tab.id); setEditingId(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    active 
                      ? "bg-blue-50 border-l-4 border-blue-600 text-blue-700 shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Info */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold truncate text-slate-900 leading-snug">{currentUser.full_name}</div>
                <div className="text-[9px] font-black text-slate-400 uppercase">{currentUser.role}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
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
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <Check className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{alertMessage}</span>
          </div>
        )}

        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-slate-200 mb-8">
          <div>
            <h1 className="text-slate-900 text-xl sm:text-2xl font-black uppercase tracking-tight">
              {currentView} console
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Welcome back, managing credentials lists and directories information.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-28 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="skeleton h-64 rounded-xl animate-pulse" />
          </div>
        ) : (
          <>
            {/* VIEW 1: DASHBOARD HOME */}
            {currentView === "dashboard" && (
              <div className="space-y-8">
                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Total Courses"
                      value={String(stats.courses)}
                      icon={BookOpen}
                      trend={{ value: "4 streams active", isPositive: true }}
                    />
                    <StatCard
                      title="Departments"
                      value={String(stats.departments)}
                      icon={Building2}
                      trend={{ value: "Central administration", isPositive: true }}
                    />
                    <StatCard
                      title="Student Enquiries"
                      value={String(stats.student_enquiries)}
                      icon={Mail}
                      trend={{ value: "Pending reviews", isPositive: false }}
                    />
                    <StatCard
                      title="Gallery Images"
                      value={String(stats.gallery_images)}
                      icon={ImageIcon}
                      trend={{ value: "Updated weekly", isPositive: true }}
                    />
                  </div>
                )}

                {/* Audit Logs Table */}
                <Card variant="default" className="p-6 sm:p-8">
                  <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <History className="w-5 h-5 text-blue-600" />
                    Admin Action Audit Logs
                  </h2>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-bold text-slate-800">{log.user_name}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                log.action === "CREATE"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : log.action === "UPDATE"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-red-50 text-red-700 border-red-100"
                              }`}
                            >
                              {log.action}
                            </span>
                          </TableCell>
                          <TableCell>{log.module}</TableCell>
                          <TableCell>{log.description}</TableCell>
                          <TableCell className="text-slate-400 font-medium">{log.created_at}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {/* VIEW 2: DEPARTMENTS CRUD */}
            {currentView === "departments" && (
              <div className="space-y-8 max-w-2xl">
                <Card variant="default" className="p-6 sm:p-8">
                  <h2 className="text-slate-900 font-bold text-sm sm:text-base mb-6 border-b border-slate-100 pb-3">
                    {editingId ? "Update Department" : "Add New Department"}
                  </h2>
                  <form onSubmit={subDept(onDeptSubmit)} className="space-y-4">
                    {!editingId && (
                      <Input
                        label="Code/Slug ID"
                        placeholder="e.g. cse"
                        {...regDept("id")}
                      />
                    )}
                    <Input
                      label="Name"
                      placeholder="e.g. Computer Science Engineering"
                      {...regDept("name")}
                    />
                    <Textarea
                      label="Description"
                      placeholder="Outlines of courses, milestones..."
                      {...regDept("description")}
                    />
                    <Input
                      label="Head of Department (HOD)"
                      placeholder="Dr. Sastry"
                      {...regDept("hod")}
                    />
                    <Button type="submit" variant="primary">
                      {editingId ? "Update Parameters" : "Publish Department"}
                    </Button>
                  </form>
                </Card>
              </div>
            )}

            {/* VIEW 3: COURSES CRUD */}
            {currentView === "courses" && (
              <div className="space-y-8 max-w-2xl">
                <Card variant="default" className="p-6 sm:p-8">
                  <h2 className="text-slate-900 font-bold text-sm sm:text-base mb-6 border-b border-slate-100 pb-3">
                    {editingId ? "Update Course Details" : "Add New Course"}
                  </h2>
                  <form onSubmit={subCourse(onCourseSubmit)} className="space-y-4">
                    {!editingId && (
                      <>
                        <Input
                          label="Course Code/ID"
                          placeholder="e.g. b-tech-cse"
                          {...regCourse("id")}
                        />
                        <Input
                          label="Department ID"
                          placeholder="e.g. cse"
                          {...regCourse("dept_id")}
                        />
                      </>
                    )}
                    <Input
                      label="Course Name"
                      placeholder="e.g. B.Tech Computer Science Engineering"
                      {...regCourse("name")}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Duration"
                        placeholder="e.g. 4 Years"
                        {...regCourse("duration")}
                      />
                      <Input
                        label="Intake Capacity"
                        type="number"
                        placeholder="120"
                        {...regCourse("intake", { valueAsNumber: true })}
                      />
                    </div>
                    <Button type="submit" variant="primary">
                      Submit Course Details
                    </Button>
                  </form>
                </Card>
              </div>
            )}

            {/* VIEW 4: FEES CRUD */}
            {currentView === "fees" && (
              <div className="space-y-8 max-w-2xl">
                <Card variant="default" className="p-6 sm:p-8">
                  <h2 className="text-slate-900 font-bold text-sm sm:text-base mb-6 border-b border-slate-100 pb-3">
                    {editingId ? "Update Tuition/Hostel Fees" : "Create Fee Structure"}
                  </h2>
                  <form onSubmit={subFee(onFeeSubmit)} className="space-y-4">
                    {!editingId && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                          label="Course Code"
                          placeholder="e.g. b-tech-cse"
                          {...regFee("course_id")}
                        />
                        <Input
                          label="Academic Year"
                          placeholder="e.g. 2025-2026"
                          {...regFee("academic_year")}
                        />
                      </div>
                    )}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Input
                        label="Tuition Fee"
                        type="number"
                        placeholder="75000"
                        {...regFee("tuition", { valueAsNumber: true })}
                      />
                      <Input
                        label="Hostel Fee"
                        type="number"
                        placeholder="35000"
                        {...regFee("hostel", { valueAsNumber: true })}
                      />
                      <Input
                        label="Other Charges"
                        type="number"
                        placeholder="5000"
                        {...regFee("other", { valueAsNumber: true })}
                      />
                    </div>
                    {!editingId && (
                      <Select
                        label="Admission Quota Type"
                        options={[
                          { value: "Convener", label: "Convener Quota" },
                          { value: "Management", label: "Management Quota" },
                          { value: "Scholarship", label: "Scholarship Quota" },
                        ]}
                        {...regFee("fee_type")}
                      />
                    )}
                    <Button type="submit" variant="primary">
                      Commit Fee Struct
                    </Button>
                  </form>
                </Card>
              </div>
            )}

            {/* VIEW 5: ENQUIRIES INBOX */}
            {currentView === "enquiries" && (
              <Card variant="default" className="p-6 sm:p-8">
                <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Inbox className="w-5 h-5 text-blue-600" />
                  Student Enquiries Inbox
                </h2>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Contact Details</TableHead>
                      <TableHead>Course Interest</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enquiries.map((enq) => (
                      <TableRow key={enq.id}>
                        <TableCell className="font-bold text-slate-800">{enq.student_name}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-700">{enq.email}</div>
                          <div className="text-[10px] text-slate-400">{enq.phone}</div>
                        </TableCell>
                        <TableCell className="font-semibold text-blue-700">{enq.course_interest.toUpperCase()}</TableCell>
                        <TableCell className="max-w-xs truncate text-slate-500" title={enq.message}>
                          {enq.message}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              enq.status === "New"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : enq.status === "Contacted"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}
                          >
                            {enq.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {enq.status === "New" && (
                              <Button
                                variant="secondary"
                                size="xs"
                                onClick={() => handleEnquiryStatus(enq.id, "Contacted")}
                              >
                                Mark Contacted
                              </Button>
                            )}
                            {enq.status !== "Resolved" && (
                              <Button
                                variant="primary"
                                size="xs"
                                onClick={() => handleEnquiryStatus(enq.id, "Resolved")}
                              >
                                Mark Resolved
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
