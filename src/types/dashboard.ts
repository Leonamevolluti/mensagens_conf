export interface Patient {
  id: string;
  feegow_id: number;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  feegow_id: number;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  procedure_name: string;
  professional_name: string;
  status: string;
  message_sent: boolean;
  mensagem_enviada: string | null;
  created_at: string;
}

export interface AppointmentWithPatient extends Appointment {
  patients: Patient;
}

export interface DashboardFilters {
  startDate: Date | undefined;
  endDate: Date | undefined;
  professional: string;
  messageStatus: 'all' | 'sent' | 'pending';
}

export interface DashboardMetrics {
  totalAppointments: number;
  totalSent: number;
  totalPending: number;
  sendRate: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimelineData {
  date: string;
  sent: number;
  pending: number;
}

export interface ProfessionalData {
  name: string;
  sent: number;
  pending: number;
}

export interface ProcedureData {
  name: string;
  sent: number;
  pending: number;
}

export interface HourlyData {
  hour: string;
  count: number;
}
