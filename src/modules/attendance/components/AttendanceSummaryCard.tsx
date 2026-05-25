import { Card, CardContent, Typography } from '@mui/material';

export function AttendanceSummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="rounded-2xl border border-slate-100 shadow-sm">
      <CardContent>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h5" fontWeight={700}>{value}</Typography>
      </CardContent>
    </Card>
  );
}
