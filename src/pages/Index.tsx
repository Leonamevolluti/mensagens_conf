import { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Clock, 
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { StatusPieChart } from '@/components/dashboard/StatusPieChart';
import { TimelineChart } from '@/components/dashboard/TimelineChart';
import { ProfessionalChart } from '@/components/dashboard/ProfessionalChart';
import { ProcedureChart } from '@/components/dashboard/ProcedureChart';
import { HourlyChart } from '@/components/dashboard/HourlyChart';
import { DailySuccessRate } from '@/components/dashboard/DailySuccessRate';
import { RecentSendsTable } from '@/components/dashboard/RecentSendsTable';
import { PendingPatientsList } from '@/components/dashboard/PendingPatientsList';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { 
  useDashboardData, 
  useProfessionals,
  calculateMetrics,
  calculateTimelineData,
  calculateProfessionalData,
  calculateProcedureData,
  calculateHourlyData,
  getDailySuccessRate
} from '@/hooks/useDashboardData';
import { DashboardFilters as FilterType } from '@/types/dashboard';

const Index = () => {
  const [filters, setFilters] = useState<FilterType>({
    startDate: undefined,
    endDate: undefined,
    professional: 'all',
    messageStatus: 'all',
  });

  const { data: appointments = [], isLoading, isError, error, refetch } = useDashboardData(filters);
  const { data: professionals = [] } = useProfessionals();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>
            {error?.message || 'Ocorreu um erro ao carregar os dados do dashboard. Verifique sua conexão e tente novamente.'}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()} 
              className="mt-4 w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const metrics = calculateMetrics(appointments);
  const timelineData = calculateTimelineData(appointments);
  const professionalData = calculateProfessionalData(appointments);
  const procedureData = calculateProcedureData(appointments);
  const hourlyData = calculateHourlyData(appointments);
  const dailySuccessRateData = getDailySuccessRate(appointments);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Dashboard de Notificações
              </h1>
              <p className="text-muted-foreground mt-1">
                Acompanhamento de envio de mensagens para pacientes
              </p>
            </div>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="w-fit"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total de Procedimentos"
            value={metrics.totalAppointments.toLocaleString('pt-BR')}
            subtitle="Agendamentos registrados"
            icon={<MessageSquare className="h-6 w-6" />}
            variant="info"
          />
          <MetricCard
            title="Mensagens Enviadas"
            value={metrics.totalSent.toLocaleString('pt-BR')}
            subtitle="Notificações entregues"
            icon={<Send className="h-6 w-6" />}
            variant="success"
          />
          <MetricCard
            title="Mensagens Pendentes"
            value={metrics.totalPending.toLocaleString('pt-BR')}
            subtitle="Aguardando envio"
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
          />
          <MetricCard
            title="Taxa de Envio"
            value={`${metrics.sendRate.toFixed(1)}%`}
            subtitle="Percentual de sucesso"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="default"
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <DashboardFilters
            filters={filters}
            onFiltersChange={setFilters}
            professionals={professionals}
          />
        </div>

        {/* Charts Grid - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <StatusPieChart 
            sent={metrics.totalSent} 
            pending={metrics.totalPending} 
          />
          <div className="lg:col-span-2">
            <TimelineChart data={timelineData} />
          </div>
        </div>

        {/* Charts Grid - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ProfessionalChart data={professionalData} />
          <ProcedureChart data={procedureData} />
        </div>

        {/* Charts Grid - Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DailySuccessRate data={dailySuccessRateData} />
          <HourlyChart data={hourlyData} />
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentSendsTable data={appointments} filters={filters} />
          <PendingPatientsList data={appointments} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-8 py-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          Sistema de Notificações para Pacientes • Dashboard atualizado em tempo real
        </div>
      </footer>
    </div>
  );
};

export default Index;
