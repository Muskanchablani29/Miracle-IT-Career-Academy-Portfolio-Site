import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import './DashboardErrorBoundary.css';

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="dashboard-error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <FaExclamationTriangle />
            </div>
            <h2>Oops! Something went wrong</h2>
            <p>We're having trouble loading your dashboard. This might be a temporary issue.</p>
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-btn">
                <FaRedo /> Try Again
              </button>
              <button onClick={() => window.location.href = '/student'} className="home-btn">
                Go to Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;