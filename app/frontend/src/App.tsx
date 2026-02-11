import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home } from '@/pages/Home';
import { Dashboard } from '@/pages/Dashboard';
import { Listings } from '@/pages/Listings';
import { CreateListing } from '@/pages/CreateListing';
import { ListingDetail } from '@/pages/ListingDetail';
import { Search } from '@/pages/Search';
import { SessionGuide } from '@/pages/SessionGuide';
import Pricing from '@/pages/Pricing';
import { ToastProvider } from '@/components/ui/toast';
import { client } from '@/lib/api';
import AuthCallback from '@/pages/AuthCallback';

interface User {
  data?: {
    id: string;
    email?: string;
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await client.auth.me();
      if (userData?.data?.id) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    await client.auth.toLogin();
  };

  const handleLogout = async () => {
    await client.auth.logout();
    setUser(null);
  };

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 flex flex-col">
          <Header 
            user={user} 
            loading={loading}
            onLogin={handleLogin} 
            onLogout={handleLogout} 
          />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home user={user} onLogin={handleLogin} />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/search" element={<Search />} />
              <Route path="/guide/session" element={<SessionGuide />} />
              <Route path="/pricing" element={<Pricing />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;