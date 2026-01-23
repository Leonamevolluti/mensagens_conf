import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcedureData } from '@/types/dashboard';

interface ProcedureChartProps {
  data: ProcedureData[];
}

export function ProcedureChart({ data }: ProcedureChartProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Envios por Procedimento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
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
                cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              />
              <Legend 
                verticalAlign="top"
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground capitalize">{value}</span>
                )}
              />
              <Bar 
                dataKey="sent" 
                name="Enviadas" 
                fill="hsl(172, 66%, 50%)" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="pending" 
                name="Pendentes" 
                fill="hsl(38, 92%, 50%)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
