import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isConnectionError = this.state.error?.message.includes('client is offline') || 
                               this.state.error?.message.includes('Cloud Firestore backend');

      if (isConnectionError) {
        return (
          <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <h2 className="text-white text-2xl font-bold mb-4">Connectivity Notice</h2>
              <p className="text-gray-400 mb-6">
                We're currently experiencing a connection issue with our cloud database. 
                The application will continue to work using local assets.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-6 py-2 rounded-full font-bold"
              >
                Retry Connection
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h1 className="text-white text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
            <p className="text-gray-400 mb-8">
              An unexpected error occurred.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
