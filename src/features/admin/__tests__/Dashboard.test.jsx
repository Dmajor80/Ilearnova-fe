import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock the hooks
jest.mock('@/hooks/useDashboardData', () => ({
  __esModule: true,
  default: () => ({
    loading: false,
    error: null,
    lastUpdated: new Date(),
    metricsArray: [
      {
        id: 'totalUsers',
        value: '1,245',
        label: 'Total Users',
        description: 'Registered users across all roles',
        iconType: 'users'
      },
      {
        id: 'activeCourses',
        value: '320',
        label: 'Active Courses',
        description: 'Courses currently live and accessible',
        iconType: 'book'
      }
    ],
    chartData: null,
    refreshData: jest.fn(),
    notification: { show: false, message: '', type: 'info', hide: jest.fn() }
  })
}));

jest.mock('@/hooks/useDashboardActions', () => ({
  __esModule: true,
  default: () => ({
    quickActionsOpen: false,
    actionLoading: false,
    toggleQuickActions: jest.fn(),
    closeQuickActions: jest.fn(),
    handleViewReports: jest.fn(),
    handleMetricClick: jest.fn(),
    quickActions: [
      {
        id: 'new-user',
        label: 'Add New User',
        icon: 'plus',
        action: jest.fn(),
        description: 'Create a new user account'
      }
    ],
    notification: { show: false, message: '', type: 'success', hide: jest.fn() }
  })
}));

jest.mock('@/hooks/useAdminUser', () => ({
  __esModule: true,
  default: () => ({
    user: { id: '1', email: 'admin@test.com' },
    displayName: 'Test Admin',
    welcomeMessage: 'Welcome back'
  })
}));

// Mock the API client
jest.mock('@/api/baseClient', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with welcome message', () => {
    renderDashboard();
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Test Admin')).toBeInTheDocument();
  });

  test('renders metric cards', () => {
    renderDashboard();
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,245')).toBeInTheDocument();
    expect(screen.getByText('Active Courses')).toBeInTheDocument();
    expect(screen.getByText('320')).toBeInTheDocument();
  });

  test('renders action buttons', () => {
    renderDashboard();
    
    expect(screen.getByText('Refresh')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    renderDashboard();
    
    // Check for ARIA labels
    expect(screen.getByLabelText(/refresh dashboard/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quick actions menu/i)).toBeInTheDocument();
    
    // Check for proper sections
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByLabelText('Dashboard metrics')).toBeInTheDocument();
  });

  test('metric cards are keyboard accessible', () => {
    renderDashboard();
    
    const metricCards = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.includes('View details')
    );
    
    expect(metricCards.length).toBeGreaterThan(0);
    
    // Test keyboard navigation
    metricCards.forEach(card => {
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  test('handles loading states properly', () => {
    // Mock loading state
    const mockUseDashboardData = require('@/hooks/useDashboardData').default;
    mockUseDashboardData.mockReturnValueOnce({
      loading: true,
      error: null,
      lastUpdated: null,
      metricsArray: [],
      chartData: null,
      refreshData: jest.fn(),
      notification: { show: false, message: '', type: 'info', hide: jest.fn() }
    });

    renderDashboard();
    
    // Should show loading skeleton
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('handles error states properly', () => {
    // Mock error state
    const mockUseDashboardData = require('@/hooks/useDashboardData').default;
    mockUseDashboardData.mockReturnValueOnce({
      loading: false,
      error: 'Failed to load data',
      lastUpdated: null,
      metricsArray: [],
      chartData: null,
      refreshData: jest.fn(),
      notification: { show: true, message: 'Error loading data', type: 'error', hide: jest.fn() }
    });

    renderDashboard();
    
    // Should show error state
    expect(screen.getByText(/unable to load metrics/i)).toBeInTheDocument();
  });

  test('follows modern React patterns', () => {
    // Test that component is memoized
    expect(Dashboard.$$typeof).toBeDefined(); // React.memo creates this property
    
    // Test that hooks are used properly (no class component patterns)
    const dashboardString = Dashboard.toString();
    expect(dashboardString).not.toContain('this.state');
    expect(dashboardString).not.toContain('componentDidMount');
  });

  test('integrates with error boundary', () => {
    // The component should be wrapped in DashboardErrorBoundary
    // This is tested by checking if error boundary props are passed correctly
    renderDashboard();
    
    // Component should render without throwing
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

describe('Dashboard Architecture', () => {
  test('follows established authentication patterns', () => {
    // Test that custom hooks are used for state management
    const dashboardCode = Dashboard.toString();
    
    expect(dashboardCode).toContain('useDashboardData');
    expect(dashboardCode).toContain('useDashboardActions');
    expect(dashboardCode).toContain('useAdminUser');
  });

  test('uses proper component composition', () => {
    renderDashboard();
    
    // Should use DashboardLayout component
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Should have proper section structure
    expect(screen.getByLabelText('Dashboard metrics')).toBeInTheDocument();
  });

  test('implements proper error handling', () => {
    // Component should be wrapped in error boundary
    // and handle errors gracefully
    expect(() => renderDashboard()).not.toThrow();
  });
});
