import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { NAVIGATION } from './Navigation';
import { demoTheme } from './ThemeConfig';
import AccountCustomSlotProps from './AccountCustomSlotProps';
import { Outlet, Route, Routes } from 'react-router-dom';


function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const demoWindow = window ? window() : undefined;

  const [session, setSession] = React.useState({
    user: {
      name: 'Admin',
      email: 'admin@fst.ma',
      image: 'https://avatars.githubusercontent.com/u/19550456',
    },
  });

  const authentication = React.useMemo(() => ({
    signIn: () => setSession({
      user: {
        name: 'Admin',
        email: 'admin@fst.ma',
        image: 'https://avatars.githubusercontent.com/u/19550456',
      },
    }),
    signOut: () => setSession(null),
  }), []);

  return (
    <AppProvider 
      navigation={NAVIGATION} 
      theme={demoTheme} 
      window={demoWindow}  
      branding={{ title: 'FST Dashboard' , logo: <div style={{ display: 'none' }} />}}
      authentication={authentication} 
      session={session}
    >
      <DashboardLayout  
// @ts-ignore
      sidebarFooter={<AccountCustomSlotProps session={session} authentication={authentication} />}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
