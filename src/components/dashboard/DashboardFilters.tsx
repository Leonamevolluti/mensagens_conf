import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardFilters as FilterType } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface DashboardFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  professionals: string[];
  isLoading?: boolean;
}

export function DashboardFilters({
  filters,
  onFiltersChange,
  professionals,
  isLoading,
}: DashboardFiltersProps) {
  const updateFilter = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      startDate: undefined,
      endDate: undefined,
      professional: 'all',
      messageStatus: 'all',
    });
  };

  const hasActiveFilters = 
    filters.startDate || 
    filters.endDate || 
    (filters.professional && filters.professional !== 'all') ||
    filters.messageStatus !== 'all';

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filtros</span>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 flex-1">
          {/* Date Range - Start */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal w-full sm:w-auto',
                  !filters.startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? (
                  format(filters.startDate, 'dd/MM/yyyy', { locale: ptBR })
                ) : (
                  'Data início'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => updateFilter('startDate', date)}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Date Range - End */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal w-full sm:w-auto',
                  !filters.endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? (
                  format(filters.endDate, 'dd/MM/yyyy', { locale: ptBR })
                ) : (
                  'Data fim'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => updateFilter('endDate', date)}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Professional Filter */}
          <Select
            value={filters.professional || 'all'}
            onValueChange={(value) => updateFilter('professional', value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os profissionais</SelectItem>
              {professionals.map((prof) => (
                <SelectItem key={prof} value={prof}>
                  {prof}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Message Status Filter */}
          <Select
            value={filters.messageStatus}
            onValueChange={(value) => updateFilter('messageStatus', value as FilterType['messageStatus'])}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="sent">Enviadas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
