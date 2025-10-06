import 'src/global.css';

import { useEffect } from 'react';
import Fab from '@mui/material/Fab';
import { usePathname } from 'src/routes/hooks';

import { ThemeProvider } from 'src/theme/theme-provider';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  const githubButton = () => (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9999,
        right: 20,
        bottom: 20,
        width: 48,
        height: 48,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'white',
        '&:hover': {
          bgcolor: 'grey.900',
        },
      }}
    >
      <Iconify width={24} icon="socials:github" />
    </Fab>
  );

  return (
    <ThemeProvider>
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        }}
      >
        {children}
        {githubButton()}
      </div>
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}
