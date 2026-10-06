import { useCallback, useState } from 'react';

/**
 * Browser location with permission fallback.
 * Location is only requested when request() is called (never on page load),
 * matching the UI promise: "SevaSaarthi asks permission before using precise location."
 *
 * status: idle | loading | granted | denied | unsupported | error
 */
export default function useGeolocation() {
  const [state, setState] = useState({ coords: null, status: 'idle', error: null });

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ coords: null, status: 'unsupported', error: 'Location is not supported on this device.' });
      return;
    }
    setState((s) => ({ ...s, status: 'loading', error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
          status: 'granted',
          error: null,
        }),
      (err) =>
        setState({
          coords: null,
          status: err.code === err.PERMISSION_DENIED ? 'denied' : 'error',
          error:
            err.code === err.PERMISSION_DENIED
              ? 'Location permission denied. You can search for your area manually.'
              : 'Could not get your location. Please try again or search manually.',
        }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  const setManual = useCallback((coords) => {
    setState({ coords, status: 'granted', error: null });
  }, []);

  return { ...state, request, setManual };
}
