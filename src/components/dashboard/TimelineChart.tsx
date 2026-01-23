import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimelineData } from '@/types/dashboard';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineChartProps {
  data: TimelineData[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    displayDate: format(parseISO(item.date), 'dd/MM', { locale: ptBR }),
    total: item.sent + item.pending,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Evolução de Envios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="displayDate" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Legend 
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground capitalize">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="sent"
                name="Enviadas"
                stroke="hsl(172, 66%, 50%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSent)"
              />
              <Area
                type="monotone"
                dataKey="pending"
                name="Pendentes"
                stroke="hsl(38, 92%, 50%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPending)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
