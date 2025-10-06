import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Rating from '@mui/material/Rating';
import { DashboardContent } from 'src/layouts/dashboard';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

import fireAnimation from 'src/animations/fire.json';
import confettiAnimation from 'src/animations/confetti.json';
import sparklesAnimation from 'src/animations/sparkles.json';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ----------------------------------------------------------------------
// Styled Components
const ActionButton = styled(Button)(({ theme, difficulty }: { theme?: any; difficulty: string }) => ({
  minWidth: 130,
  padding: theme.spacing(1.5, 2),
  fontWeight: 600,
  borderRadius: 12,
  color: '#fff',
  backgroundColor:
    difficulty === 'easy'
      ? '#8be9fd'
      : difficulty === 'medium'
      ? '#ffb86c'
      : '#ff5555',
  '&:hover': { filter: 'brightness(1.1)' },
}));

const ActionCard = styled(motion(Card))(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  color: '#fff',
  cursor: 'pointer',
  position: 'relative',
  marginBottom: theme.spacing(2),
  overflow: 'visible',
}));

// ----------------------------------------------------------------------
// Predefined Actions
const predefinedActions = [
  { label: 'Compliment a Friend', difficulty: 'easy', benefit: 'Builds rapport & positivity' },
  { label: 'Practice Small Talk', difficulty: 'easy', benefit: 'Improves everyday interaction' },
  { label: 'Help Someone', difficulty: 'easy', benefit: 'Builds goodwill & trust' },
  { label: 'Initiate Conversation', difficulty: 'medium', benefit: 'Improves confidence & social flow' },
  { label: 'Join Group Activity', difficulty: 'medium', benefit: 'Expands social circle' },
  { label: 'Reconnect with Friend', difficulty: 'medium', benefit: 'Maintains relationships' },
  { label: 'Ask for Feedback', difficulty: 'hard', benefit: 'Enhances self-awareness' },
  { label: 'Share Personal Story', difficulty: 'hard', benefit: 'Strengthens connection' },
  { label: 'Give Constructive Feedback', difficulty: 'hard', benefit: 'Builds trust & clarity' },
  { label: 'Invite Someone Out', difficulty: 'medium', benefit: 'Expands social network' },
];

// ----------------------------------------------------------------------
// Badge System
const badgeThresholds = [3, 5, 10];
const badges = ['🌟', '🔥', '🏆'];

// ----------------------------------------------------------------------
// Mock Analytics Data
const weeklyData = [
  { day: 'Mon', actions: 3 },
  { day: 'Tue', actions: 4 },
  { day: 'Wed', actions: 2 },
  { day: 'Thu', actions: 5 },
  { day: 'Fri', actions: 6 },
  { day: 'Sat', actions: 1 },
  { day: 'Sun', actions: 3 },
];

