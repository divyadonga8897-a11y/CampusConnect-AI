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
  Inbox,
  Database,
  UploadCloud,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Info,
  Globe,
  FolderOpen,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Award,
  Heart,
  CalendarDays,
  Camera,
  Users,
  Settings,
  School
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

export default function AdminDashboardClient({ defaultView = "dashboard" }: { defaultView?: string }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState(defaultView); 
  
  // Dashboard statistics
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [kbExpanded, setKbExpanded] = useState(true); // default open to make it clear it exists
  const [kbHighlightSection, setKbHighlightSection] = useState<string | null>(null);

  // Knowledge base state
  const [knowledgeDocs, setKnowledgeDocs] = useState<any[]>([]);
  const [kbStats, setKbStats] = useState<any>(null);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbUploading, setKbUploading] = useState(false);
  const [kbUploadProgress, setKbUploadProgress] = useState(0);
  const [kbCategory, setKbCategory] = useState("General");
  const [kbDragOver, setKbDragOver] = useState(false);

  // Lists databases
  const [enquiries, setEnquiries] = useState<any[]>([]);

  // Alerts
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const handleKbSubViewClick = (sectionId: string) => {
    setCurrentView("knowledge-base");
    setKbHighlightSection(sectionId);
    setMobileSidebarOpen(false);
    
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-4", "ring-blue-500/50", "transition-all", "duration-500");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-blue-500/50");
        }, 3000);
      }
    }, 150);
  };

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

  const loadKnowledgeData = () => {
    setKbLoading(true);
    Promise.all([
      adminService.getKnowledgeDocuments(),
      adminService.getKnowledgeStats()
    ]).then(([docsRes, statsRes]) => {
      setKnowledgeDocs(docsRes.data || []);
      setKbStats(statsRes.data || null);
      setKbLoading(false);
    }).catch((err) => {
      triggerAlert(err.message || "Failed to load knowledge base data", "error");
      setKbLoading(false);
    });
  };

  useEffect(() => {
    if (currentView === "knowledge-base") {
      loadKnowledgeData();
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView !== "knowledge-base") return;
    const hasProcessing = knowledgeDocs.some((d: any) => d.status === "Processing");
    if (!hasProcessing) return;

    const timer = setInterval(() => {
      adminService.getKnowledgeDocuments().then((res) => {
        if (res.success && res.data) {
          setKnowledgeDocs(res.data);
          const finishedIndex = res.data.some((d: any) => d.status !== "Processing" && knowledgeDocs.find((old: any) => old.id === d.id)?.status === "Processing");
          if (finishedIndex) {
            adminService.getKnowledgeStats().then((sRes: any) => {
              if (sRes.success) setKbStats(sRes.data);
            });
          }
        }
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [currentView, knowledgeDocs]);

  const handleReindexDoc = async (id: string) => {
    triggerAlert("Re-indexing started...");
    const res = await adminService.reindexKnowledgeDocument(id);
    if (res.success) {
      triggerAlert("Document re-indexing triggered!");
      loadKnowledgeData();
    } else {
      triggerAlert(res.error || "Failed to start re-indexing", "error");
    }
  };

  const handleConfirmDeleteDoc = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document and all its indexed vectors from Pinecone? This action cannot be undone.")) return;
    const res = await adminService.deleteKnowledgeDocument(id);
    if (res.success) {
      triggerAlert("Document deleted and purged from Pinecone!");
      loadKnowledgeData();
    } else {
      triggerAlert(res.error || "Failed to delete document", "error");
    }
  };

  const handleDocUpload = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "docx", "txt", "md"].includes(ext)) {
      triggerAlert("Unsupported file type. Only PDF, DOCX, TXT, MD files are allowed.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      triggerAlert("File is too large. Maximum size is 5MB.", "error");
      return;
    }

    setKbUploading(true);
    setKbUploadProgress(20);
    
    const progTimer = setInterval(() => {
      setKbUploadProgress(prev => (prev < 80 ? prev + 15 : prev));
    }, 300);

    const res = await adminService.uploadKnowledgeDocument(file, kbCategory);
    clearInterval(progTimer);
    setKbUploadProgress(100);

    setTimeout(() => {
      setKbUploading(false);
      setKbUploadProgress(0);
      if (res.success) {
        triggerAlert("Document uploaded successfully! Indexing started in background.");
        loadKnowledgeData();
      } else {
        triggerAlert(res.error || "Failed to upload document", "error");
      }
    }, 400);
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
    <div className="min-h-screen flex bg-slate-50 text-slate-800 relative">
      
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 shadow-sm transition-all duration-300 md:flex z-50
        ${mobileSidebarOpen ? "fixed inset-y-0 left-0 flex" : "hidden"}
      `}>
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-black text-slate-900 tracking-tight">SSIET Console</span>
              </div>
              {/* Mobile Close Button */}
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 md:hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-9">Discovery CMS</div>
          </div>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {[
              { id: "dashboard", label: "Overview", icon: LayoutDashboard },
              { id: "college-info", label: "College Information", icon: School },
              { id: "departments", label: "Departments", icon: Building2 },
              { id: "courses", label: "Courses", icon: BookOpen },
              { id: "admissions", label: "Admissions", icon: GraduationCap },
              { id: "scholarships", label: "Scholarships", icon: Award },
              { id: "placements", label: "Placements", icon: TrendingUp },
              { id: "campus-life", label: "Campus Life", icon: Heart },
              { id: "events", label: "Events", icon: CalendarDays },
              { id: "gallery", label: "Gallery", icon: Camera },
              { id: "enquiries", label: "Contact Enquiries", icon: Mail },
              { id: "users", label: "Users", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { 
                    setCurrentView(tab.id); 
                    setEditingId(null); 
                    setMobileSidebarOpen(false); 
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    active 
                      ? "bg-blue-50 border-l-4 border-blue-600 text-blue-700 shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-blue-600" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}

            {/* Knowledge Base Expandable Section - Super Admin Only */}
            {currentUser?.role === "super_admin" && (
              <>
                <button
                  onClick={() => setKbExpanded(!kbExpanded)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    currentView === "knowledge-base"
                      ? "bg-blue-50 border-l-4 border-blue-600 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className={`w-3.5 h-3.5 ${currentView === "knowledge-base" ? "text-blue-600" : "text-slate-400"}`} />
                    <span>Knowledge Base</span>
                    <span className="inline-flex items-center px-1 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[8px] font-black tracking-widest">NEW</span>
                  </div>
                  {kbExpanded 
                    ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  }
                </button>
                {kbExpanded && (
                  <div className="ml-6 pl-3 border-l border-slate-200 space-y-0.5">
                    {[
                      { section: "kb-upload-section", label: "Upload Document", icon: UploadCloud },
                      { section: "kb-inventory-section", label: "Uploaded Documents", icon: FolderOpen },
                      { section: "kb-reindex-action", label: "Re-index Knowledge Base", icon: RefreshCw },
                      { section: "kb-inventory-section", label: "Delete Document", icon: Trash2 },
                      { section: "kb-inventory-section", label: "Document Status", icon: CheckCircle2 },
                      { section: "kb-chunks-card", label: "Chunk Statistics", icon: Database },
                      { section: "kb-health-cards", label: "AI Health", icon: Sparkles },
                    ].map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.label}
                          onClick={() => handleKbSubViewClick(sub.section)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer text-left"
                        >
                          <SubIcon className="w-3 h-3 text-slate-400 hover:text-blue-500" />
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Settings */}
            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setCurrentView("settings");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentView === "settings"
                    ? "bg-blue-50 border-l-4 border-blue-600 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Settings
              </button>
            </div>
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
          <div className="flex items-center gap-4">
            {/* Hamburger Button for mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 md:hidden cursor-pointer shrink-0"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-slate-900 text-xl sm:text-2xl font-black uppercase tracking-tight">
                {currentView === "knowledge-base" && "AI Knowledge Base"}
                {currentView === "dashboard" && "Overview Console"}
                {currentView === "college-info" && "College Information"}
                {currentView === "departments" && "Departments Directory"}
                {currentView === "courses" && "Academic Programs"}
                {currentView === "admissions" && "Admissions Board"}
                {currentView === "scholarships" && "Scholarships Registry"}
                {currentView === "placements" && "Campus Placements"}
                {currentView === "campus-life" && "Campus Life Directory"}
                {currentView === "events" && "Events Scheduler"}
                {currentView === "gallery" && "Media Gallery"}
                {currentView === "enquiries" && "Enquiries Inbox"}
                {currentView === "users" && "User Accounts"}
                {currentView === "settings" && "System Settings"}
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                {currentView === "knowledge-base" && "Manage text assets, recursive chunking, Pinecone vector storage and Groq inference mappings."}
                {currentView === "dashboard" && "SSIET Central administration actions audit logs and database metrics."}
                {currentView === "college-info" && "Manage branding, vision, mission, and accreditation status parameters."}
                {currentView === "departments" && "Configure academic departments, codes, descriptions, and designated HODs."}
                {currentView === "courses" && "List, add, or update course intake capacities and duration cycles."}
                {currentView === "admissions" && "Review recent applicant files, allocated seat stats, and quota allocations."}
                {currentView === "scholarships" && "Track coverage levels, eligibility criteria, and enrolments."}
                {currentView === "placements" && "Year-wise packages, average placement percentages, and recruitment directory."}
                {currentView === "campus-life" && "Hostel occupancy capacities and campus amenities monitoring indicators."}
                {currentView === "events" && "Academic calendar updates, technical hackathons, and cultural fests schedules."}
                {currentView === "gallery" && "Upload and catalog high-quality photo files for page carousels."}
                {currentView === "enquiries" && "Inspect incoming queries, phone numbers, and mark resolved actions."}
                {currentView === "users" && "Modify console credentials and user accessibility permissions."}
                {currentView === "settings" && "Configure automatic backups, MFA controls, and default dashboard options."}
              </p>
            </div>
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

            {/* VIEW 6: KNOWLEDGE BASE MODULE */}
            {currentView === "knowledge-base" && (
              currentUser?.role !== "super_admin" ? (
                <Card variant="default" className="p-10 text-center max-w-xl mx-auto space-y-6 border border-slate-200 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mx-auto">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Access Denied</h2>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    You do not have the required permissions to access the Knowledge Base Management module. Only users with the <strong className="text-red-650 font-bold">super_admin</strong> role are authorized to manage vector databases and document assets.
                  </p>
                  <Button variant="primary" size="sm" onClick={() => setCurrentView("dashboard")} className="mt-2 cursor-pointer font-bold uppercase tracking-wider">
                    Return to Dashboard
                  </Button>
                </Card>
              ) : (
                <div className="space-y-8 animate-fadeIn">
                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div id="kb-docs-card" className="bg-white/60 backdrop-blur-md border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Documents</div>
                      <div className="text-2xl font-black text-slate-950 mt-1">{kbStats?.total_documents ?? 0}</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>

                  <div id="kb-chunks-card" className="bg-white/60 backdrop-blur-md border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Chunks</div>
                      <div className="text-2xl font-black text-slate-950 mt-1">{kbStats?.total_chunks ?? 0}</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Database className="w-5 h-5" />
                    </div>
                  </div>

                  <div id="kb-health-cards" className="bg-white/60 backdrop-blur-md border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pinecone DB</div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          kbStats?.pinecone_status === "Operational" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-red-50 text-red-700 border-red-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${kbStats?.pinecone_status === "Operational" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                          {kbStats?.pinecone_status ?? "Unavailable"}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Globe className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Groq LLM</div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          kbStats?.groq_status === "Operational" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-red-50 text-red-700 border-red-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${kbStats?.groq_status === "Operational" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                          {kbStats?.groq_status ?? "Unavailable"}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Main panel */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Column: Upload */}
                  <div id="kb-upload-section" className="lg:col-span-1 space-y-6 transition-all">
                    <Card variant="default" className="p-6">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-blue-600" />
                        Upload Knowledge Document
                      </h3>
                      <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
                        Add official program brochures, syllabus, guidelines, or admission notices. The system will process files and index them into Pinecone vectors.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">Category Namespace</label>
                          <select 
                            value={kbCategory}
                            onChange={(e) => setKbCategory(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                          >
                            <option value="General">General / General Info</option>
                            <option value="Admissions">Admissions & Eligibility</option>
                            <option value="Placements">Placements & Recruiters</option>
                            <option value="Academics">Academics & Courses</option>
                            <option value="Student Life">Student Life & Hostels</option>
                          </select>
                        </div>

                        {/* Drag and Drop Box */}
                        <div
                          onDragOver={(e) => { e.preventDefault(); setKbDragOver(true); }}
                          onDragLeave={() => setKbDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setKbDragOver(false);
                            if (e.dataTransfer.files.length) {
                              handleDocUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                            kbDragOver 
                              ? "border-blue-500 bg-blue-50/40" 
                              : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/55"
                          }`}
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".pdf,.docx,.txt,.md";
                            input.onchange = (e: any) => {
                              if (e.target.files?.length) {
                                handleDocUpload(e.target.files[0]);
                              }
                            };
                            input.click();
                          }}
                        >
                          <UploadCloud className="w-8 h-8 text-slate-350 mx-auto mb-3" />
                          <p className="text-xs font-bold text-slate-700">Drag & Drop file here</p>
                          <p className="text-[10px] text-slate-400 mt-1">or click to browse local files</p>
                          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold">PDF</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold">DOCX</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold">TXT</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold">MD</span>
                          </div>
                        </div>

                        {kbUploading && (
                          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold text-blue-700">
                              <span>Uploading & Chunking...</span>
                              <span>{kbUploadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-blue-600 h-full rounded-full transition-all duration-300" 
                                style={{ width: `${kbUploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Right Column: Files table */}
                  <div id="kb-inventory-section" className="lg:col-span-2 transition-all">
                    <Card variant="default" className="p-6">
                      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <FolderOpen className="w-4 h-4 text-blue-600" />
                          Knowledge Documents Inventory
                        </h3>
                        <Button 
                          id="kb-reindex-action"
                          variant="secondary" 
                          size="xs" 
                          onClick={loadKnowledgeData}
                          className="flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-all"
                          disabled={kbLoading}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${kbLoading ? "animate-spin" : ""}`} />
                          Refresh List
                        </Button>
                      </div>

                      {kbLoading && knowledgeDocs.length === 0 ? (
                        <div className="py-20 text-center text-xs text-slate-400 animate-pulse font-bold">
                          Loading inventory databases...
                        </div>
                      ) : knowledgeDocs.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                          <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                          <p className="text-xs font-bold text-slate-700">No documents uploaded yet</p>
                          <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                            Upload documents to index program structures and general campus guides into the Pinecone RAG store.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Filename</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Chunks</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {knowledgeDocs.map((doc) => (
                                <TableRow key={doc.id}>
                                  <TableCell className="max-w-[200px]">
                                    <div className="font-bold text-slate-800 truncate" title={doc.filename}>{doc.filename}</div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span className="px-1 py-0.5 rounded bg-slate-150 text-[8px] font-extrabold uppercase text-slate-500 tracking-wider">
                                        {doc.file_type}
                                      </span>
                                      <span className="text-[9px] text-slate-400">{doc.upload_date}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                      {doc.category}
                                    </span>
                                  </TableCell>
                                  <TableCell className="font-mono text-[11px] font-bold text-slate-700">
                                    {doc.chunk_count ?? 0}
                                  </TableCell>
                                  <TableCell>
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      doc.status === "Indexed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : doc.status === "Failed"
                                        ? "bg-red-50 text-red-700 border-red-100"
                                        : "bg-amber-50 text-amber-700 border-amber-100"
                                    }`}>
                                      {doc.status === "Processing" && (
                                        <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                                      )}
                                      {doc.status === "Indexed" && (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      )}
                                      {doc.status === "Failed" && (
                                        <XCircle className="w-3 h-3 text-red-600" />
                                      )}
                                      {doc.status}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <Button
                                        variant="secondary"
                                        size="xs"
                                        title="Re-index document"
                                        onClick={() => handleReindexDoc(doc.id)}
                                        className="h-8 w-8 !p-0 flex items-center justify-center rounded-lg cursor-pointer"
                                        disabled={doc.status === "Processing"}
                                      >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        size="xs"
                                        title="Delete document"
                                        onClick={() => handleConfirmDeleteDoc(doc.id)}
                                        className="h-8 w-8 !p-0 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
                </div>
              )
            )}

            {/* VIEW 7: COLLEGE INFORMATION */}
            {currentView === "college-info" && (
              <div className="space-y-8 max-w-4xl animate-fadeIn">
                <Card variant="default" className="p-6 sm:p-8 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm">
                  <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <School className="w-5 h-5 text-blue-600" />
                    College Information Configuration
                  </h2>
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("College Parameters Saved Successfully!"); }}>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input label="College Name" defaultValue="Sri Sukhmani Institute of Engineering & Technology" />
                      <Input label="Short Code / Abbreviation" defaultValue="SSIET" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6">
                      <Input label="Accreditation Status" defaultValue="NAAC A+ Accredited" />
                      <Input label="Affiliation" defaultValue="IKG Punjab Technical University" />
                      <Input label="Established Year" defaultValue="1998" />
                    </div>
                    <Textarea label="Vision Statement" defaultValue="To be a center of excellence in engineering & technical education, producing professionals of high integrity and social commitment." />
                    <Textarea label="Mission Statement" defaultValue="Providing high quality research environment, state of the art labs, encouraging industry-academia interfaces and offering dynamic community development pathways." />
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input label="Contact Email" defaultValue="info@ssiet.ac.in" />
                      <Input label="Contact Number" defaultValue="+91-1762-507000" />
                    </div>
                    <Button type="submit" variant="primary">Save Parameters</Button>
                  </form>
                </Card>
              </div>
            )}

            {/* VIEW 8: ADMISSIONS */}
            {currentView === "admissions" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/85 p-5 rounded-2xl shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admission Status</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">OPEN</div>
                    <p className="text-[10px] text-slate-400 mt-1">Academic Year 2026-27</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/85 p-5 rounded-2xl shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Applications</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">342</div>
                    <p className="text-[10px] text-slate-400 mt-1">28 pending review</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/85 p-5 rounded-2xl shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Allocated Seats</div>
                    <div className="text-2xl font-black text-blue-600 mt-1">68%</div>
                    <p className="text-[10px] text-slate-400 mt-1">Across all 5 streams</p>
                  </div>
                </div>

                <Card variant="default" className="p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3 flex items-center justify-between">
                    <span>Recent Applicant Files</span>
                    <button className="text-xs text-blue-600 font-bold uppercase tracking-wider hover:underline" onClick={() => alert("Loading applicant sheets...")}>View Details</button>
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Course Requested</TableHead>
                        <TableHead>Marks %</TableHead>
                        <TableHead>Quota</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "Rahul Sharma", course: "B.Tech CSE", marks: "94.2%", quota: "Convener", status: "Approved" },
                        { name: "Priya Patel", course: "B.Tech ECE", marks: "88.6%", quota: "Management", status: "Pending Review" },
                        { name: "Aman Preet Singh", course: "B.Tech ME", marks: "76.4%", quota: "Convener", status: "Under Screening" },
                      ].map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-bold text-slate-800">{item.name}</TableCell>
                          <TableCell>{item.course}</TableCell>
                          <TableCell className="font-mono text-xs">{item.marks}</TableCell>
                          <TableCell>{item.quota}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              item.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              item.status === "Pending Review" ? "bg-amber-50 text-amber-700 border-amber-100" :
                              "bg-blue-50 text-blue-700 border-blue-100"
                            }`}>{item.status}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {/* VIEW 9: SCHOLARSHIPS */}
            {currentView === "scholarships" && (
              <div className="space-y-8 animate-fadeIn max-w-4xl">
                <Card variant="default" className="p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      Scholarships & Grants Registry
                    </h2>
                    <Button variant="primary" size="xs" onClick={() => alert("Create custom scholarship program widget")}>
                      Create Scholarship
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Scheme / Program</TableHead>
                        <TableHead>Eligibility Criteria</TableHead>
                        <TableHead>Coverage</TableHead>
                        <TableHead>Active Enrolments</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { title: "Merit Scholarship", criteria: "Marks >= 95% in Class XII", coverage: "100% Tuition Fee Waiver", count: 48 },
                        { title: "PTU State Level Waiver", criteria: "Rank < 5000 in PTU Entrance", coverage: "50% Tuition Fee Waiver", count: 112 },
                        { title: "Sports Excellence Grant", criteria: "National / Zonal Level Medallist", coverage: "Free Hostel + 25% Tuition Waiver", count: 18 },
                      ].map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-bold text-slate-800">{item.title}</TableCell>
                          <TableCell className="text-slate-500 text-xs">{item.criteria}</TableCell>
                          <TableCell className="font-semibold text-blue-700">{item.coverage}</TableCell>
                          <TableCell className="font-bold text-slate-700">{item.count} students</TableCell>
                          <TableCell className="text-right">
                            <Button variant="secondary" size="xs">Modify</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {/* VIEW 10: PLACEMENTS */}
            {currentView === "placements" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid sm:grid-cols-4 gap-6">
                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/85 p-5 rounded-2xl shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Placement Rate</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">94.2%</div>
                    <p className="text-[10px] text-slate-400 mt-1">Class of 2025</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/85 p-5 rounded-2xl shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Highest Package</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">28.5 LPA</div>
                    <p className="text-[10px] text-slate-400 mt-1">Secured at Adobe Systems</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/85 p-5 rounded-2xl shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Package</div>
                    <div className="text-2xl font-black text-blue-600 mt-1">5.8 LPA</div>
                    <p className="text-[10px] text-slate-400 mt-1">All engineering branches</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/85 p-5 rounded-2xl shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recruiter Partners</div>
                    <div className="text-2xl font-black text-indigo-600 mt-1">120+</div>
                    <p className="text-[10px] text-slate-400 mt-1">National & global brands</p>
                  </div>
                </div>

                <Card variant="default" className="p-6 max-w-4xl">
                  <h3 className="text-sm font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">Top Recruiting Directory</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["Infosys", "Wipro", "TCS", "Cognizant", "Capgemini", "L&T Infotech", "HCL Technologies", "Adobe"].map((recruiter, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-center font-bold text-xs text-slate-700 shadow-sm hover:border-blue-400 transition-colors">
                        {recruiter}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* VIEW 11: CAMPUS LIFE */}
            {currentView === "campus-life" && (
              <div className="space-y-8 animate-fadeIn max-w-4xl">
                <Card variant="default" className="p-6">
                  <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    Campus Amenities & Hostels Management
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-6 mb-8">
                    <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 shadow-sm">
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Boys Hostel</h3>
                      <div className="mt-2 text-xl font-black text-slate-900">450 / 500</div>
                      <p className="text-[10px] text-slate-400 mt-1">Occupancy rate: 90%</p>
                    </div>
                    <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 shadow-sm">
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Girls Hostel</h3>
                      <div className="mt-2 text-xl font-black text-slate-900">220 / 300</div>
                      <p className="text-[10px] text-slate-400 mt-1">Occupancy rate: 73.3%</p>
                    </div>
                    <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 shadow-sm">
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Canteen Operations</h3>
                      <div className="mt-2 text-xl font-black text-emerald-600 font-bold uppercase text-xs inline-block bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 mt-1">OPERATIONAL</div>
                      <p className="text-[10px] text-slate-400 mt-1.5">Inspected weekly</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Extra-Curricular Highlights</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      SSIET campus hosts regular cultural meets, annual sports day events, programming hackathons, workshops, and student counselling clinics to ensure comprehensive growth and mental health support.
                    </p>
                  </div>
                </Card>
              </div>
            )}

            {/* VIEW 12: EVENTS */}
            {currentView === "events" && (
              <div className="space-y-8 animate-fadeIn max-w-4xl">
                <Card variant="default" className="p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-blue-600" />
                      Academic & Cultural Events Scheduler
                    </h2>
                    <Button variant="primary" size="xs" onClick={() => alert("Schedule new event modal")}>
                      Schedule Event
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { date: "Aug 12, 2026", title: "Orientation Day Class of 2026", desc: "Welcoming engineering freshers with motivational assemblies, campus tours, and mentor alignment.", branch: "All Branches" },
                      { date: "Sep 20, 2026", title: "SSIET Technical Hackathon 3.0", desc: "48-hour prototype challenge on AI development and smart energy vectors.", branch: "CSE & ECE" },
                      { date: "Oct 15, 2026", title: "Annual Cultural Fest - Sukhamani Tarang", desc: "Zonal level competition of fine arts, music, dance performances and tech projects exhibition.", branch: "Open to All Colleges" },
                    ].map((evt, idx) => (
                      <div key={idx} className="p-5 border border-slate-200 bg-slate-50/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-blue-400 transition-colors">
                        <div>
                          <div className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider">{evt.date}</div>
                          <h3 className="font-bold text-slate-800 text-sm mt-1">{evt.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 max-w-xl">{evt.desc}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-wider border border-blue-100">
                            {evt.branch}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* VIEW 13: GALLERY */}
            {currentView === "gallery" && (
              <div className="space-y-8 animate-fadeIn max-w-4xl">
                <Card variant="default" className="p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-purple-600" />
                      Website Gallery Media Assets
                    </h2>
                    <Button variant="primary" size="xs" onClick={() => alert("Media uploader modal")}>
                      Upload Images
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {[
                      { title: "Main Campus Block", size: "1.4 MB", type: "JPEG" },
                      { title: "Robotics Laboratory", size: "2.1 MB", type: "PNG" },
                      { title: "Computer Engineering Lab", size: "940 KB", type: "JPEG" },
                      { title: "Sports Complex & Ground", size: "1.8 MB", type: "JPEG" },
                      { title: "Hostel Dining Area", size: "1.1 MB", type: "PNG" },
                      { title: "Central Library Reading Hall", size: "1.6 MB", type: "JPEG" },
                    ].map((media, idx) => (
                      <div key={idx} className="border border-slate-200 bg-slate-50/50 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                        <div className="w-full h-32 bg-slate-200 rounded-xl mb-3 flex items-center justify-center text-slate-400">
                          <Camera className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs truncate" title={media.title}>{media.title}</div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                            <span>{media.size}</span>
                            <span className="px-1 py-0.2 bg-slate-250 text-slate-650 rounded font-black text-[8px] uppercase">{media.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* VIEW 14: USERS */}
            {currentView === "users" && (
              <div className="space-y-8 animate-fadeIn max-w-4xl">
                <Card variant="default" className="p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-650" />
                      Administrator Accounts Directory
                    </h2>
                    <Button variant="primary" size="xs" onClick={() => alert("Add new administrator account modal")}>
                      Invite Administrator
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Administrator</TableHead>
                        <TableHead>Email ID</TableHead>
                        <TableHead>Role Designation</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "Super Admin", email: "divyadonga8897@gmail.com", role: "super_admin", date: "2026-08-01" },
                        { name: "Standard Administrator", email: "admin@ssiet.ac.in", role: "ADMIN", date: "2026-07-28" },
                      ].map((adm, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-bold text-slate-800">{adm.name}</TableCell>
                          <TableCell className="font-semibold text-slate-600 text-xs">{adm.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-wider ${
                              adm.role === "super_admin" 
                                ? "bg-amber-50 text-amber-700 border-amber-100" 
                                : "bg-blue-50 text-blue-700 border-blue-100"
                            }`}>
                              {adm.role}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-400 font-mono text-[10px]">{adm.date}</TableCell>
                          <TableCell className="text-right">
                            {adm.role !== "super_admin" && (
                              <Button variant="secondary" size="xs" className="text-red-500 hover:text-red-650 hover:bg-red-500/5 hover:border-red-100">Deactivate</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {/* VIEW 15: SETTINGS */}
            {currentView === "settings" && (
              <div className="space-y-8 max-w-xl animate-fadeIn">
                <Card variant="default" className="p-6 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm">
                  <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Settings className="w-5 h-5 text-slate-600" />
                    Admin Console System Settings
                  </h2>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Automatic Backup Database</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Export backup of system tables daily.</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Multi-Factor Authentication (MFA)</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Require OTP validation upon admin session creation.</div>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Maintenance Overlay Mode</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Show public maintenance banner on frontend portal.</div>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded cursor-pointer" />
                    </div>
                    <div className="pt-4 flex gap-4">
                      <Button variant="primary" onClick={() => alert("System settings applied successfully.")}>Apply Settings</Button>
                      <Button variant="secondary" onClick={() => alert("Restored default configs.")}>Restore Defaults</Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
