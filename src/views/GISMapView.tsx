import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ProjectRecord } from '../types';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  projects: ProjectRecord[];
  onSelectProject: (projectId: string) => void;
}

const BoundsUpdater: React.FC<{ projects: ProjectRecord[] }> = ({ projects }) => {
  const map = useMap();
  useEffect(() => {
    const validProjects = projects.filter(p => typeof p.latitude === 'number' && typeof p.longitude === 'number');
    if (validProjects.length === 0) return;
    const bounds = L.latLngBounds(validProjects.map(p => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, projects]);
  return null;
};

export const GISMapView: React.FC<Props> = ({ projects, onSelectProject }) => {
  const defaultCenter: [number, number] = [15.3173, 75.7139]; // Karnataka Center

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return '#ef4444'; // rose-500
      case 'High': return '#f97316'; // orange-500
      case 'Medium': return '#f59e0b'; // amber-500
      case 'Low': return '#10b981'; // emerald-500
      default: return '#3b82f6';
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Geospatial Risk Mapping (Karnataka Grid)</h2>
          <p className="text-xs text-slate-500">Visualizing corridor alignments and localized delay bottlenecks</p>
        </div>
        <div className="flex space-x-3 text-[11px] font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>Critical</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span><span>High</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Medium</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Low</span></div>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-slate-200 overflow-hidden shadow-2xs bg-slate-100 relative z-0">
        <MapContainer center={defaultCenter} zoom={7} className="w-full h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <BoundsUpdater projects={projects} />
          
          {projects.filter(p => typeof p.latitude === 'number' && typeof p.longitude === 'number').map(project => (
            <React.Fragment key={project.id}>
              {/* Marker for primary location */}
              <Marker position={[project.latitude, project.longitude]}>
                <Popup className="rounded-xl overflow-hidden">
                  <div className="p-1 min-w-[200px]">
                    <span className="text-[10px] font-mono text-slate-500">{project.project_id}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 mb-2 leading-tight">{project.project_name}</h3>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="block text-slate-400">Risk Score</span>
                        <span className="font-bold text-slate-900">{project.overall_risk_score}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400">Delay</span>
                        <span className="font-bold text-rose-600">+{project.predicted_delay_months}m</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onSelectProject(project.project_id)}
                      className="w-full py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-xs font-semibold transition-colors"
                    >
                      Inspect Detail
                    </button>
                  </div>
                </Popup>
              </Marker>

              {/* Polyline for Route Coordinates if available */}
              {project.route_coordinates && project.route_coordinates.length > 0 && (
                <React.Fragment>
                  <Polyline 
                    positions={project.route_coordinates.filter(c => c && c.length >= 2 && typeof c[0] === 'number' && typeof c[1] === 'number').map(coord => [coord[1], coord[0]])} // GeoJSON is [lon, lat], Leaflet is [lat, lon]
                    pathOptions={{ 
                      color: getRiskColor(project.risk_level), 
                      weight: 5,
                      opacity: 0.9,
                      lineCap: 'round',
                      lineJoin: 'round'
                    }} 
                  />
                  {/* Show individual points for accuracy */}
                  {project.route_coordinates.map((coord, idx) => (
                    coord && coord.length >= 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number' ? (
                    <CircleMarker 
                      key={`${project.id}-pt-${idx}`}
                      center={[coord[1], coord[0]]} 
                      radius={4}
                      pathOptions={{
                        color: '#ffffff',
                        weight: 1.5,
                        fillColor: getRiskColor(project.risk_level),
                        fillOpacity: 1
                      }}
                    >
                      <Popup className="rounded-xl overflow-hidden text-xs">
                        <div className="font-bold text-slate-900 mb-1">{project.project_name}</div>
                        <div className="text-slate-500 font-mono">Lat: {coord[1].toFixed(4)}</div>
                        <div className="text-slate-500 font-mono">Lon: {coord[0].toFixed(4)}</div>
                      </Popup>
                    </CircleMarker>
                    ) : null
                  ))}
                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
