import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F7F6] flex items-center justify-center p-6 text-slate-800">
          <div className="max-w-lg w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 font-extrabold text-xl">
                !
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-900">SevaSaarthi Recovered from an Error</h1>
                <p className="text-xs text-slate-500">The platform caught an issue and prevented a crash.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto max-h-40">
              {this.state.error?.toString()}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/';
                }}
                className="flex-1 rounded-lg bg-[#0F766E] py-2.5 text-xs font-bold text-white hover:bg-[#134E4A] transition-colors"
              >
                Reload SevaSaarthi
              </button>
              <a
                href="tel:112"
                className="rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors"
              >
                Call 112 (Emergency)
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
