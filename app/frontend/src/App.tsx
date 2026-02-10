import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastProvider } from '@/components/ui/toast';
import { Home } from '@/pages/Home';
import { Dashboard } from '@/pages/Dashboard';
import { Listings } from '@/pages/Listings';
import { CreateListing } from '@/pages/CreateListing';
import { ListingDetail } from '@/pages/ListingDetail';
import { Search } from '@/pages/Search';
import AuthCallback from '@/pages/AuthCallback';
import { client } from '@/lib/api';

interface User {
  id: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await client.auth.me();
      if (response.data) {
        setUser({ id: response.data.id });
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 flex flex-col">
          <Header user={user} onLogout={handleLogout} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/listings" element={<Listings user={user} />} />
              <Route path="/listings/new" element={<CreateListing user={user} />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/search" element={<Search user={user} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;