import { format, isValid, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function safeParseDate(value: string): Date | null {
  // Try ISO first
  const iso = parseISO(value);
  if (isValid(iso)) return iso;

  // dd-MM-yyyy (from Supabase data)
  const brDash = parse(value, 'dd-MM-yyyy', new Date());
  if (isValid(brDash)) return brDash;

  // dd/MM/yyyy
  const brSlash = parse(value, 'dd/MM/yyyy', new Date());
  if (isValid(brSlash)) return brSlash;

  // yyyy-MM-dd
  const ymd = parse(value, 'yyyy-MM-dd', new Date());
  if (isValid(ymd)) return ymd;

  return null;
}

export function formatDateShort(value?: string): string {
  if (!value) return '—';
  const parsed = safeParseDate(value);
  return parsed ? format(parsed, 'dd/MM', { locale: ptBR }) : '—';
}

export function formatDateFull(value?: string): string {
  if (!value) return '—';
  const parsed = safeParseDate(value);
  return parsed ? format(parsed, 'dd/MM/yyyy', { locale: ptBR }) : '—';
}
