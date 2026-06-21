import { checkAuth } from './actions';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
  title: 'NuansaPos Admin Dashboard - License Generator',
  description: 'Manage, generate, and verify offline license keys for NuansaPos.',
  robots: { index: false, follow: false }, // Security: Prevent indexing of admin pages
};

export default async function AdminPage() {
  const isAuthorized = await checkAuth();

  if (!isAuthorized) {
    redirect('/admin/login');
  }

  return <AdminDashboardClient />;
}
