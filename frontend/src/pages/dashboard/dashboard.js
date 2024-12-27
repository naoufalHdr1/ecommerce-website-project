import React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import NavigationConfig from '../../components/dashboard/navigationConfig';
import DemoTheme from '../../components/dashboard/demoTheme';
import DemoRouter from '../../components/dashboard/demoRouter';
import Branding from '../../components/dashboard/branding';
import SkeletonGrid from '../../components/dashboard/skeletonGrid';

export default function Dashboard(props) {
  const { window } = props;
  const router = DemoRouter('/dashboard');
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NavigationConfig}
      router={router}
      theme={DemoTheme}
      window={demoWindow}
      branding={Branding}
    >
      <DashboardLayout>
        <PageContainer>
          <SkeletonGrid />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
