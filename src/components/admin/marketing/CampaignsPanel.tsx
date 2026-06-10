import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone } from 'lucide-react';
import { MarketingCampaign } from '@/types/marketing';

const CampaignsPanel = ({ campaigns }: { campaigns: MarketingCampaign[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-primary" />
          Campaigns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No campaigns yet.</p>
        ) : (
          campaigns.map((c) => (
            <div key={c.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.objective}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {c.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {c.channels?.map((ch) => (
                  <Badge key={ch} variant="outline" className="text-[9px]">
                    {ch}
                  </Badge>
                ))}
              </div>
              {c.theme && <p className="text-[11px] text-muted-foreground mt-1">Theme: {c.theme}</p>}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignsPanel;
