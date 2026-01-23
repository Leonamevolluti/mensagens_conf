import { format, isValid, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Clock, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentWithPatient } from '@/types/dashboard';

interface RecentSendsTableProps {
  data: AppointmentWithPatient[];
}

function safeParseAppointmentDate(value: string) {
  // Most common cases for this project:
  // - yyyy-MM-dd (stored as text)
  // - dd/MM/yyyy (human formatted)
  const iso = parseISO(value);
  if (isValid(iso)) return iso;

  const br = parse(value, 'dd/MM/yyyy', new Date());
  if (isValid(br)) return br;

  const ymd = parse(value, 'yyyy-MM-dd', new Date());
  if (isValid(ymd)) return ymd;

  return null;
}

function formatAppointmentDate(value?: string) {
  if (!value) return '—';
  const parsed = safeParseAppointmentDate(value);
  return parsed ? format(parsed, 'dd/MM/yyyy', { locale: ptBR }) : '—';
}

export function RecentSendsTable({ data }: RecentSendsTableProps) {
  const recentData = data.slice(0, 10);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Últimos Envios</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4 pt-0">
            {recentData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum registro encontrado
              </p>
            ) : (
              recentData.map((appointment) => (
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
                          {formatAppointmentDate(appointment.appointment_date)}
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
