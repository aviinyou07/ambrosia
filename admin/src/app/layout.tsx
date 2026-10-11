import type { Metadata } from 'next';
import './globals.css';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import AdminLayout from '@/components/AdminLayout';

export const metadata: Metadata = {
  title: 'Ambrosia Vastra — Executive Admin Operations Suite',
  description: 'Enterprise Commerce Administration Portal for admin.ambrosiavastra.com',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0d13] text-gray-100 antialiased">
        <AdminAuthProvider>
          <AdminLayout>{children}</AdminLayout>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
