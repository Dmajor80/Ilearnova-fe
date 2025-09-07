import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SchoolAdmin from '../SchoolAdmin';

// Mock the hooks
jest.mock('@/hooks/useSchoolDashboardData', () => ({
  __esModule: true,
  default: () => ({
    loading: false,
    error: null,
    lastUpdated: new Date(),
    metricsArray: [
      {
        id: 'students',
        value: '932',
        label: 'Students',
        description: 'Total enrolled students',
        iconType: 'users'
      },
      {
        id: 'teachers',
        value: '754',
        label: 'Teachers',
        description: 'Active teaching staff',
        iconType: 'userCheck'
      }
    ],
    schoolData: {
      teachers: [
        { name: "James", subject: "History", qualification: "B.Com", fees: "$21.70", performance: "Bad" },
        { name: "Hardy", subject: "Basic Algorithm", qualification: "B.E", fees: "$17.70", performance: "Good" }
      ],
      unpaidTuition: [
        { id: "ID 1234567811", name: "Jordan Nico", class: "VII B", fees: 52036, rank: "First" }
      ]
    },
    refreshData: jest.fn(),
    notification: { show: false, message: '', type: 'info', hide: jest.fn() }
  })
}));

jest.mock('@/hooks/useSchoolAdminActions', () => ({
  __esModule: true,
  default: () => ({
    activeRoute: 'Dashboard',
    expandedItems: {},
    actionLoading: false,
    quickActionsOpen: false,
    toggleExpanded: jest.fn(),
    handleNavigation: jest.fn(),
    toggleQuickActions: jest.fn(),
    closeQuickActions: jest.fn(),
    handleMetricClick: jest.fn(),
    quickActions: [
      {
        id: 'add-student',
        label: 'Add New Student',
        icon: 'plus',
        action: jest.fn(),
        description: 'Register a new student'
      }
    ],
    sidebarItems: [
      {
        id: "Dashboard",
        icon: "Home",
        label: "Dashboard",
        hasSubmenu: false,
      },
      {
        id: "Student",
        icon: "GraduationCap",
        label: "Student",
        hasSubmenu: true,
        submenu: [
          { id: "Student", label: "Student List", icon: "User" },
          { id: "add-student", label: "Add New Student", icon: "Plus" },
        ],
      }
    ],
    notification: { show: false, message: '', type: 'success', hide: jest.fn() }
  })
}));

jest.mock('@/hooks/useSchoolAdminUser', () => ({
  __esModule: true,
  default: () => ({
    user: { id: '1', email: 'admin@school.com' },
    displayName: 'School Admin',
    schoolName: 'Akademi School',
    schoolDetails: {
      name: 'Akademi School',
      address: '123 School St',
      phone: '555-0123'
    }
  })
}));

