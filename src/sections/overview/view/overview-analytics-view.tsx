import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { _posts, _tasks, _traffic, _timeline } from 'src/_mock';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

import TodayActionCard from 'src/components/01';
import DuolingoProgressMap from 'src/components/02';
import GoalGridChatbot from 'src/components/03';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      {/* Welcome heading */}
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, color: 'white' }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={4}>


	<Grid item xs={12}>
          <GoalGridChatbot />
        </Grid>


        {/* Existing TodayActionCard */}
        <Grid item xs={12}>
          <TodayActionCard />
        </Grid>

        {/* Duolingo Progress Map */}
        <Grid item xs={12}>
          <DuolingoProgressMap />
        </Grid>

	

        {/* Section heading for KPIs */}
        <Grid item xs={12}>
          <Typography
            variant="h3"
            sx={{
              mb: { xs: 3, md: 5 },
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Measure Your Progress
          </Typography>
        </Grid>

        {/* KPI Row 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Conversations Had"
            percent={2.6}
            total={714000}
            icon={<img alt="Conversations Had" src="/assets/icons/glass/convoshad.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="People Met"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<img alt="People Met" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Messages Sent"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="Messages Sent" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        {/* KPI Row 2 */}
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Tasks Completed"
            percent={12.5}
            total={128}
            color="success"
            icon={<img alt="Tasks Completed" src="/assets/icons/tasks-completed.svg" />}
            chart={{
              categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
              series: [15, 20, 18, 25, 30],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Lessons Completed"
            percent={4.2}
            total={42}
            color="info"
            icon={<img alt="Lessons Completed" src="/assets/icons/open-book.svg" />}
            chart={{
              categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
              series: [5, 8, 7, 10, 12],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="XP Earned"
            percent={7.5}
            total={5400}
            color="warning"
            icon={<img alt="XP Earned" src="/assets/icons/xp-star.svg" />}
            chart={{
              categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
              series: [800, 1000, 1200, 1400, 1000],
            }}
          />
        </Grid>

        {/* KPI Row 3 */}
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Current Streak"
            percent={15.0}
            total={21}
            color="primary"
            icon={<img alt="Current Streak" src="/assets/icons/streak-fire.svg" />}
            chart={{
              categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
              series: [1, 2, 3, 5, 10],
            }}
          />
        </Grid>

        {/* Existing dashboard charts */}
        

      
      </Grid>
    </DashboardContent>
  );
}
