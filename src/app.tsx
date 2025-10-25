import { useEffect } from 'react';

import Fab from '@mui/material/Fab';
import { CssBaseline } from '@mui/material';

import { usePathname } from 'src/routes/hooks';

import { ThemeProvider } from 'src/theme/theme-provider';
import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

 

  return (
    <ThemeProvider>
      <CssBaseline /> 
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        }}
      >
        {children}
       
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
