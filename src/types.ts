export type RoleMode = 'patient' | 'doctor' | 'admin' | 'public_tv';

export interface Department {
  id: string;
  name: string;
  code: string;
  icon: string;
  avgConsultMins: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  departmentId: string;
  status: 'available' | 'in_consultation' | 'offline';
  roomNo: string;
  totalServedToday: number;
}

export interface PatientToken {
  id: string;
  tokenNumber: string;
  patientId?: string;
  patientName: string;
  patientAge: number;
  patientPhone?: string;
  departmentId: string;
  departmentName?: string;
  symptoms: string;
  painScore: number;
  severityLevel: number; // 1: Critical, 2: Urgent, 3: Standard, 4: Minor
  severityLabel: string;
  severityColor: string;
  priorityScore: number;
  aiRecommendation: string;
  status: 'waiting' | 'in_consultation' | 'completed' | 'cancelled';
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  roomNo?: string;
  isEmergencyBumped?: boolean;
  createdAt: string;
  calledAt?: string | null;
  completedAt?: string | null;
  countAhead?: number;
  estimatedWaitMinutes?: number;
}

export interface SystemStats {
  totalTokensToday: number;
  waitingCount: number;
  inConsultationCount: number;
  completedCount: number;
  emergencyCount: number;
  avgWaitMinutes: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  message: string;
}

export interface QueueState {
  tokens: PatientToken[];
  doctors: Doctor[];
  departments: Department[];
  stats: SystemStats;
  logs: AuditLog[];
}
