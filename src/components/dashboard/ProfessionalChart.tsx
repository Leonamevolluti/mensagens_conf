import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfessionalData } from '@/types/dashboard';

interface ProfessionalChartProps {
  data: ProfessionalData[];
}

export function ProfessionalChart({ data }: ProfessionalChartProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Envios por Profissional</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical"
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis 
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="category"
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={100}
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
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground capitalize">{value}</span>
                )}
              />
              <Bar 
                dataKey="sent" 
                name="Enviadas" 
                fill="hsl(172, 66%, 50%)" 
                radius={[0, 4, 4, 0]}
                stackId="stack"
              />
              <Bar 
                dataKey="pending" 
                name="Pendentes" 
                fill="hsl(38, 92%, 50%)" 
                radius={[0, 4, 4, 0]}
                stackId="stack"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