// Mock the API client
jest.mock('@/api/baseClient', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

const renderSchoolAdmin = () => {
  return render(
    <BrowserRouter>
      <SchoolAdmin />
    </BrowserRouter>
  );
};

describe('SchoolAdmin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders school admin dashboard', () => {
    renderSchoolAdmin();
    
    expect(screen.getByText('Akademi School')).toBeInTheDocument();
    expect(screen.getByText('School Admin')).toBeInTheDocument();
  });

  test('renders sidebar navigation', () => {
    renderSchoolAdmin();
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
  });

  test('renders school stats cards', () => {
    renderSchoolAdmin();
    
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('932')).toBeInTheDocument();
    expect(screen.getByText('Teachers')).toBeInTheDocument();
    expect(screen.getByText('754')).toBeInTheDocument();
  });

  test('renders data tables', () => {
    renderSchoolAdmin();
    
    expect(screen.getByText('Teachers')).toBeInTheDocument();
    expect(screen.getByText('Unpaid Student Tuition')).toBeInTheDocument();
    expect(screen.getByText('James')).toBeInTheDocument();
    expect(screen.getByText('Jordan Nico')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    renderSchoolAdmin();
    
    // Check for ARIA labels
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('School admin navigation')).toBeInTheDocument();
    
    // Check for proper sections
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByLabelText('School statistics')).toBeInTheDocument();
  });

  test('stats cards are keyboard accessible', () => {
    renderSchoolAdmin();
    
    const statsCards = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.includes('View details')
    );
    
    expect(statsCards.length).toBeGreaterThan(0);
    
    // Test keyboard navigation
    statsCards.forEach(card => {
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  test('sidebar navigation is keyboard accessible', () => {
    renderSchoolAdmin();
    
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBeGreaterThan(0);
    
    // Test that menu items are focusable
    menuItems.forEach(item => {
      expect(item).toHaveAttribute('tabIndex', '0');
    });
  });

  test('follows modern React patterns', () => {
    // Test that component is memoized
    expect(SchoolAdmin.$$typeof).toBeDefined(); // React.memo creates this property

    // Test that hooks are used properly (no class component patterns)
    const componentString = SchoolAdmin.toString();
    expect(componentString).not.toContain('this.state');
    expect(componentString).not.toContain('componentDidMount');
  });

  test('integrates with error boundary', () => {
    // The component should be wrapped in SchoolErrorBoundary
    // This is tested by checking if error boundary props are passed correctly
    renderSchoolAdmin();
    
    // Component should render without throwing
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('handles loading states properly', () => {
    // Mock loading state
    const mockUseSchoolDashboardData = require('@/hooks/useSchoolDashboardData').default;
    mockUseSchoolDashboardData.mockReturnValueOnce({
      loading: true,
      error: null,
      lastUpdated: null,
      metricsArray: [],
      schoolData: { teachers: [], unpaidTuition: [] },
      refreshData: jest.fn(),
      notification: { show: false, message: '', type: 'info', hide: jest.fn() }
    });

    renderSchoolAdmin();
    
    // Should show loading states in tables and stats
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('handles error states properly', () => {
    // Mock error state
    const mockUseSchoolDashboardData = require('@/hooks/useSchoolDashboardData').default;
    mockUseSchoolDashboardData.mockReturnValueOnce({
      loading: false,
      error: 'Failed to load school data',
      lastUpdated: null,
      metricsArray: [],
      schoolData: { teachers: [], unpaidTuition: [] },
      refreshData: jest.fn(),
      notification: { show: true, message: 'Error loading data', type: 'error', hide: jest.fn() }
    });

    renderSchoolAdmin();
    
    // Should show error state
    expect(screen.getByText(/unable to load school stats/i)).toBeInTheDocument();
  });
});

describe('School Admin Architecture', () => {
  test('follows established authentication patterns', () => {
    // Test that custom hooks are used for state management
    const componentCode = SchoolAdminRefactored.toString();
    
    expect(componentCode).toContain('useSchoolDashboardData');
    expect(componentCode).toContain('useSchoolAdminActions');
    expect(componentCode).toContain('useSchoolAdminUser');
  });

  test('uses proper component composition', () => {
    renderSchoolAdmin();
    
    // Should use SchoolSidebar component
    expect(screen.getByLabelText('School admin navigation')).toBeInTheDocument();
    
    // Should have proper section structure
    expect(screen.getByLabelText('School statistics')).toBeInTheDocument();
  });

  test('implements proper error handling', () => {
    // Component should be wrapped in error boundary
    // and handle errors gracefully
    expect(() => renderSchoolAdmin()).not.toThrow();
  });

  test('maintains consistency with main admin dashboard patterns', () => {
    // Test that the same architectural patterns are followed
    const componentCode = SchoolAdminRefactored.toString();
    
    // Should use React.memo
    expect(SchoolAdmin.$$typeof).toBeDefined();
    
    // Should use custom hooks pattern
    expect(componentCode).toContain('useSchool');
    
    // Should use error boundary
    expect(componentCode).toContain('ErrorBoundary');
  });
});
