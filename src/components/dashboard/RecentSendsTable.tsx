import { Check, Clock, User, XCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentWithPatient } from '@/types/dashboard';
import { formatDateFull } from '@/lib/dates';
import { format, startOfDay, endOfDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentSendsTableProps {
  data: AppointmentWithPatient[];
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

export function RecentSendsTable({ data }: RecentSendsTableProps) {
  // Filtra pelos registros cujo created_at é de hoje
  // (o n8n roda hoje para confirmar agendamentos de amanhã)
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();

  const todayData = [...data]
    .filter(a => {
      if (!a.created_at) return false;
      const ts = parseISO(a.created_at).getTime();
      return ts >= todayStart && ts <= todayEnd;
    })
    .sort((a, b) => {
      // Ordena por horário do agendamento
      const timeA = a.appointment_time || '00:00';
      const timeB = b.appointment_time || '00:00';
      return timeA.localeCompare(timeB);
    });

  const sentCount = todayData.filter(a => a.message_sent).length;
  const errorCount = todayData.filter(a => !a.message_sent && a.status === 'Error').length;
  const pendingCount = todayData.filter(a => !a.message_sent && a.status !== 'Error').length;
  const total = todayData.length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg font-semibold">Envios de Hoje</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automação executada em {format(new Date(), "dd/MM/yyyy", { locale: ptBR })} • {total} registros
            </p>
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
            {todayData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum envio registrado hoje
              </p>
            ) : (
              todayData.map((appointment) => {
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
                        {/* Data do agendamento confirmado */}
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Consulta: {formatDateFull(appointment.appointment_date)} às {appointment.appointment_time?.substring(0, 5) || '--:--'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <Badge
                        variant="secondary"
                        className={statusInfo.className}
                      >
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
