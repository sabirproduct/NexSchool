import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Card, CardContent, Grid2, Stack, Typography } from '@mui/material';

type FeeSection = {
  title: string;
  items: string[];
};

const feeSections: FeeSection[] = [
  {
    title: 'Fee Management',
    items: ['Fee structure setup', 'Fee assignment', 'Due tracking', 'Fine management'],
  },
  {
    title: 'Supported Fees',
    items: ['Tuition fees', 'Hostel fees', 'Transport fees', 'Admission fees'],
  },
  {
    title: 'Payment Features',
    items: ['Payment history', 'Receipt generation', 'Online payment placeholder', 'Razorpay integration placeholder'],
  },
  {
    title: 'Reports',
    items: ['Collection reports', 'Pending dues', 'Revenue analytics'],
  },
];

export function FeesPage() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Fees &amp; Payment Module
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage school fee structures, track dues, and monitor collection performance across payment channels.
        </Typography>
      </Stack>

      <Grid2 container spacing={2}>
        {feeSections.map((section) => (
          <Grid2 size={{ xs: 12, md: 6 }} key={section.title}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6" fontWeight={600}>
                    {section.title}
                  </Typography>
                  <Stack spacing={1}>
                    {section.items.map((item) => (
                      <Stack direction="row" spacing={1} alignItems="center" key={item}>
                        <CheckCircleRoundedIcon color="primary" fontSize="small" />
                        <Typography variant="body2">{item}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
}
