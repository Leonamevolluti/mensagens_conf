import { format, isValid, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function safeParseDate(value: string): Date | null {
  // Data format from DB is dd-MM-yyyy — try this FIRST
  // (parseISO would wrongly interpret "05-03-2026" as yyyy-MM-dd → May 3rd)
  const brDash = parse(value, 'dd-MM-yyyy', new Date());
  if (isValid(brDash)) return brDash;

  // dd/MM/yyyy
  const brSlash = parse(value, 'dd/MM/yyyy', new Date());
  if (isValid(brSlash)) return brSlash;

  // yyyy-MM-dd (explicit format)
  const ymd = parse(value, 'yyyy-MM-dd', new Date());
  if (isValid(ymd)) return ymd;

  // ISO as last resort (for full ISO timestamps like 2026-02-25T22:00:47)
  const iso = parseISO(value);
  if (isValid(iso)) return iso;

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
