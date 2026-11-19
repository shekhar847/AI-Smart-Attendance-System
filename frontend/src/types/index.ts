export interface Student {
  id: number;
  name: string;
  roll: string;
  department: string;
  year: string;
  email?: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  photo?: string;
  created_at?: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  employee_id: string;
  department: string;
  designation: string;
  photo?: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  time: string;
  status: "Present" | "Absent" | "Late";
  emotion_status?: string;
  confidence?: number;
  latitude?: number | null;
  longitude?: number | null;
  student?: Student;
}

export interface Camera {
  id: number;
  camera_name: string;
  camera_url: string;
  location: string;
  status: "Active" | "Inactive";
  created_at?: string;
}

export interface AlertSettingsData {
  enabled: boolean;
  cutoff_time: string;
  provider: string;
  account_sid?: string;
  auth_token?: string;
  from_number?: string;
  api_key?: string;
  message_template: string;
}

export interface AlertLog {
  id: number;
  student_id: number;
  student_name?: string;
  recipient_phone: string;
  message: string;
  channel: string;
  status: "Sent" | "Failed" | "Pending";
  created_at?: string;
}

export interface DashboardStats {
  students: number;
  teachers: number;
  present: number;
  absent: number;
}

export interface ReportSummary {
  total_students: number;
  present: number;
  absent: number;
}

export interface DailyReportItem {
  date: string;
  present: number;
  absent: number;
}

export interface MonthlyReportItem {
  month: string;
  present: number;
  absent: number;
}

export interface NotificationItem {
  id: number | string;
  title: string;
  message: string;
  time?: string;
  created_at?: string;
  read: boolean;
  type?: "attendance" | "student" | "system" | "alert";
}

export interface UserSession {
  id?: number;
  name?: string;
  email?: string;
  role?: "admin" | "teacher" | "student";
  student_id?: number;
  employee_id?: string;
  department?: string;
}
