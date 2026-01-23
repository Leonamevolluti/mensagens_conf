import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusPieChartProps {
  sent: number;
  pending: number;
}

export function StatusPieChart({ sent, pending }: StatusPieChartProps) {
  const data = [
    { name: 'Enviadas', value: sent },
    { name: 'Pendentes', value: pending },
  ];

  const COLORS = ['hsl(172, 66%, 50%)', 'hsl(38, 92%, 50%)'];

  const total = sent + pending;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Status das Mensagens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                formatter={(value: number, name: string) => [
                  `${value} (${((value / total) * 100).toFixed(1)}%)`,
                  name
                ]}
              />
              <Legend 
                verticalAlign="bottom"
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-accent mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{sent}</p>
            <p className="text-xs text-muted-foreground">Enviadas</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-warning mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{pending}</p>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
