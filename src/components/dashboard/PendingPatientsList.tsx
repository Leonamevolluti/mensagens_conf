import { AlertCircle, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentWithPatient } from '@/types/dashboard';
import { formatDateFull } from '@/lib/dates';
import { format, subDays } from 'date-fns';

interface PendingPatientsListProps {
  data: AppointmentWithPatient[];
}

export function PendingPatientsList({ data }: PendingPatientsListProps) {
  const todayStr = format(new Date(), 'dd/MM/yyyy');

  // Mesmo critério do RecentSendsTable:
  // mensagem_enviada começa com hoje OU created_at no range do dia Brasil (UTC-3)
  const nowUTC = new Date();
  const start = new Date(subDays(nowUTC, 1));
  start.setUTCHours(21, 0, 0, 0);
  const end = new Date(nowUTC);
  end.setUTCHours(21, 0, 0, 0);

  const pendingData = data.filter(a => {
    if (a.message_sent) return false; // só pendentes/erro

    if (a.mensagem_enviada) {
      return a.mensagem_enviada.startsWith(todayStr);
    }
    if (a.created_at) {
      const ts = new Date(a.created_at).getTime();
      return ts >= start.getTime() && ts < end.getTime();
    }
    return false;
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-warning" />
          <CardTitle className="text-lg font-semibold">Mensagens Pendentes</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Erros e pendências de hoje • {pendingData.length} registros
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px]">
          <div className="space-y-2 p-4 pt-0">
            {pendingData.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-success" />
                </div>
                <p className="text-muted-foreground">
                  Nenhuma mensagem pendente hoje!
                </p>
              </div>
            ) : (
              pendingData.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-3 rounded-lg border border-warning/30 bg-warning/5 hover:bg-warning/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {appointment.patients?.name || 'Paciente não identificado'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {appointment.procedure_name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateFull(appointment.appointment_date)}
                        </span>
                        {appointment.patients?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {appointment.patients.phone}
                          </span>
                        )}
                      </div>
                    </div>
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
