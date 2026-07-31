interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getHeaders(isMultipart = false) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const adminService = {
  login: async (email: string, password: string): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Authentication failed");
      
      if (json.data?.access_token) {
        localStorage.setItem("admin_token", json.data.access_token);
        localStorage.setItem("admin_role", json.data.user_role);
      }
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message || "Connection error" };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Session expired");
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message || "Unauthorized" };
    }
  },

  logout: async (): Promise<ApiResponse<any>> => {
    try {
      await fetch(`${API_BASE}/api/v1/auth/logout`, {
        method: "POST",
        headers: getHeaders(),
      });
    } catch {}
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    return { success: true, data: {} };
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/cms/dashboard-stats`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  getLogs: async (): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/cms/logs`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  updateCollege: async (name: string, description: string): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      const res = await fetch(`${API_BASE}/api/v1/cms/college`, {
        method: "PUT",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // CRUD Departments
  createDepartment: async (id: string, name: string, description: string, hod: string): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("name", name);
      fd.append("description", description);
      fd.append("hod", hod);
      const res = await fetch(`${API_BASE}/api/v1/cms/departments`, {
        method: "POST",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  updateDepartment: async (id: string, name: string, description: string, hod: string): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      fd.append("hod", hod);
      const res = await fetch(`${API_BASE}/api/v1/cms/departments/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  deleteDepartment: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/cms/departments/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Delete operation forbidden");
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // CRUD Courses
  createCourse: async (id: string, name: string, deptId: string, duration: string, intake: number, overview: string): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("name", name);
      fd.append("dept_id", deptId);
      fd.append("duration", duration);
      fd.append("intake", intake.toString());
      fd.append("overview", overview);
      const res = await fetch(`${API_BASE}/api/v1/cms/courses`, {
        method: "POST",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  updateCourse: async (id: string, name: string, duration: string, intake: number, overview: string): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("duration", duration);
      fd.append("intake", intake.toString());
      fd.append("overview", overview);
      const res = await fetch(`${API_BASE}/api/v1/cms/courses/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  deleteCourse: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/cms/courses/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Delete operation forbidden");
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // CRUD Fees
  createFee: async (courseId: string, academicYear: string, tuition: number, hostel: number, other: number, type: string): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("course_id", courseId);
      fd.append("academic_year", academicYear);
      fd.append("tuition_fee", tuition.toString());
      fd.append("hostel_fee", hostel.toString());
      fd.append("other_charges", other.toString());
      fd.append("fee_type", type);
      const res = await fetch(`${API_BASE}/api/v1/cms/fees`, {
        method: "POST",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  updateFee: async (id: string, tuition: number, hostel: number, other: number): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("tuition_fee", tuition.toString());
      fd.append("hostel_fee", hostel.toString());
      fd.append("other_charges", other.toString());
      const res = await fetch(`${API_BASE}/api/v1/cms/fees/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  deleteFee: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/cms/fees/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Delete operation forbidden");
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // CRUD Admissions Step
  createAdmissionStep: async (id: string, title: string, description: string, stepNumber: number): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("title", title);
      fd.append("description", description);
      fd.append("step_number", stepNumber.toString());
      const res = await fetch(`${API_BASE}/api/v1/cms/admissions/process`, {
        method: "POST",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  deleteAdmissionStep: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/cms/admissions/process/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Delete operation forbidden");
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // CRUD Gallery
  createGalleryImage: async (id: string, title: string, category: string, imageUrl: string): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("title", title);
      fd.append("category", category);
      fd.append("image_url", imageUrl);
      const res = await fetch(`${API_BASE}/api/v1/cms/gallery`, {
        method: "POST",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  deleteGalleryImage: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/cms/gallery/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Delete operation forbidden");
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Enquiries management
  getEnquiries: async (): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/cms/enquiries`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  updateEnquiryStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      const res = await fetch(`${API_BASE}/api/v1/cms/enquiries/${id}/status`, {
        method: "PUT",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Reusable Media Upload
  uploadMedia: async (file: File): Promise<ApiResponse<any>> => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/api/v1/cms/upload`, {
        method: "POST",
        headers: getHeaders(true),
        body: fd,
      });
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};
