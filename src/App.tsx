/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { SourceProvenanceModal } from './components/SourceProvenanceModal';
import { OverviewDashboard } from './views/OverviewDashboard';
import { ProjectsView } from './views/ProjectsView';
import { ProjectDetailView } from './views/ProjectDetailView';
import { WhatIfSimulatorView } from './views/WhatIfSimulatorView';
import { AlertsCenterView } from './views/AlertsCenterView';
import { DataSourcesCatalogView } from './views/DataSourcesCatalogView';
import { CopilotView } from './views/CopilotView';
import { GISMapView } from './views/GISMapView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './hooks/useAuth';
import { ProjectRecord, AlertItem, DataSourceProvenance, UserRole } from './types';

export default function App() {
  const { user, role, loading: authLoading, updateRole } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State
  const [projects, setProjects] = useState<ProjectRecord[]>([]);

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [dataSources, setDataSources] = useState<DataSourceProvenance[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncingSourceId, setSyncingSourceId] = useState<string | null>(null);

  // Provenance Modal State
  const [provModalOpen, setProvModalOpen] = useState(false);
  const [provData, setProvData] = useState<any>(null);
  const [provMetric, setProvMetric] = useState<{label?: string, val?: any}>({});

  const fetchData = async () => {
    try {
      const { collection, getDocs, doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('./lib/firebase');
      const { seedDatabaseIfNeeded } = await import('./lib/seed');
      
      const projectsRef = collection(db, 'projects');
      const initialProjSnap = await getDocs(projectsRef);
      const shouldForceSeed = initialProjSnap.empty || initialProjSnap.size < 3;
      const seeded = await seedDatabaseIfNeeded(shouldForceSeed);

      const [projSnap, alertsSnap, dsSnap, kpiSnap] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'alerts')),
        getDocs(collection(db, 'dataSources')),
        getDoc(doc(db, 'system', 'kpis'))
      ]);

      const loadedProjects = projSnap.docs.map(d => {
        const p = d.data() as ProjectRecord;
        if (typeof p.route_coordinates === 'string') {
          try {
            p.route_coordinates = JSON.parse(p.route_coordinates);
          } catch (e) {
            console.error('Failed to parse route_coordinates', e);
          }
        }
        return p;
      });
      const loadedAlerts = alertsSnap.docs.map(d => d.data() as AlertItem);
      const loadedDs = dsSnap.docs.map(d => d.data() as DataSourceProvenance);
      
      setProjects(loadedProjects);
      setAlerts(loadedAlerts);
      setDataSources(loadedDs);
      setKpis(kpiSnap.exists() ? kpiSnap.data() : null);
    } catch (err) {
      console.error('Failed to fetch data from Firestore', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
  };

  const handleOpenSimulator = (projectId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    setActiveTab('simulator');
  };

  const handleOpenCopilot = (projectId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    setActiveTab('copilot');
  };

  const handleOpenProvenance = (project: ProjectRecord, metricLabel?: string, metricValue?: any) => {
    const ds = dataSources.find(d => d.source_id === project.source_id);
    setProvData(ds || {
      source_id: project.source_id,
      dataset_name: project.source_name,
      source_url: project.source_url,
      retrieved_at: project.last_updated,
      is_official: project.is_official_data
    });
    setProvMetric({ label: metricLabel, val: metricValue });
    setProvModalOpen(true);
  };

  const handleUpdateAlertStatus = async (id: string, status: string) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('./lib/firebase');
      await updateDoc(doc(db, 'alerts', id), { status });
      fetchData(); // Refresh to get updated alerts
    } catch (err) {
      console.error(err);
    }
  };

  const handleSyncDataSource = async (id: string) => {
    setSyncingSourceId(id);
    try {
      await fetch(`/api/data-sources/${id}/sync`, { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingSourceId(null);
    }
  };

  const handleTestConnection = async (id: string) => {
    try {
      const res = await fetch(`/api/data-sources/${id}/test`, { method: 'POST' });
      const data = await res.json();
      alert(`Connection Test Result:\n\nSuccess: ${data.success}\nMessage: ${data.message}`);
    } catch (err) {
      alert('Failed to test connection.');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full text-slate-500">Loading InfraShield Engine...</div>;
    }

    if (selectedProjectId && activeTab !== 'simulator' && activeTab !== 'copilot') {
      const project = projects.find(p => p.project_id === selectedProjectId);
      if (project) {
        return (
          <ProjectDetailView 
            project={project} 
            onBack={handleBackToProjects} 
            onOpenSimulator={() => handleOpenSimulator(project.project_id)}
            onOpenCopilot={() => handleOpenCopilot(project.project_id)}
            onOpenProvenance={handleOpenProvenance}
          />
        );
      }
    }

    switch (activeTab) {
      case 'overview':
        return (
          <OverviewDashboard 
            projects={projects} 
            alerts={alerts} 
            kpis={kpis} 
            onSelectProject={handleSelectProject} 
            onOpenSimulator={handleOpenSimulator}
            onOpenProvenance={handleOpenProvenance}
          />
        );
      case 'projects':
        return (
          <ProjectsView 
            projects={projects} 
            onSelectProject={handleSelectProject}
            onOpenSimulator={handleOpenSimulator}
            onOpenProvenance={handleOpenProvenance}
          />
        );
      case 'map':
        return <GISMapView projects={projects} onSelectProject={handleSelectProject} />;
      case 'simulator':
        return <WhatIfSimulatorView projects={projects} onSelectProject={handleSelectProject} />;
      case 'alerts':
        return <AlertsCenterView alerts={alerts} onUpdateStatus={handleUpdateAlertStatus} onSelectProject={handleSelectProject} />;
      case 'datasources':
        return <DataSourcesCatalogView dataSources={dataSources} onTestConnection={handleTestConnection} onSync={handleSyncDataSource} syncingId={syncingSourceId} />;
      case 'copilot':
        return <CopilotView projects={projects} contextProjectId={selectedProjectId || undefined} onSelectProject={handleSelectProject} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
            <p>Module currently undergoing maintenance.</p>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    if (selectedProjectId && activeTab !== 'simulator' && activeTab !== 'copilot') return 'Project Intelligence Detail';
    switch (activeTab) {
      case 'overview': return 'Command Center Overview';
      case 'projects': return 'Project Registry';
      case 'map': return 'Geospatial Risk Map';
      case 'simulator': return 'What-If Intervention Simulator';
      case 'alerts': return 'Early-Warning Alerts';
      case 'datasources': return 'Data Sources & Auditing';
      case 'copilot': return 'AI Officer Copilot';
      default: return 'InfraShield';
    }
  };

  const openAlertsCount = alerts.filter(a => a.status === 'Open').length;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
        Initializing InfraShield Security...
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'simulator' && tab !== 'copilot') setSelectedProjectId(null);
          setIsMobileMenuOpen(false);
        }} 
        userRole={role} 
        onChangeRole={updateRole}
        openAlertsCount={openAlertsCount}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title={getPageTitle()} 
          userRole={role} 
          onRefreshData={handleRefresh}
          isRefreshing={isRefreshing}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {renderContent()}
        </main>
      </div>

      <SourceProvenanceModal 
        isOpen={provModalOpen} 
        onClose={() => setProvModalOpen(false)} 
        provenance={provData}
        metricLabel={provMetric.label}
        metricValue={provMetric.val}
      />
      <OfflineIndicator />
    </div>
  );
}