// ----------------------------------------------------------------------
// Main Page Component
export function BlogView() {
  const [actions, setActions] = useState<any[]>(() => JSON.parse(localStorage.getItem('actions') || '[]'));
  const [xp, setXp] = useState(() => Number(localStorage.getItem('xp') || 0));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('streak') || 0));
  const [confetti, setConfetti] = useState(false);
  const [manualAction, setManualAction] = useState('');
  const [reflectionNotes, setReflectionNotes] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [dailyMotivation, setDailyMotivation] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('actions', JSON.stringify(actions));
    localStorage.setItem('xp', xp.toString());
    localStorage.setItem('streak', streak.toString());
  }, [actions, xp, streak]);

  // --------------------------------------------------------------------
  const logAction = (action: any) => {
    const existingIndex = actions.findIndex((a) => a.label === action.label);
    if (existingIndex !== -1) {
      const updatedActions = [...actions];
      updatedActions[existingIndex].count += 1;
      setActions(updatedActions);
      setXp((prev) => prev + 5);
      setSnackbar({ open: true, message: `Added again: ${action.label}` });
      return;
    }

    setActions([...actions, { ...action, count: 1, stars: 0 }]);
    setXp((prev) => prev + (action.difficulty === 'easy' ? 10 : action.difficulty === 'medium' ? 20 : 30));
    setStreak((prev) => prev + 1);

    if ((actions.length + 1) % 5 === 0) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
    }

    setDailyMotivation(`Great! You just completed: ${action.label}`);
    setSnackbar({ open: true, message: `Logged: ${action.label} (${action.benefit})` });
  };

  const logManualAction = () => {
    if (!manualAction.trim()) return;
    logAction({ label: manualAction, difficulty: 'medium', benefit: 'Manual action logged', stars: 0 });
    setManualAction('');
  };

  const handleReflectionChange = (label: string, value: string) => {
    setReflectionNotes({ ...reflectionNotes, [label]: value });
  };

  const handleStarChange = (label: string, value: number | null) => {
    const updatedActions = actions.map((a) => (a.label === label ? { ...a, stars: value || 0 } : a));
    setActions(updatedActions);
  };

  const currentBadges = badges.filter((_, idx) => actions.length >= badgeThresholds[idx]);

  // --------------------------------------------------------------------
  return (
    <DashboardContent sx={{ backgroundColor: '#transparent', minHeight: '100vh', color: '#fff' }}>
      {/* Page Header */}
      <Typography variant="h3" mb={1} sx={{ fontWeight: 'bold', color: '#fff' }}>
        Track Your Social Skills
      </Typography>
      <Typography variant="body1" mb={3} color="#ccc">
        Log actions, earn XP, track streaks, reflect on growth, and unlock badges.
      </Typography>

      {/* Quick Action Buttons */}
      <Grid container spacing={2} mb={3}>
        {['easy', 'medium', 'hard'].map((level) => (
          <Grid container spacing={1} key={level} sx={{ mb: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                {level} actions
              </Typography>
            </Grid>
            {predefinedActions.filter((a) => a.difficulty === level).map((action, i) => (
              <Grid item key={i} xs={6} sm={4} md={3}>
                <ActionButton difficulty={action.difficulty} onClick={() => logAction(action)}>
                  {action.label}
                </ActionButton>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>

      {/* Manual Action Input */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <TextField
          label="Add custom action..."
          variant="outlined"
          size="small"
          value={manualAction}
          onChange={(e) => setManualAction(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <Button variant="contained" onClick={logManualAction}>
          Add
        </Button>
      </Box>

      {/* Summary Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={4}>
        <Box sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #ff6a00, #ee0979)', flex: 1, textAlign: 'center' }}>
          <Typography variant="h6">XP</Typography>
          <Typography variant="h4">{xp}</Typography>
        </Box>
        <Box sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #00f260, #0575e6)', flex: 1, textAlign: 'center' }}>
          <Typography variant="h6">Streak</Typography>
          <Typography variant="h4">{streak}</Typography>
        </Box>
        <Box sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)', flex: 1, textAlign: 'center' }}>
          <Typography variant="h6">Badges</Typography>
          <Typography variant="h4">{currentBadges.join(' ') || '—'}</Typography>
        </Box>
      </Stack>

      {/* Weekly Summary Chart */}
      <Box sx={{ width: '100%', height: 200, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData}>
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Line type="monotone" dataKey="actions" stroke="#ffb86c" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Timeline */}
      <Box>
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {action.label} {action.count > 1 && `×${action.count}`}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {action.benefit}
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Add reflection..."
                  fullWidth
                  sx={{ mt: 1 }}
                  value={reflectionNotes[action.label] || ''}
                  onChange={(e) => handleReflectionChange(action.label, e.target.value)}
                />
                <Rating
                  name={`rating-${action.label}`}
                  value={action.stars || 0}
                  onChange={(_, value) => handleStarChange(action.label, value)}
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box width={50} height={50} ml={2}>
                <Lottie animationData={fireAnimation} loop />
              </Box>
            </Box>
          </ActionCard>
        ))}
      </Box>

      {/* Confetti */}
      {confetti && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <Lottie animationData={confettiAnimation} loop={false} />
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </DashboardContent>
  );
}
