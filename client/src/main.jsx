import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Charge Nova UI Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen bg-slate-950 text-slate-100 items-center justify-center p-6 font-sans">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-2xl w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
              ⚡
            </div>
            <h2 className="text-xl font-extrabold text-white">Charge Nova Runtime Notice</h2>
            <p className="text-xs text-slate-400">
              An unhandled exception occurred in the dashboard UI:
            </p>
            <div className="p-4 bg-slate-950 rounded-xl text-left border border-slate-800 overflow-x-auto text-xs font-mono text-rose-400 max-h-60">
              <p className="font-bold">{this.state.error?.toString()}</p>
              <pre className="mt-2 text-[10px] text-slate-400 whitespace-pre-wrap">{this.state.error?.stack}</pre>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl transition-all text-sm"
            >
              Reload Charge Nova Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
