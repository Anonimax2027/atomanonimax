import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Search } from './pages/Search';
import { Listings } from './pages/Listings';
import { CreateListing } from './pages/CreateListing';
import Pricing from './pages/Pricing';
import { BRZGuide } from './pages/BRZGuide';
import { SessionGuide } from './pages/SessionGuide';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/brz-guide" element={<BRZGuide />} />
        <Route path="/session-guide" element={<SessionGuide />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;