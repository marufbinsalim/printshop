'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminSetupPage() {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'pending' | 'checking' | 'admin' | 'not-admin'>('checking');

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user?.email) {
      setStatus('pending');
      return;
    }

    try {
      console.log('Checking admin status for:', user.email);
      const response = await fetch(`/api/admin/set-initial-admin?email=${encodeURIComponent(user.email)}`);
      const data = await response.json();
      console.log('Admin status response:', data);

      setStatus(data.isAdmin ? 'admin' : 'not-admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setStatus('not-admin');
    }
  };

  const setAdminRole = async () => {
    if (!user?.email) {
      toast.error('Kullanıcı oturumu bulunamadı');
      return;
    }

    try {
      setLoading(true);
      console.log('Setting admin role for:', user.email);
      const response = await fetch('/api/admin/set-initial-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();
      console.log('Set admin response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Admin rolü ayarlanamadı');
      }

      toast.success('Admin rolü başarıyla ayarlandı');
      setStatus('admin');

      // Force a page reload to update the auth state
      window.location.reload();
    } catch (error: any) {
      console.error('Error setting admin role:', error);
      toast.error(error.message || 'Admin rolü ayarlanırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Admin Kurulumu</CardTitle>
            <CardDescription>
              Bu sayfaya erişmek için giriş yapmanız gerekmektedir.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Admin Kurulumu</CardTitle>
          <CardDescription>
            {status === 'checking' && 'Admin durumu kontrol ediliyor...'}
            {status === 'admin' && 'Bu hesap zaten admin yetkisine sahip.'}
            {status === 'not-admin' && 'Bu hesaba admin yetkisi vermek için aşağıdaki butonu kullanın.'}
            {status === 'pending' && 'Kullanıcı bilgileri yükleniyor...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm">
              <div>Email: {user.email}</div>
              <div>Mevcut Rol: {role || 'Belirlenmedi'}</div>
            </div>
            {status === 'not-admin' && (
              <Button
                className="w-full"
                onClick={setAdminRole}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Admin Rolü Ayarlanıyor...
                  </>
                ) : (
                  'Admin Rolünü Ayarla'
                )}
              </Button>
            )}
            {status === 'admin' && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Admin rolü başarıyla ayarlandı
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}