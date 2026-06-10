import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { ContentCalendar } from '@/types/marketing';

const ContentCalendarView = ({ calendars }: { calendars: ContentCalendar[] }) => {
  return (
    <div className="space-y-4">
      {calendars.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No content calendars yet. Generate a daily, weekly, or monthly plan.
          </CardContent>
        </Card>
      ) : (
        calendars.map((cal) => (
          <Card key={cal.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="capitalize">{cal.scope}</span> calendar
                <Badge variant="outline" className="text-[10px] ml-1">
                  {cal.period_start}
                  {cal.period_end ? ` → ${cal.period_end}` : ''}
                </Badge>
                {cal.theme && (
                  <Badge variant="secondary" className="text-[10px]">
                    {cal.theme}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {cal.plan?.map((slot, i) => (
                  <div key={i} className="rounded-lg border border-border/60 p-2.5 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{slot.date}</span>
                      <Badge
                        className={`text-[9px] ${
                          slot.status === 'generated'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {slot.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {slot.platform} · {slot.content_type.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ContentCalendarView;
