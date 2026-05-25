import { Card, CardContent, Grid2, Typography } from '@mui/material';

export function ModulePage({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Grid2 container spacing={2}>
        {bullets.map((item) => (
          <Grid2 size={{ xs: 12, md: 6 }} key={item}>
            <Card><CardContent><Typography>{item}</Typography></CardContent></Card>
          </Grid2>
        ))}
      </Grid2>
    </>
  );
}
