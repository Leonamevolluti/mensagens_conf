import { useQuery } from '@tanstack/react-query';
import { safeParseDate, formatDateShort } from '@/lib/dates';
import { supabase } from '@/lib/supabase';
import { 
  AppointmentWithPatient, 
  DashboardFilters, 
  DashboardMetrics,
  TimelineData,
  ProfessionalData,
  ProcedureData,
  HourlyData
} from '@/types/dashboard';
import { format } from 'date-fns';

export function useDashboardData(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async () => {
      // BUG FIX #1: O banco armazena datas como 'dd-MM-yyyy', então a ordenação
      // por appointment_date (string) seria lexicográfica e incorreta.
      // Ordenamos por created_at que é um timestamp ISO real.
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patients (*)
        `)
        .order('created_at', { ascending: false });

      // BUG FIX #2: Os filtros de data enviavam 'yyyy-MM-dd' para o Supabase,
      // mas o banco armazena no formato 'dd-MM-yyyy'. Convertemos corretamente.
      if (filters.startDate) {
        query = query.gte('appointment_date', format(filters.startDate, 'dd-MM-yyyy'));
      }
      if (filters.endDate) {
        query = query.lte('appointment_date', format(filters.endDate, 'dd-MM-yyyy'));
      }

      if (filters.professional && filters.professional !== 'all') {
        query = query.eq('professional_name', filters.professional);
      }

      if (filters.messageStatus === 'sent') {
        query = query.eq('message_sent', true);
      } else if (filters.messageStatus === 'pending') {
        query = query.eq('message_sent', false);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []) as AppointmentWithPatient[];
    },
  });
}

export function useProfessionals() {
  return useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('professional_name')
        .order('professional_name');

      if (error) {
        throw error;
      }

      const uniqueProfessionals = [...new Set(data?.map(item => item.professional_name) || [])];
      return uniqueProfessionals.filter(Boolean);
    },
  });
}

export function calculateMetrics(data: AppointmentWithPatient[]): DashboardMetrics {
  const totalAppointments = data.length;
  const totalSent = data.filter(a => a.message_sent).length;
  const totalPending = totalAppointments - totalSent;
  const sendRate = totalAppointments > 0 ? (totalSent / totalAppointments) * 100 : 0;

  return {
    totalAppointments,
    totalSent,
    totalPending,
    sendRate,
  };
}

export function calculateTimelineData(data: AppointmentWithPatient[]): TimelineData[] {
  const dateMap = new Map<string, { sent: number; pending: number }>();

  data.forEach(appointment => {
    const date = appointment.appointment_date;
    if (!date) return;

    // Normaliza a chave para garantir agrupamento correto independente do separador
    const parsed = safeParseDate(date);
    if (!parsed) return;
    const key = format(parsed, 'dd-MM-yyyy');

    if (!dateMap.has(key)) {
      dateMap.set(key, { sent: 0, pending: 0 });
    }
    const current = dateMap.get(key)!;
    if (appointment.message_sent) {
      current.sent++;
    } else {
      current.pending++;
    }
  });

  return Array.from(dateMap.entries())
    .map(([date, values]) => ({
      date,
      ...values,
    }))
    .sort((a, b) => {
      const dateA = safeParseDate(a.date)?.getTime() ?? 0;
      const dateB = safeParseDate(b.date)?.getTime() ?? 0;
      return dateA - dateB;
    })
    .slice(-30);
}

export function calculateProfessionalData(data: AppointmentWithPatient[]): ProfessionalData[] {
  const professionalMap = new Map<string, { sent: number; pending: number }>();

  data.forEach(appointment => {
    const name = appointment.professional_name || 'Não informado';
    if (!professionalMap.has(name)) {
      professionalMap.set(name, { sent: 0, pending: 0 });
    }
    const current = professionalMap.get(name)!;
    if (appointment.message_sent) {
      current.sent++;
    } else {
      current.pending++;
    }
  });

  return Array.from(professionalMap.entries())
    .map(([name, values]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      ...values,
    }))
    .sort((a, b) => (b.sent + b.pending) - (a.sent + a.pending))
    .slice(0, 10);
}

export function calculateProcedureData(data: AppointmentWithPatient[]): ProcedureData[] {
  const procedureMap = new Map<string, { sent: number; pending: number }>();

  data.forEach(appointment => {
    const name = appointment.procedure_name || 'Não informado';
    if (!procedureMap.has(name)) {
      procedureMap.set(name, { sent: 0, pending: 0 });
    }
    const current = procedureMap.get(name)!;
    if (appointment.message_sent) {
      current.sent++;
    } else {
      current.pending++;
    }
  });

  return Array.from(procedureMap.entries())
    .map(([name, values]) => ({
      name: name.length > 25 ? name.substring(0, 25) + '...' : name,
      ...values,
    }))
    .sort((a, b) => (b.sent + b.pending) - (a.sent + a.pending))
    .slice(0, 8);
}

export function calculateHourlyData(data: AppointmentWithPatient[]): HourlyData[] {
  const hourMap = new Map<string, number>();

  // Inicializa todas as horas
  for (let i = 0; i < 24; i++) {
    hourMap.set(`${i.toString().padStart(2, '0')}:00`, 0);
  }

  // BUG FIX #3: Antes contava apenas message_sent=true, omitindo pendentes.
  // O gráfico "Volume por Horário" deve mostrar TODOS os agendamentos por horário.
  data.forEach(appointment => {
    if (appointment.appointment_time) {
      const hour = appointment.appointment_time.substring(0, 2) + ':00';
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    }
  });

  return Array.from(hourMap.entries())
    .map(([hour, count]) => ({
      hour,
      count,
    }))
    .filter(item => {
      const hourNum = parseInt(item.hour);
      return hourNum >= 6 && hourNum <= 22;
    });
}

export function getDailySuccessRate(data: AppointmentWithPatient[]): { date: string; rate: number }[] {
  const dateMap = new Map<string, { sent: number; total: number }>();

  data.forEach(appointment => {
    const date = appointment.appointment_date;
    if (!date) return;

    // Normaliza a chave igual ao calculateTimelineData
    const parsed = safeParseDate(date);
    if (!parsed) return;
    const key = format(parsed, 'dd-MM-yyyy');

    if (!dateMap.has(key)) {
      dateMap.set(key, { sent: 0, total: 0 });
    }
    const current = dateMap.get(key)!;
    current.total++;
    if (appointment.message_sent) {
      current.sent++;
    }
  });

  return Array.from(dateMap.entries())
    .map(([date, values]) => ({
      date,
      rate: values.total > 0 ? (values.sent / values.total) * 100 : 0,
    }))
    .sort((a, b) => {
      const dateA = safeParseDate(a.date)?.getTime() ?? 0;
      const dateB = safeParseDate(b.date)?.getTime() ?? 0;
      return dateA - dateB;
    })
    .slice(-14);
}
