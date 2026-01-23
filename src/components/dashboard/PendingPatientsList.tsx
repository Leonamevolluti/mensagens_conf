import { format, isValid, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Phone, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentWithPatient } from '@/types/dashboard';

interface PendingPatientsListProps {
  data: AppointmentWithPatient[];
}

function safeParseAppointmentDate(value: string) {
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

export function PendingPatientsList({ data }: PendingPatientsListProps) {
  const pendingData = data.filter(a => !a.message_sent).slice(0, 15);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-warning" />
          <CardTitle className="text-lg font-semibold">Mensagens Pendentes</CardTitle>
        </div>
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
                  Nenhuma mensagem pendente!
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
                          {formatAppointmentDate(appointment.appointment_date)}
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
