import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

// Public Pages
import PortfolioHome from './pages/PortfolioHome';

// Admin Auth Pages
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminLayout';

// Admin Subsections
import Dashboard from './admin/Dashboard';
import ProfileManagement from './admin/ProfileManagement';
import SkillsManagement from './admin/SkillsManagement';
import ProjectsManagement from './admin/ProjectsManagement';
import EducationManagement from './admin/EducationManagement';
import CertificationsManagement from './admin/CertificationsManagement';
import ExperienceManagement from './admin/ExperienceManagement';
import MessagesManagement from './admin/MessagesManagement';
import CustomSectionsManagement from './admin/CustomSectionsManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<PortfolioHome />} />

          {/* Admin Authentication Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Guarded Admin Dashboard Router Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfileManagement />} />
            <Route path="skills" element={<SkillsManagement />} />
            <Route path="projects" element={<ProjectsManagement />} />
            <Route path="education" element={<EducationManagement />} />
            <Route path="certifications" element={<CertificationsManagement />} />
            <Route path="experience" element={<ExperienceManagement />} />
            <Route path="messages" element={<MessagesManagement />} />
            <Route path="sections" element={<CustomSectionsManagement />} />
          </Route>

          {/* Wildcard Fallback redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
