import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import useGeolocation from '../hooks/useGeolocation';

const EmergencyContext = createContext(null);

export function EmergencyProvider({ children }) {
  const geo = useGeolocation();
  const [emergencyMode, setEmergencyMode] = useState(false);
  // Latest incident created from the Emergency page, e.g. { id: 'SS-EMG-2026-50401', type: 'medical', status: 'reported' }
  const [activeIncident, setActiveIncident] = useState(null);

  const startEmergency = useCallback(() => setEmergencyMode(true), []);
  const endEmergency = useCallback(() => {
    setEmergencyMode(false);
    setActiveIncident(null);
  }, []);

  const value = useMemo(
    () => ({ emergencyMode, startEmergency, endEmergency, activeIncident, setActiveIncident, geo }),
    [emergencyMode, startEmergency, endEmergency, activeIncident, geo]
  );
  return <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>;
}

export function useEmergency() {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error('useEmergency must be used inside <EmergencyProvider>');
  return ctx;
}
