"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminService } from "@/services/adminService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";

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
  const [kbExpanded, setKbExpanded] = useState(true);

  const [knowledgeDocs, setKnowledgeDocs] = useState<any[]>([]);
  const [kbStats, setKbStats] = useState<any>(null);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbUploading, setKbUploading] = useState(false);
  const [kbUploadProgress, setKbUploadProgress] = useState(0);
  const [kbCategory, setKbCategory] = useState("General");

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

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

  return (
    <div>
      {/* Alert Banner Notification */}
      {alertMessage && (
        <div style={{ border: "1px solid red", padding: "10px", margin: "10px 0" }}>
          <strong>Notification:</strong> {alertMessage}
        </div>
      )}

      {/* Header Info Bar */}
      <header>
        <div>
          <h1>SSIET Console</h1>
          {currentUser && (
            <p>
              Logged in as: <strong>{currentUser.full_name}</strong> ({currentUser.role})
            </p>
          )}
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      {/* Sidebar Navigation & Tabs Selector */}
      <nav style={{ margin: "20px 0", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
        {[
          { id: "dashboard", label: "Overview" },
          { id: "college-info", label: "College Information" },
          { id: "departments", label: "Departments" },
          { id: "courses", label: "Courses" },
          { id: "fees", label: "Fees" },
          { id: "admissions", label: "Admissions" },
          { id: "scholarships", label: "Scholarships" },
          { id: "placements", label: "Placements" },
          { id: "campus-life", label: "Campus Life" },
          { id: "events", label: "Events" },
          { id: "gallery", label: "Gallery" },
          { id: "enquiries", label: "Contact Enquiries" },
          { id: "users", label: "Users" },
          { id: "settings", label: "Settings" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentView(tab.id);
              setEditingId(null);
            }}
            style={{
              marginRight: "10px",
              fontWeight: currentView === tab.id ? "bold" : "normal",
            }}
          >
            {tab.label}
          </button>
        ))}

        {currentUser?.role === "super_admin" && (
          <button
            onClick={() => {
              setCurrentView("knowledge-base");
              setEditingId(null);
            }}
            style={{
              marginRight: "10px",
              fontWeight: currentView === "knowledge-base" ? "bold" : "normal",
            }}
          >
            AI Knowledge Base [NEW]
          </button>
        )}
      </nav>

      {/* Main View Area */}
      <main>
        {loading ? (
          <div>Loading central console data...</div>
        ) : (
          <>
            {/* VIEW 1: CENTRAL OVERVIEW */}
            {currentView === "dashboard" && (
              <div>
                <h2>Overview Console</h2>
                {stats && (
                  <ul>
                    <li>Total Courses: {stats.courses}</li>
                    <li>Departments: {stats.departments}</li>
                    <li>Pending Enquiries: {stats.pending_enquiries}</li>
                    <li>Active Admins: {stats.admins}</li>
                  </ul>
                )}

                <h3>Audit Logs</h3>
                <ul>
                  {logs.map((log) => (
                    <li key={log.id}>
                      [{log.timestamp}] {log.username} ({log.role}): {log.action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* VIEW 2: DEPARTMENTS */}
            {currentView === "departments" && (
              <div>
                <h2>Departments Directory</h2>
                
                <h3>{editingId ? "Edit Department" : "Add Department"}</h3>
                <form onSubmit={subDept(onDeptSubmit)}>
                  <div>
                    <label>Code (ID):</label>
                    <input type="text" disabled={!!editingId} {...regDept("id")} />
                  </div>
                  <div>
                    <label>Name:</label>
                    <input type="text" {...regDept("name")} />
                  </div>
                  <div>
                    <label>HOD Name:</label>
                    <input type="text" {...regDept("hod")} />
                  </div>
                  <div>
                    <label>Description:</label>
                    <textarea {...regDept("description")} />
                  </div>
                  <button type="submit">Save Department</button>
                  {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancel</button>}
                </form>

                <h3>Department Listings</h3>
                <table border={1}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>HOD</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.departments_list?.map((dept: any) => (
                      <tr key={dept.id}>
                        <td>{dept.id}</td>
                        <td>{dept.name}</td>
                        <td>{dept.hod}</td>
                        <td>{dept.description}</td>
                        <td>
                          <button
                            onClick={() => {
                              setEditingId(dept.id);
                              setDeptValue("id", dept.id);
                              setDeptValue("name", dept.name);
                              setDeptValue("hod", dept.hod);
                              setDeptValue("description", dept.description);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 3: COURSES */}
            {currentView === "courses" && (
              <div>
                <h2>Academic Programs</h2>

                <h3>{editingId ? "Edit Course" : "Add Course"}</h3>
                <form onSubmit={subCourse(onCourseSubmit)}>
                  <div>
                    <label>Course Code:</label>
                    <input type="text" disabled={!!editingId} {...regCourse("id")} />
                  </div>
                  <div>
                    <label>Course Name:</label>
                    <input type="text" {...regCourse("name")} />
                  </div>
                  <div>
                    <label>Department:</label>
                    <select {...regCourse("dept_id")}>
                      <option value="">Select Department</option>
                      {stats?.departments_list?.map((d: any) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Duration:</label>
                    <input type="text" placeholder="e.g. 4 Years" {...regCourse("duration")} />
                  </div>
                  <div>
                    <label>Intake Seats:</label>
                    <input type="number" {...regCourse("intake", { valueAsNumber: true })} />
                  </div>
                  <button type="submit">Save Course</button>
                  {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancel</button>}
                </form>

                <h3>Course Listings</h3>
                <table border={1}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Duration</th>
                      <th>Intake</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.courses_list?.map((course: any) => (
                      <tr key={course.id}>
                        <td>{course.id}</td>
                        <td>{course.name}</td>
                        <td>{course.dept_id}</td>
                        <td>{course.duration}</td>
                        <td>{course.intake}</td>
                        <td>
                          <button
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
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 4: FEES */}
            {currentView === "fees" && (
              <div>
                <h2>Fee Configurations</h2>

                <h3>{editingId ? "Edit Fee Structure" : "Add Fee Structure"}</h3>
                <form onSubmit={subFee(onFeeSubmit)}>
                  {!editingId && (
                    <>
                      <div>
                        <label>Course Select:</label>
                        <select {...regFee("course_id")}>
                          <option value="">Select Course</option>
                          {stats?.courses_list?.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Academic Year:</label>
                        <input type="text" placeholder="2026-27" {...regFee("academic_year")} />
                      </div>
                      <div>
                        <label>Fee Type Allocation:</label>
                        <select {...regFee("fee_type")}>
                          <option value="Convener">Convener Quota</option>
                          <option value="Management">Management Quota</option>
                          <option value="Scholarship">Scholarship Reserved</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div>
                    <label>Tuition Fee (INR):</label>
                    <input type="number" {...regFee("tuition", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <label>Hostel Fee (INR):</label>
                    <input type="number" {...regFee("hostel", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <label>Other Miscellaneous Fee:</label>
                    <input type="number" {...regFee("other", { valueAsNumber: true })} />
                  </div>
                  <button type="submit">Save Fee Parameter</button>
                  {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancel</button>}
                </form>

                <h3>Fee Structure Registry</h3>
                <table border={1}>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Year</th>
                      <th>Tuition</th>
                      <th>Hostel</th>
                      <th>Other</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.fees_list?.map((fee: any) => (
                      <tr key={fee.id}>
                        <td>{fee.course_id}</td>
                        <td>{fee.academic_year}</td>
                        <td>{fee.tuition}</td>
                        <td>{fee.hostel}</td>
                        <td>{fee.other}</td>
                        <td>{fee.fee_type}</td>
                        <td>
                          <button onClick={() => setEditingId(fee.id)}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 5: CONTACT ENQUIRIES */}
            {currentView === "enquiries" && (
              <div>
                <h2>Contact Enquiries Inbox</h2>
                <table border={1}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Applicant Name</th>
                      <th>Email ID</th>
                      <th>Phone</th>
                      <th>Subject / Query Details</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => (
                      <tr key={enq.id}>
                        <td>{enq.created_at}</td>
                        <td>{enq.name}</td>
                        <td>{enq.email}</td>
                        <td>{enq.phone}</td>
                        <td>{enq.subject}: {enq.message}</td>
                        <td>{enq.status}</td>
                        <td>
                          {enq.status !== "RESOLVED" && (
                            <button onClick={() => handleEnquiryStatus(enq.id, "RESOLVED")}>
                              Mark Resolved
                            </button>
                          )}
                          {enq.status !== "PENDING" && (
                            <button onClick={() => handleEnquiryStatus(enq.id, "PENDING")}>
                              Mark Pending
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 6: KNOWLEDGE BASE (SUPER ADMIN ONLY) */}
            {currentView === "knowledge-base" && currentUser?.role === "super_admin" && (
              <div>
                <h2>AI Knowledge Base</h2>

                {/* Upload Section */}
                <div id="kb-upload-section" style={{ border: "1px dashed #777", padding: "20px", margin: "10px 0" }}>
                  <h3>Upload Document File</h3>
                  <div>
                    <label>Category Group:</label>
                    <select value={kbCategory} onChange={(e) => setKbCategory(e.target.value)}>
                      <option value="General">General</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Fees">Fees</option>
                      <option value="Courses">Courses</option>
                      <option value="Scholarships">Scholarships</option>
                      <option value="Placements">Placements</option>
                      <option value="Campus Life">Campus Life</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept=".txt,.md,.pdf,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleKbFileUpload(file);
                      }}
                      disabled={kbUploading}
                    />
                  </div>
                  {kbUploading && <div>Uploading file: {kbUploadProgress}%</div>}
                </div>

                {/* Statistics Cards */}
                <div id="kb-chunks-card">
                  <h3>Document Statistics</h3>
                  {kbStats && (
                    <ul>
                      <li>Total Document Inventory: {kbStats.total_documents}</li>
                      <li>Pinecone Chunk Statistics: {kbStats.total_chunks} vectors indexed</li>
                      <li>Success Rate: {kbStats.success_rate}%</li>
                    </ul>
                  )}
                </div>

                {/* Document Inventory */}
                <div id="kb-inventory-section">
                  <h3>Uploaded Document Inventory</h3>
                  {kbLoading ? (
                    <div>Loading knowledge base documents...</div>
                  ) : (
                    <table border={1}>
                      <thead>
                        <tr>
                          <th>Filename</th>
                          <th>Category</th>
                          <th>Upload Date</th>
                          <th>Total Chunks</th>
                          <th>Indexing Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {knowledgeDocs.map((doc) => (
                          <tr key={doc.id}>
                            <td>{doc.filename}</td>
                            <td>{doc.category}</td>
                            <td>{doc.upload_date}</td>
                            <td>{doc.chunk_count}</td>
                            <td>{doc.status}</td>
                            <td>
                              <button onClick={() => handleKbDocReindex(doc.id)}>Reindex</button>
                              <button onClick={() => handleKbDocDelete(doc.id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 7: COLLEGE INFO */}
            {currentView === "college-info" && (
              <div>
                <h2>College Information Configuration</h2>
                <form onSubmit={(e) => { e.preventDefault(); alert("College Parameters Saved Successfully!"); }}>
                  <div>
                    <label>College Name:</label>
                    <input type="text" defaultValue="Sri Sukhmani Institute of Engineering & Technology" />
                  </div>
                  <div>
                    <label>Short Code:</label>
                    <input type="text" defaultValue="SSIET" />
                  </div>
                  <div>
                    <label>Accreditation:</label>
                    <input type="text" defaultValue="NAAC A+ Accredited" />
                  </div>
                  <div>
                    <label>Affiliation:</label>
                    <input type="text" defaultValue="IKG Punjab Technical University" />
                  </div>
                  <div>
                    <label>Established Year:</label>
                    <input type="text" defaultValue="1998" />
                  </div>
                  <button type="submit">Save Parameters</button>
                </form>
              </div>
            )}

            {/* VIEW 8: ADMISSIONS */}
            {currentView === "admissions" && (
              <div>
                <h2>Admissions Board</h2>
                <ul>
                  <li>Admission Status: OPEN (Academic Year 2026-27)</li>
                  <li>Active Applications: 342</li>
                  <li>Allocated Seats: 68%</li>
                </ul>
                <h3>Recent Applicants</h3>
                <table border={1}>
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Course</th>
                      <th>Marks %</th>
                      <th>Quota</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Rahul Sharma", course: "B.Tech CSE", marks: "94.2%", quota: "Convener", status: "Approved" },
                      { name: "Priya Patel", course: "B.Tech ECE", marks: "88.6%", quota: "Management", status: "Pending Review" },
                      { name: "Aman Preet Singh", course: "B.Tech ME", marks: "76.4%", quota: "Convener", status: "Under Screening" },
                    ].map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.course}</td>
                        <td>{item.marks}</td>
                        <td>{item.quota}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 9: SCHOLARSHIPS */}
            {currentView === "scholarships" && (
              <div>
                <h2>Scholarships & Grants Registry</h2>
                <table border={1}>
                  <thead>
                    <tr>
                      <th>Scheme / Program</th>
                      <th>Eligibility</th>
                      <th>Coverage</th>
                      <th>Active Enrolments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { title: "Merit Scholarship", criteria: "Marks >= 95% in Class XII", coverage: "100% Tuition Fee Waiver", count: 48 },
                      { title: "PTU State Level Waiver", criteria: "Rank < 5000 in PTU Entrance", coverage: "50% Tuition Fee Waiver", count: 112 },
                      { title: "Sports Excellence Grant", criteria: "National / Zonal Level Medallist", coverage: "Free Hostel + 25% Tuition Waiver", count: 18 },
                    ].map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.title}</td>
                        <td>{item.criteria}</td>
                        <td>{item.coverage}</td>
                        <td>{item.count} students</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 10: PLACEMENTS */}
            {currentView === "placements" && (
              <div>
                <h2>Campus Placements</h2>
                <ul>
                  <li>Placement Rate: 94.2%</li>
                  <li>Highest Package: 28.5 LPA</li>
                  <li>Average Package: 5.8 LPA</li>
                </ul>
                <h3>Top Recruiter Partners</h3>
                <ul>
                  {["Infosys", "Wipro", "TCS", "Cognizant", "Capgemini", "L&T Infotech", "HCL Technologies", "Adobe"].map((recruiter) => (
                    <li key={recruiter}>{recruiter}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* VIEW 11: CAMPUS LIFE */}
            {currentView === "campus-life" && (
              <div>
                <h2>Campus Amenities & Hostels</h2>
                <ul>
                  <li>Boys Hostel: 450 / 500 occupied</li>
                  <li>Girls Hostel: 220 / 300 occupied</li>
                  <li>Canteen: OPERATIONAL</li>
                </ul>
              </div>
            )}

            {/* VIEW 12: EVENTS */}
            {currentView === "events" && (
              <div>
                <h2>Events Scheduler</h2>
                <ul>
                  {[
                    { date: "Aug 12, 2026", title: "Orientation Day Class of 2026", branch: "All Branches" },
                    { date: "Sep 20, 2026", title: "SSIET Technical Hackathon 3.0", branch: "CSE & ECE" },
                    { date: "Oct 15, 2026", title: "Annual Cultural Fest - Sukhamani Tarang", branch: "Open to All Colleges" },
                  ].map((evt, idx) => (
                    <li key={idx}>
                      <strong>{evt.date}</strong> - {evt.title} ({evt.branch})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* VIEW 13: GALLERY */}
            {currentView === "gallery" && (
              <div>
                <h2>Media Gallery</h2>
                <ul>
                  {["Main Campus Block", "Robotics Laboratory", "Computer Engineering Lab", "Sports Complex", "Hostel Dining Area"].map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* VIEW 14: USERS */}
            {currentView === "users" && (
              <div>
                <h2>Administrator Accounts</h2>
                <table border={1}>
                  <thead>
                    <tr>
                      <th>Administrator</th>
                      <th>Email ID</th>
                      <th>Role Designation</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Super Admin", email: "divyadonga8897@gmail.com", role: "super_admin", date: "2026-08-01" },
                      { name: "Standard Administrator", email: "admin@ssiet.ac.in", role: "ADMIN", date: "2026-07-28" },
                    ].map((adm, idx) => (
                      <tr key={idx}>
                        <td>{adm.name}</td>
                        <td>{adm.email}</td>
                        <td>{adm.role}</td>
                        <td>{adm.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 15: SETTINGS */}
            {currentView === "settings" && (
              <div>
                <h2>System Settings</h2>
                <form onSubmit={(e) => { e.preventDefault(); alert("System settings applied successfully."); }}>
                  <div>
                    <label>
                      <input type="checkbox" defaultChecked /> Automatic Backup Database
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" /> Multi-Factor Authentication (MFA)
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" /> Maintenance Overlay Mode
                    </label>
                  </div>
                  <button type="submit">Apply Settings</button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
