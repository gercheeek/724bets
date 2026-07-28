import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#333', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#ff4444' }}>Sistem Hatası Yakalandı</h1>
          <p>Lütfen aşağıdaki hata mesajını kopyalayıp asistana iletin:</p>
          <pre style={{ backgroundColor: '#000', padding: '15px', borderRadius: '8px', overflowX: 'auto', maxWidth: '90%', color: '#00ff00', fontSize: '14px' }}>
            {this.state.error?.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </pre>
          <button 
            onClick={() => {
              localStorage.removeItem('site_current_member');
              localStorage.removeItem('site_member');
              window.location.reload();
            }}
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Hatayı Temizle ve Geri Dön
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
