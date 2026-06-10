import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  icon?: React.ElementType;
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: string; // tailwind text color class, e.g. 'text-green-600'
  trend?: 'up' | 'down' | null;
}

/** Compact KPI tile used across the Command Center top row. */
const MetricCard = ({
  icon: Icon,
  label,
  value,
  sublabel,
  accent = 'text-primary',
  trend = null,
}: MetricCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
            {Icon ? <Icon className={`w-5 h-5 ${accent}`} /> : null}
          </div>
          {trend && (
            <span
              className={`text-xs font-semibold flex items-center gap-0.5 ${
                trend === 'up' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
        {sublabel && (
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">{sublabel}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
