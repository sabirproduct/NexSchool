import { Card, CardContent, Chip, Grid2, Stack, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export function ModulePage({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>{title}</Typography>
        <Typography variant="body1" color="text.secondary">
          Track day-to-day operations with role-aware workflows and actionable insights.
        </Typography>
      </Stack>

      <Grid2 container spacing={2}>
        {bullets.map((item) => (
          <Grid2 size={{ xs: 12, md: 6 }} key={item}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircleRoundedIcon color="primary" />
                  <Typography fontWeight={600}>{item}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        <Chip label="Material UI" color="primary" variant="outlined" />
        <Chip label="MVP Ready" color="secondary" variant="outlined" />
        <Chip label="Role-based" variant="outlined" />
      </Stack>
    </Stack>
  );
}
