import { Check, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentWithPatient } from '@/types/dashboard';
import { formatDateFull, safeParseDate } from '@/lib/dates';
import { format } from 'date-fns';

interface RecentSendsTableProps {
  data: AppointmentWithPatient[];
}

export function RecentSendsTable({ data }: RecentSendsTableProps) {
  const today = format(new Date(), 'dd-MM-yyyy');

  // Filtra apenas os agendamentos do dia atual, sem limite de quantidade
  const todayData = [...data]
    .filter(a => {
      if (!a.appointment_date) return false;
      const parsed = safeParseDate(a.appointment_date);
      if (!parsed) return false;
      return format(parsed, 'dd-MM-yyyy') === today;
    })
    .sort((a, b) => {
      const timeA = a.appointment_time || '00:00';
      const timeB = b.appointment_time || '00:00';
      return timeA.localeCompare(timeB);
    });

  const sentCount = todayData.filter(a => a.message_sent).length;
  const pendingCount = todayData.filter(a => !a.message_sent).length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-semibold">Envios de Hoje</CardTitle>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-success/10 text-success font-medium">
              ✓ {sentCount} enviadas
            </span>
            <span className="px-2 py-1 rounded-full bg-warning/10 text-warning font-medium">
              ⏱ {pendingCount} pendentes
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4 pt-0">
            {todayData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum agendamento para hoje
              </p>
            ) : (
              todayData.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {appointment.patients?.name || 'Paciente não identificado'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {appointment.procedure_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-foreground">
                        {formatDateFull(appointment.appointment_date)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.appointment_time?.substring(0, 5) || '--:--'}
                      </p>
                    </div>
                    <Badge
                      variant={appointment.message_sent ? 'default' : 'secondary'}
                      className={
                        appointment.message_sent
                          ? 'bg-success text-success-foreground hover:bg-success/90'
                          : 'bg-warning text-warning-foreground hover:bg-warning/90'
                      }
                    >
                      {appointment.message_sent ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Enviada
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pendente
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
