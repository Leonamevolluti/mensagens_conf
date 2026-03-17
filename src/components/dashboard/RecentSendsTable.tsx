import { Check, Clock, User, XCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentWithPatient, DashboardFilters } from '@/types/dashboard';
import { formatDateFull, safeParseDate } from '@/lib/dates';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentSendsTableProps {
  data: AppointmentWithPatient[];
  filters: DashboardFilters;
}

function getStatusInfo(appointment: AppointmentWithPatient) {
  if (appointment.message_sent) {
    return {
      label: 'Enviada',
      icon: <Check className="h-3 w-3 mr-1" />,
      className: 'bg-success text-success-foreground hover:bg-success/90',
    };
  }
  if (appointment.status === 'Error') {
    return {
      label: 'Erro',
      icon: <XCircle className="h-3 w-3 mr-1" />,
      className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };
  }
  return {
    label: 'Pendente',
    icon: <Clock className="h-3 w-3 mr-1" />,
    className: 'bg-warning text-warning-foreground hover:bg-warning/90',
  };
}

export function RecentSendsTable({ data, filters }: RecentSendsTableProps) {
  const hasDateFilter = !!(filters.startDate || filters.endDate);

  // --- Modo filtro de período: mostra todos os registros já filtrados ---
  let displayData: AppointmentWithPatient[];
  let title: string;
  let subtitle: string;

  if (hasDateFilter) {
    // O useDashboardData já aplicou o filtro de data no Supabase,
    // então 'data' já contém só o período selecionado
    displayData = [...data].sort((a, b) => {
      const dateA = safeParseDate(a.appointment_date)?.getTime() ?? 0;
      const dateB = safeParseDate(b.appointment_date)?.getTime() ?? 0;
      if (dateA !== dateB) return dateA - dateB;
      return (a.appointment_time || '').localeCompare(b.appointment_time || '');
    });

    const start = filters.startDate ? format(filters.startDate, 'dd/MM/yyyy', { locale: ptBR }) : '?';
    const end = filters.endDate ? format(filters.endDate, 'dd/MM/yyyy', { locale: ptBR }) : '?';
    title = 'Envios do Período';
    subtitle = `${start} até ${end} • ${displayData.length} registros`;
  } else {
    // --- Modo padrão: só os envios de hoje ---
    const todayStr = format(new Date(), 'dd/MM/yyyy');
    const nowUTC = new Date();
    const start = new Date(subDays(nowUTC, 1));
    start.setUTCHours(21, 0, 0, 0);
    const end = new Date(nowUTC);
    end.setUTCHours(21, 0, 0, 0);

    displayData = [...data]
      .filter(a => {
        if (a.mensagem_enviada) return a.mensagem_enviada.startsWith(todayStr);
        if (a.created_at) {
          const ts = new Date(a.created_at).getTime();
          return ts >= start.getTime() && ts < end.getTime();
        }
        return false;
      })
      .sort((a, b) => (a.appointment_time || '').localeCompare(b.appointment_time || ''));

    title = 'Envios de Hoje';
    subtitle = `Agendamentos para ${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })} • ${displayData.length} registros`;
  }

  const sentCount = displayData.filter(a => a.message_sent).length;
  const errorCount = displayData.filter(a => !a.message_sent && a.status === 'Error').length;
  const pendingCount = displayData.filter(a => !a.message_sent && a.status !== 'Error').length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="px-2 py-1 rounded-full bg-success/10 text-success font-medium">
              ✓ {sentCount} enviadas
            </span>
            {errorCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
                ✕ {errorCount} com erro
              </span>
            )}
            {pendingCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-warning/10 text-warning font-medium">
                ⏱ {pendingCount} pendentes
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[420px]">
          <div className="space-y-1 p-4 pt-0">
            {displayData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum envio encontrado
              </p>
            ) : (
              displayData.map((appointment) => {
                const statusInfo = getStatusInfo(appointment);
                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate text-sm">
                          {appointment.patients?.name || 'Paciente não identificado'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {appointment.procedure_name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Consulta: {formatDateFull(appointment.appointment_date)} às {appointment.appointment_time?.substring(0, 5) || '--:--'}
                          </span>
                        </div>
                        {appointment.mensagem_enviada && (
                          <p className="text-xs text-success mt-0.5">
                            Enviada em: {appointment.mensagem_enviada}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <Badge variant="secondary" className={statusInfo.className}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
