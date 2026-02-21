import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import CareerTimeline from './components/CareerTimeline';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';

const VA = React.lazy(() => import('./components/VA'));
const IntuneMigration = React.lazy(() => import('./components/IntuneMigration'));
const AdminConsole = React.lazy(() => import('./components/AdminConsole'));
const ProjectsManager = React.lazy(() => import('./components/ProjectsManager'));
const CareerTimelineManager = React.lazy(() => import('./components/CareerTimelineManager'));
const SuisaPortal = React.lazy(() => import('./components/SuisaPortal'));
const TreasurePage = React.lazy(() => import('./components/TreasurePage'));
const NotFound = React.lazy(() => import('./components/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Laden...</p>
      </div>
    </div>
  );
}

function AccessDenied({ message, buttonText, onAction }: { message: string; buttonText: string; onAction: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Zugriff verweigert</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, check, loadingText }: { children: React.ReactNode; check: () => { allowed: boolean; needsAuth: boolean }; loadingText: string }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">{loadingText}</p>
        </div>
      </div>
    );
  }

  const { allowed, needsAuth } = check();

  if (!user || needsAuth) {
    return (
      <AccessDenied
        message="Sie muessen angemeldet sein, um auf diese Seite zuzugreifen."
        buttonText="Zur Startseite"
        onAction={() => { window.location.href = '/'; }}
      />
    );
  }

  if (!allowed) {
    return (
      <AccessDenied
        message="Sie haben keine Berechtigung, auf diese Seite zuzugreifen."
        buttonText="Zurueck"
        onAction={() => { window.history.back(); }}
      />
    );
  }

  return <>{children}</>;
}

function AdminRoute() {
  const { isAdmin, user } = useAuth();
  return (
    <ProtectedRoute check={() => ({ allowed: isAdmin, needsAuth: !user })} loadingText="Ueberprüfe Berechtigung...">
      <Suspense fallback={<PageLoader />}>
        <AdminConsole />
      </Suspense>
    </ProtectedRoute>
  );
}

function ProjectsRoute() {
  const { isAdmin, user } = useAuth();
  return (
    <ProtectedRoute check={() => ({ allowed: isAdmin, needsAuth: !user })} loadingText="Ueberprüfe Berechtigung...">
      <Suspense fallback={<PageLoader />}>
        <ProjectsManager />
      </Suspense>
    </ProtectedRoute>
  );
}

function CareerRoute() {
  const { isAdmin, user } = useAuth();
  return (
    <ProtectedRoute check={() => ({ allowed: isAdmin, needsAuth: !user })} loadingText="Ueberprüfe Berechtigung...">
      <Suspense fallback={<PageLoader />}>
        <CareerTimelineManager />
      </Suspense>
    </ProtectedRoute>
  );
}

function SuisaRoute() {
  const { isSuisaMember, user } = useAuth();
  return (
    <ProtectedRoute check={() => ({ allowed: isSuisaMember, needsAuth: !user })} loadingText="Ueberprüfe SUISA-Berechtigung...">
      <Suspense fallback={<PageLoader />}>
        <SuisaPortal />
      </Suspense>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                  <Navigation />
                  <Hero />
                  <About />
                  <CareerTimeline />
                  <Services />
                  <Portfolio />
                  <Certifications />
                  <Contact />
                  <Footer />
                </div>
              } />
              <Route path="/va" element={<VA />} />
              <Route path="/intune-migration" element={<IntuneMigration />} />
              <Route path="/admin" element={<AdminRoute />} />
              <Route path="/admin/projects" element={<ProjectsRoute />} />
              <Route path="/admin/career" element={<CareerRoute />} />
              <Route path="/suisa" element={<SuisaRoute />} />
              <Route path="/louisa" element={<TreasurePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
