import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Subscriptions from './pages/Subscriptions/Subscriptions';
import './App.css';

export default function App() {
  return (
    <div className="app-layout" id="app-layout">
      <Sidebar />
      <main className="app-main" id="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
        </Routes>
      </main>
    </div>
  );
}
