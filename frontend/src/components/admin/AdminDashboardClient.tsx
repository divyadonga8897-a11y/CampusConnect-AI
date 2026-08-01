"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminService } from "@/services/adminService";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { 
  GraduationCap, LayoutDashboard, Building2, BookOpen, Coins, Mail, 
  Database, Settings, Users, LogOut, CheckCircle2, AlertTriangle, 
  Trash2, RefreshCw, UploadCloud, ShieldAlert
} from "lucide-react";

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
  
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [knowledgeDocs, setKnowledgeDocs] = useState<any[]>([]);
  const [kbStats, setKbStats] = useState<any>(null);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbUploading, setKbUploading] = useState(false);
  const [kbUploadProgress, setKbUploadProgress] = useState(0);
  const [kbCategory, setKbCategory] = useState("General");

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const [selectedDocForChunks, setSelectedDocForChunks] = useState<any>(null);
  const [chunksList, setChunksList] = useState<string[]>([]);
  const [chunksLoading, setChunksLoading] = useState(false);
  const [searchLogs, setSearchLogs] = useState<any[]>([]);
  const [searchLogsLoading, setSearchLogsLoading] = useState(false);

  useEffect(() => {
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

  const loadSearchHistory = async () => {
    setSearchLogsLoading(true);
    const res = await adminService.getSearchHistory();
    setSearchLogsLoading(false);
    if (res.success) {
      setSearchLogs(res.data || []);
    } else {
      triggerAlert(res.error || "Failed to load search history", "error");
    }
  };

  const handleViewChunks = async (doc: any) => {
    setSelectedDocForChunks(doc);
    setChunksLoading(true);
    setChunksList([]);
    const res = await adminService.getDocumentChunks(doc.id);
    setChunksLoading(false);
    if (res.success) {
      setChunksList(res.data || []);
    } else {
      triggerAlert(res.error || "Failed to load chunks", "error");
      setSelectedDocForChunks(null);
    }
  };

  useEffect(() => {
    if (currentView === "knowledge-base") {
      loadKnowledgeData();
    } else if (currentView === "search-history") {
      loadSearchHistory();
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

  const handleKbDocReindex = async (id: string) => {
    triggerAlert("Re-indexing started...");
    const res = await adminService.reindexKnowledgeDocument(id);
    if (res.success) {
      triggerAlert("Document re-indexing triggered!");
      loadKnowledgeData();
    } else {
      triggerAlert(res.error || "Failed to start re-indexing", "error");
    }
  };

  const handleKbDocDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document and all its indexed vectors from Pinecone? This action cannot be undone.")) return;
    const res = await adminService.deleteKnowledgeDocument(id);
    if (res.success) {
      triggerAlert("Document deleted and purged from Pinecone!");
      loadKnowledgeData();
    } else {
      triggerAlert(res.error || "Failed to delete document", "error");
    }
  };

  const handleKbFileUpload = async (file: File) => {
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

  const [editingId, setEditingId] = useState<string | null>(null);

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

  const sidebarMenu = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "fees", label: "Fees Config", icon: Coins },
    { id: "enquiries", label: "Contact Inbox", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Alert Banner Notification */}
      {alertMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl border shadow-lg ${
          alertType === "success" 
            ? "bg-green-50 border-green-100 text-green-700" 
            : "bg-red-50 border-red-100 text-red-700"
        }`}>
          {alertType === "success" ? <CheckCircle2 className="w-4.5 h-4.5" /> : <ShieldAlert className="w-4.5 h-4.5" />}
          <span className="text-[10px] font-bold uppercase tracking-wider">{alertMessage}</span>
        </div>
      )}

      {/* Header Info Bar */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h1 className="font-display font-extrabold text-sm text-text-dark leading-none">SSIET Admin Portal</h1>
            <p className="text-[9px] text-text-gray font-medium pt-1">Sri Satya Institute of Engineering & Technology</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-text-dark">{currentUser.full_name}</span>
              <span className="text-[9px] font-bold text-text-gray/80 uppercase tracking-wider">{currentUser.role}</span>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-text-gray hover:text-red-600 transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace layout */}
      <div className="flex-grow flex flex-col md:flex-row">
        
        {/* Left Console Sidebar Menu */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200/60 p-6 flex flex-col justify-between shrink-0 space-y-6">
          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-gray/60 block text-left">
              Console Navigation
            </span>
            <nav className="flex flex-row md:flex-col flex-wrap gap-1">
              {sidebarMenu.map((item) => {
                const MenuIcon = item.icon;
                const active = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      active 
                        ? "bg-blue-50 text-primary shadow-sm shadow-blue-500/5 font-extrabold" 
                        : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                    }`}
                  >
                    <MenuIcon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}

              {currentUser?.role === "super_admin" && (
                <>
                  <button
                    onClick={() => {
                      setCurrentView("knowledge-base");
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      currentView === "knowledge-base"
                        ? "bg-indigo-50 text-indigo-700 shadow-sm font-extrabold"
                        : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                    }`}
                  >
                    <Database className="w-4 h-4 shrink-0" />
                    AI Knowledge Base
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView("rag-flow");
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      currentView === "rag-flow"
                        ? "bg-indigo-50 text-indigo-700 shadow-sm font-extrabold"
                        : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                    }`}
                  >
                    <RefreshCw className="w-4 h-4 shrink-0" />
                    How RAG Works
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView("search-history");
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      currentView === "search-history"
                        ? "bg-indigo-50 text-indigo-700 shadow-sm font-extrabold"
                        : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                    }`}
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    Search History
                  </button>
                </>
              )}
            </nav>
          </div>
        </aside>

        {/* Right Content Workplace */}
        <main className="flex-1 p-6 sm:p-8 min-w-0">
          {loading ? (
            <div className="h-44 flex items-center justify-center text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">
              Loading Central Console Data...
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* VIEW 1: OVERVIEW */}
              {currentView === "dashboard" && stats && (
                <div className="space-y-6">
                  {/* Summary Metric Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                      <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Total Courses</h4>
                      <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{stats.courses}</h3>
                    </div>
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                      <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Departments</h4>
                      <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{stats.departments}</h3>
                    </div>
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                      <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Pending Enquiries</h4>
                      <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{stats.pending_enquiries}</h3>
                    </div>
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                      <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Active Admins</h4>
                      <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{stats.admins}</h3>
                    </div>
                  </div>

                  {/* Audit Logs activities */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Administrative Audit Logs</h3>
                    </CardHeader>
                    <CardBody className="space-y-3 max-h-[400px] overflow-y-auto">
                      {logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/20 text-left text-xs font-sans">
                          <Badge color="blue" className="shrink-0 mt-0.5">{log.role}</Badge>
                          <div className="flex-1 space-y-1">
                            <p className="text-text-dark font-medium leading-relaxed">{log.action}</p>
                            <div className="flex items-center gap-2 text-[10px] text-text-gray/70">
                              <span>Actor: <strong>{log.username}</strong></span>
                              <span>•</span>
                              <span>Timestamp: {log.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                </div>
              )}

              {/* VIEW 2: DEPARTMENTS */}
              {currentView === "departments" && (
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Department form */}
                  <div className="lg:col-span-4">
                    <Card className="p-6 text-left space-y-5">
                      <h3 className="font-display font-extrabold text-sm text-text-dark border-b border-slate-100 pb-2">
                        {editingId ? "Edit Department" : "Add Department"}
                      </h3>
                      <form onSubmit={subDept(onDeptSubmit)} className="space-y-4">
                        <Input label="Code (ID)" disabled={!!editingId} {...regDept("id")} />
                        <Input label="Name" {...regDept("name")} />
                        <Input label="HOD Name" {...regDept("hod")} />
                        <Textarea label="Description" {...regDept("description")} />
                        <Button type="submit" fullWidth>Save Department</Button>
                        {editingId && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            fullWidth 
                            onClick={() => { setEditingId(null); resDept(); }}
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </form>
                    </Card>
                  </div>

                  {/* Listings table */}
                  <div className="lg:col-span-8">
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Department Listings</h3>
                      </CardHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>HOD</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats?.departments_list?.map((dept: any) => (
                            <TableRow key={dept.id}>
                              <TableCell className="font-bold text-primary font-mono">{dept.id}</TableCell>
                              <TableCell className="font-bold text-text-dark">{dept.name}</TableCell>
                              <TableCell>{dept.hod}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingId(dept.id);
                                    setDeptValue("id", dept.id);
                                    setDeptValue("name", dept.name);
                                    setDeptValue("hod", dept.hod);
                                    setDeptValue("description", dept.description);
                                  }}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </div>
              )}

              {/* VIEW 3: COURSES */}
              {currentView === "courses" && (
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Course Form */}
                  <div className="lg:col-span-4">
                    <Card className="p-6 text-left space-y-5">
                      <h3 className="font-display font-extrabold text-sm text-text-dark border-b border-slate-100 pb-2">
                        {editingId ? "Edit Course" : "Add Course"}
                      </h3>
                      <form onSubmit={subCourse(onCourseSubmit)} className="space-y-4">
                        <Input label="Course Code" disabled={!!editingId} {...regCourse("id")} />
                        <Input label="Course Name" {...regCourse("name")} />
                        <div className="flex flex-col gap-1.5">
                          <label className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
                            Department
                          </label>
                          <select 
                            {...regCourse("dept_id")}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-sans bg-white focus:outline-none focus:border-primary"
                          >
                            <option value="">Select Department</option>
                            {stats?.departments_list?.map((d: any) => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <Input label="Duration" placeholder="e.g. 4 Years" {...regCourse("duration")} />
                        <Input label="Intake Seats" type="number" {...regCourse("intake", { valueAsNumber: true })} />
                        <Button type="submit" fullWidth>Save Course</Button>
                        {editingId && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            fullWidth 
                            onClick={() => { setEditingId(null); resCourse(); }}
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </form>
                    </Card>
                  </div>

                  {/* Listings Table */}
                  <div className="lg:col-span-8">
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Academic Programs List</h3>
                      </CardHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Seats</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats?.courses_list?.map((course: any) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-bold font-mono text-primary">{course.id}</TableCell>
                              <TableCell className="font-bold text-text-dark">{course.name}</TableCell>
                              <TableCell>{course.duration}</TableCell>
                              <TableCell>{course.intake}</TableCell>
                              <TableCell>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setEditingId(course.id);
                                    setCourseValue("id", course.id);
                                    setCourseValue("name", course.name);
                                    setCourseValue("dept_id", course.dept_id);
                                    setCourseValue("duration", course.duration);
                                    setCourseValue("intake", course.intake);
                                  }}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </div>
              )}

              {/* VIEW 4: FEES */}
              {currentView === "fees" && (
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Fee Form */}
                  <div className="lg:col-span-4">
                    <Card className="p-6 text-left space-y-5">
                      <h3 className="font-display font-extrabold text-sm text-text-dark border-b border-slate-100 pb-2">
                        {editingId ? "Edit Fee Structure" : "Add Fee Structure"}
                      </h3>
                      <form onSubmit={subFee(onFeeSubmit)} className="space-y-4">
                        {!editingId && (
                          <>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
                                Course Select
                              </label>
                              <select 
                                {...regFee("course_id")}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-sans bg-white focus:outline-none focus:border-primary"
                              >
                                <option value="">Select Course</option>
                                {stats?.courses_list?.map((c: any) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <Input label="Academic Year" placeholder="2026-27" {...regFee("academic_year")} />
                            <div className="flex flex-col gap-1.5">
                              <label className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
                                Allocation Quota
                              </label>
                              <select 
                                {...regFee("fee_type")}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-sans bg-white focus:outline-none focus:border-primary"
                              >
                                <option value="Convener">Convener Quota</option>
                                <option value="Management">Management Quota</option>
                                <option value="Scholarship">Scholarship Reserved</option>
                              </select>
                            </div>
                          </>
                        )}
                        <Input label="Tuition Fee (INR)" type="number" {...regFee("tuition", { valueAsNumber: true })} />
                        <Input label="Hostel Fee (INR)" type="number" {...regFee("hostel", { valueAsNumber: true })} />
                        <Input label="Other Fee (INR)" type="number" {...regFee("other", { valueAsNumber: true })} />
                        <Button type="submit" fullWidth>Save Fee Config</Button>
                        {editingId && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            fullWidth 
                            onClick={() => { setEditingId(null); resFee(); }}
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </form>
                    </Card>
                  </div>

                  {/* Listings Table */}
                  <div className="lg:col-span-8">
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Fee Configurations Registry</h3>
                      </CardHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Tuition</TableHead>
                            <TableHead>Hostel</TableHead>
                            <TableHead>Other</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats?.fees_list?.map((fee: any) => (
                            <TableRow key={fee.id}>
                              <TableCell className="font-bold text-text-dark">{fee.course_id}</TableCell>
                              <TableCell>{fee.academic_year}</TableCell>
                              <TableCell className="font-mono text-primary font-bold">₹{fee.tuition}</TableCell>
                              <TableCell className="font-mono">₹{fee.hostel}</TableCell>
                              <TableCell className="font-mono">₹{fee.other}</TableCell>
                              <TableCell>
                                <Badge color="blue">{fee.fee_type}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </div>
              )}

              {/* VIEW 5: CONTACT ENQUIRIES */}
              {currentView === "enquiries" && (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Applicant Enquiries Inbox</h3>
                  </CardHeader>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Subject / Query Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enquiries.map((enq) => (
                        <TableRow key={enq.id}>
                          <TableCell className="text-[10px] text-text-gray/70">{enq.created_at?.split("T")[0]}</TableCell>
                          <TableCell className="font-bold text-text-dark">{enq.name}</TableCell>
                          <TableCell className="text-[10px]">
                            <p>{enq.email}</p>
                            <p className="text-text-gray/70">{enq.phone}</p>
                          </TableCell>
                          <TableCell className="text-left max-w-sm">
                            <p className="font-bold text-text-dark">{enq.subject}</p>
                            <p className="text-text-gray text-[10px] leading-relaxed pt-0.5">{enq.message}</p>
                          </TableCell>
                          <TableCell>
                            <Badge color={enq.status === "RESOLVED" ? "green" : "amber"}>
                              {enq.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {enq.status !== "RESOLVED" && (
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => handleEnquiryStatus(enq.id, "RESOLVED")}
                                >
                                  Resolve
                                </Button>
                              )}
                              {enq.status !== "PENDING" && (
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => handleEnquiryStatus(enq.id, "PENDING")}
                                >
                                  Mark Pending
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

              {/* VIEW 6: KNOWLEDGE BASE */}
              {currentView === "knowledge-base" && currentUser?.role === "super_admin" && (
                <div className="space-y-6">
                  
                  {/* Upload document parameters */}
                  <div className="grid lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Upload and Stats */}
                    <div className="lg:col-span-5 space-y-6">
                      <Card className="p-6 text-left space-y-4">
                        <h3 className="font-display font-extrabold text-sm text-indigo-700 flex items-center gap-2">
                          <UploadCloud className="w-5 h-5 text-indigo-600 animate-pulse" /> Upload RAG Document
                        </h3>
                        <p className="text-[10px] text-text-gray leading-relaxed">
                          Drag and drop or select a file to ingest into the Pinecone Vector Database. Document contents will be parsed and indexed.
                        </p>
                        
                        <div className="space-y-3.5">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
                              Category Group
                            </label>
                            <select 
                              value={kbCategory} 
                              onChange={(e) => setKbCategory(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-sans bg-white focus:outline-none focus:border-primary"
                            >
                              <option value="General">General Info</option>
                              <option value="Admissions">Admissions</option>
                              <option value="Fees">Fees & Quotas</option>
                              <option value="Courses">Courses & Syllabus</option>
                              <option value="Scholarships">Scholarships</option>
                              <option value="Placements">Placements</option>
                              <option value="Campus Life">Campus Life</option>
                            </select>
                          </div>

                          <div className="relative border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors p-6 rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-50/50">
                            <UploadCloud className="w-8 h-8 text-slate-400" />
                            <input
                              type="file"
                              accept=".txt,.md,.pdf,.docx"
                              disabled={kbUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleKbFileUpload(file);
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Select File</span>
                            <span className="text-[9px] text-text-gray/60">PDF, DOCX, TXT, MD up to 5MB</span>
                          </div>

                          {kbUploading && (
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-primary">
                                <span>Ingesting Document...</span>
                                <span>{kbUploadProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${kbUploadProgress}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>

                      {/* Pinecone metadata */}
                      <Card className="p-6 text-left">
                        <h3 className="font-display font-extrabold text-sm text-text-dark mb-4">Vector Database Metadata</h3>
                        {kbStats && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                              <span className="text-[9px] font-bold text-text-gray/80 uppercase">Total Files</span>
                              <h4 className="text-xl font-display font-extrabold text-text-dark pt-1">{kbStats.total_documents}</h4>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                              <span className="text-[9px] font-bold text-text-gray/80 uppercase">Active Vectors</span>
                              <h4 className="text-xl font-display font-extrabold text-text-dark pt-1">{kbStats.total_chunks}</h4>
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>

                    {/* Right: Listings Table */}
                    <div className="lg:col-span-7">
                      <Card className="overflow-hidden">
                        <CardHeader>
                          <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Uploaded Document Inventory</h3>
                        </CardHeader>
                        {kbLoading ? (
                          <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">Loading Inventory...</div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Filename</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Chunks</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {knowledgeDocs.map((doc) => (
                                <TableRow key={doc.id}>
                                  <TableCell className="font-bold text-text-dark text-left truncate max-w-[150px]">{doc.filename}</TableCell>
                                  <TableCell><Badge color="blue">{doc.category}</Badge></TableCell>
                                  <TableCell className="font-mono font-bold text-xs">{doc.chunk_count || 0}</TableCell>
                                  <TableCell>
                                    <Badge color={doc.status === "Processed" || doc.status === "Indexed" ? "green" : doc.status === "Processing" ? "amber" : "red"}>
                                      {doc.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-1.5 justify-end">
                                      <button 
                                        onClick={() => handleViewChunks(doc)}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-text-gray hover:text-indigo-600 transition-colors cursor-pointer"
                                        title="View Chunks"
                                        disabled={doc.status !== "Processed" && doc.status !== "Indexed"}
                                      >
                                        <BookOpen className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleKbDocReindex(doc.id)}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-text-gray hover:text-primary transition-colors cursor-pointer"
                                        title="Reindex Vectors"
                                      >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleKbDocDelete(doc.id)}
                                        className="p-1.5 hover:bg-red-50 rounded-lg text-text-gray hover:text-red-600 transition-colors cursor-pointer"
                                        title="Purge vectors & delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </Card>
                    </div>

                  </div>

                  {/* RAG System Parameters Ingestion Config */}
                  <Card className="p-6 text-left space-y-4 mt-6">
                    <h3 className="font-display font-extrabold text-sm text-text-dark">RAG Splitter & Embeddings Configuration</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="text-[9px] font-bold text-text-gray/80 uppercase">Embedding Model</span>
                        <p className="font-bold text-text-dark pt-1">multilingual-e5-large</p>
                        <p className="text-[9px] text-text-gray/60">1024 dimensions</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="text-[9px] font-bold text-text-gray/80 uppercase">Max Chunk Size</span>
                        <p className="font-bold text-text-dark pt-1">1,000 characters</p>
                        <p className="text-[9px] text-text-gray/60">Recursive Text Splitting</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="text-[9px] font-bold text-text-gray/80 uppercase">Chunk Overlap</span>
                        <p className="font-bold text-text-dark pt-1">200 characters</p>
                        <p className="text-[9px] text-text-gray/60">Preserves text boundary</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="text-[9px] font-bold text-text-gray/80 uppercase">Query Top K retrieve</span>
                        <p className="font-bold text-text-dark pt-1">5 matched chunks</p>
                        <p className="text-[9px] text-text-gray/60">Similarity score threshold ≥ 0.5</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* VIEW 7: HOW RAG WORKS FLOW SCHEMATIC */}
              {currentView === "rag-flow" && currentUser?.role === "super_admin" && (
                <div className="space-y-6 text-left animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-base text-text-dark">How the RAG Pipeline Works</h2>
                      <p className="text-[10px] text-text-gray font-medium">Technical workflow of vector ingestion, recursive chunking, and similarity semantic retrieval</p>
                    </div>
                  </div>

                  {/* Flow Schematic Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    
                    {/* Panel A: Ingestion Flow */}
                    <Card className="p-6 space-y-6">
                      <h3 className="font-display font-extrabold text-sm text-indigo-700 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-indigo-600" /> Phase 1: Document Ingestion Flow
                      </h3>
                      
                      <div className="space-y-4 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 z-0" />

                        {/* Step 1 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            1
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Document Upload</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              Admin uploads a syllabus, placements statistics, or fee schedule document (.pdf, .docx, .txt, .md).
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            2
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Text Extraction & Normalization</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              Backend extracts raw text sequences and structures, eliminating page numbers or redundant whitespace.
                            </p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            3
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Recursive Text Chunking</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              Paragraphs are recursively split into text chunks of maximum <strong>1,000 characters</strong> with a <strong>200 characters overlap</strong>. This overlap ensures key semantic context is not lost at block boundaries.
                            </p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            4
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Vector Generation & Index Ingestion</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              Each chunk is processed through the <code>multilingual-e5-large</code> model to generate 1024-dimensional float vectors, which are upserted into the <strong>Pinecone</strong> vector index.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Panel B: Retrieval Flow */}
                    <Card className="p-6 space-y-6">
                      <h3 className="font-display font-extrabold text-sm text-indigo-700 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" /> Phase 2: RAG Query Retrieval Flow
                      </h3>

                      <div className="space-y-4 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 z-0" />

                        {/* Step 1 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            1
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">User Prompts AI</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              A visitor submits a prompt in the chatbot drawer, e.g. <em>"What are the hostel rules for boys?"</em>
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            2
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Semantic Similarity Match</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              The prompt is converted to a vector and compared against the Pinecone Index. The system retrieves the <strong>top 5 most similar chunks</strong> with a similarity threshold ≥ 0.5.
                            </p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            3
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Context Construction</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              The retrieved context chunks are assembled into a structured system prompt, mapping direct citations to the original document sources.
                            </p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            4
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">LLM Synthesis & Response Stream</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              The LLM (Groq Llama-3.1) compiles the facts and streams a verified response containing source file links back to the user.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                  </div>
                </div>
              )}

              {/* VIEW 8: SEARCH HISTORY */}
              {currentView === "search-history" && currentUser?.role === "super_admin" && (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Visitor Search & RAG Response History</h3>
                  </CardHeader>
                  {searchLogsLoading ? (
                    <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">
                      Retrieving search histories...
                    </div>
                  ) : searchLogs.length === 0 ? (
                    <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest">
                      No search logs recorded.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead className="w-[240px]">User Query</TableHead>
                            <TableHead>RAG Responded Information</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {searchLogs.map((log) => (
                            <TableRow key={log.id} className="align-top">
                              <TableCell className="font-mono text-[10px] text-text-gray/80 pt-4">
                                {log.timestamp}
                              </TableCell>
                              <TableCell className="font-bold text-text-dark text-left pt-4 leading-relaxed whitespace-normal break-words max-w-[240px]">
                                {log.query}
                              </TableCell>
                              <TableCell className="text-left text-text-gray text-[11px] pt-4 leading-relaxed whitespace-pre-wrap break-words">
                                {log.response}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </Card>
              )}

            </div>
          )}
        </main>

      </div>

      {/* Document Chunks View Overlay Modal */}
      {selectedDocForChunks && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="text-left">
                <h3 className="font-display font-extrabold text-sm text-text-dark">
                  Document Chunks: {selectedDocForChunks.filename}
                </h3>
                <p className="text-[10px] text-text-gray font-medium">
                  Showing {chunksList.length} chunks extracted using 1000/200 split size.
                </p>
              </div>
              <button 
                onClick={() => setSelectedDocForChunks(null)}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto py-4 space-y-3.5">
              {chunksLoading ? (
                <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">
                  Parsing chunks from document...
                </div>
              ) : chunksList.length === 0 ? (
                <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest">
                  No chunks extracted.
                </div>
              ) : (
                chunksList.map((chunk, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-left space-y-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700">
                      CHUNK #{idx + 1}
                    </span>
                    <p className="text-[11px] leading-relaxed text-text-dark font-mono bg-white p-3 rounded-lg border border-slate-200/50 select-all whitespace-pre-wrap">
                      {chunk}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
