import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const variantStyles = {
  default: 'bg-card border-border',
  success: 'bg-success/10 border-success/20',
  warning: 'bg-warning/10 border-warning/20',
  info: 'bg-info/10 border-info/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  info: 'bg-info/20 text-info',
};

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = 'default',
  trend 
}: MetricCardProps) {
  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border',
      variantStyles[variant]
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground tracking-tight">
                {value}
              </p>
              {trend && (
                <span className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-xl',
            iconStyles[variant]
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
