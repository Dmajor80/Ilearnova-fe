import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Search, Filter, Download, Eye, Edit, Trash2, Copy, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getVouchers, deleteVoucher, getVoucherStats } from '../../../api/voucherApi';

const VoucherList = ({ organizationId }) => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Fetch vouchers from API
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const response = await getVouchers({ organizationId });
        if (response.success) {
          setVouchers(response.data);
          setFilteredVouchers(response.data);
        } else {
          // Fallback to mock data if API fails
          console.warn('API call failed, using mock data');
          const mockVouchers = [
            {
              id: 1,
              code: 'WELCOME2024',
              title: 'Welcome Discount',
              description: '20% off first month subscription',
              type: 'percentage',
              value: 20,
              maxUses: 100,
              usedCount: 45,
              expiryDate: '2024-12-31T23:59:59Z',
              status: 'active',
              createdBy: 'Admin User',
              createdAt: '2024-01-15T10:00:00Z',
              redeemedBy: [
                { userId: 1, userName: 'John Doe', redeemedAt: '2024-01-20T14:30:00Z' },
                { userId: 2, userName: 'Jane Smith', redeemedAt: '2024-01-22T09:15:00Z' }
              ]
            },
            {
              id: 2,
              code: 'STUDENT50',
              title: 'Student Discount',
              description: '$50 off annual subscription',
              type: 'fixed',
              value: 50,
              maxUses: 50,
              usedCount: 50,
              expiryDate: '2024-06-30T23:59:59Z',
              status: 'expired',
              createdBy: 'Admin User',
              createdAt: '2024-01-10T08:00:00Z',
              redeemedBy: []
            },
            {
              id: 3,
              code: 'BULK100',
              title: 'Bulk Purchase',
              description: '100% off for bulk orders (10+ licenses)',
              type: 'percentage',
              value: 100,
              maxUses: 25,
              usedCount: 12,
              expiryDate: '2024-12-31T23:59:59Z',
              status: 'active',
              createdBy: 'Sales Manager',
              createdAt: '2024-02-01T12:00:00Z',
              redeemedBy: []
            },
            {
              id: 4,
              code: 'REFERRAL25',
              title: 'Referral Bonus',
              description: '25% off for referred users',
              type: 'percentage',
              value: 25,
              maxUses: null, // unlimited
              usedCount: 67,
              expiryDate: null, // no expiry
              status: 'active',
              createdBy: 'Marketing Team',
              createdAt: '2024-01-01T00:00:00Z',
              redeemedBy: []
            },
            {
              id: 5,
              code: 'HOLIDAY30',
              title: 'Holiday Special',
              description: '30% off holiday promotion',
              type: 'percentage',
              value: 30,
              maxUses: 200,
              usedCount: 89,
              expiryDate: '2024-01-31T23:59:59Z',
              status: 'expired',
              createdBy: 'Marketing Team',
              createdAt: '2023-12-15T10:00:00Z',
              redeemedBy: []
            }
          ];
          setVouchers(mockVouchers);
          setFilteredVouchers(mockVouchers);
        }
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        // Fallback to mock data on error
        const mockVouchers = [
          {
            id: 1,
            code: 'WELCOME2024',
            title: 'Welcome Discount',
            description: '20% off first month subscription',
            type: 'percentage',
            value: 20,
            maxUses: 100,
            usedCount: 45,
            expiryDate: '2024-12-31T23:59:59Z',
            status: 'active',
            createdBy: 'Admin User',
            createdAt: '2024-01-15T10:00:00Z',
            redeemedBy: [
              { userId: 1, userName: 'John Doe', redeemedAt: '2024-01-20T14:30:00Z' },
              { userId: 2, userName: 'Jane Smith', redeemedAt: '2024-01-22T09:15:00Z' }
            ]
          }
        ];
        setVouchers(mockVouchers);
        setFilteredVouchers(mockVouchers);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [organizationId]);

  useEffect(() => {
    const filtered = vouchers.filter(voucher => {
      const matchesSearch = voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           voucher.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || voucher.status === filterStatus;
      const matchesType = filterType === 'all' || voucher.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
    setFilteredVouchers(filtered);
  }, [vouchers, searchTerm, filterStatus, filterType]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'disabled': return <Clock className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    return type === 'percentage' ? 'Percentage' : 'Fixed Amount';
  };

  const getValueDisplay = (type, value) => {
    return type === 'percentage' ? `${value}%` : `$${value}`;
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // Show success message
  };

  const exportVouchers = () => {
    // Mock export functionality
    const csvContent = [
      ['Code', 'Title', 'Type', 'Value', 'Max Uses', 'Used', 'Status', 'Expiry'],
      ...filteredVouchers.map(v => [
        v.code,
        v.title,
        getTypeLabel(v.type),
        getValueDisplay(v.type, v.value),
        v.maxUses || 'Unlimited',
        v.usedCount,
        v.status,
        v.expiryDate ? new Date(v.expiryDate).toLocaleDateString() : 'No Expiry'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vouchers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vouchers</h1>
          <p className="text-gray-600 mt-1">Manage discount codes and promotional offers</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportVouchers}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Voucher</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Vouchers</p>
              <p className="text-2xl font-bold text-gray-900">{vouchers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Vouchers</p>
              <p className="text-2xl font-bold text-gray-900">
                {vouchers.filter(v => v.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Redemptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {vouchers.reduce((sum, v) => sum + v.usedCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Ticket className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Usage Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((vouchers.reduce((sum, v) => sum + v.usedCount, 0) /
                  vouchers.reduce((sum, v) => sum + (v.maxUses || v.usedCount), 0)) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vouchers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="disabled">Disabled</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Ticket className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-900">{voucher.title}</div>
                          <button
                            onClick={() => copyToClipboard(voucher.code)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-500 font-mono">{voucher.code}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{voucher.description}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getTypeLabel(voucher.type)}
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {getValueDisplay(voucher.type, voucher.value)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {voucher.usedCount} / {voucher.maxUses || '∞'}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: voucher.maxUses
                            ? `${(voucher.usedCount / voucher.maxUses) * 100}%`
                            : `${Math.min(voucher.usedCount / 10, 1) * 100}%`
                        }}
                      ></div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                      {getStatusIcon(voucher.status)}
                      <span className="ml-1 capitalize">{voucher.status}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voucher.expiryDate
                      ? new Date(voucher.expiryDate).toLocaleDateString()
                      : 'No expiry'
                    }
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedVoucher(voucher)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVouchers.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vouchers found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Voucher Detail Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Voucher Details</h3>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-mono text-lg">{selectedVoucher.code}</span>
                    <button
                      onClick={() => copyToClipboard(selectedVoucher.code)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedVoucher.status)}`}>
                    {getStatusIcon(selectedVoucher.status)}
                    <span className="ml-1 capitalize">{selectedVoucher.status}</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-600">{selectedVoucher.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1 text-sm text-gray-900">{getTypeLabel(selectedVoucher.type)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Value</label>
                  <p className="mt-1 text-sm font-semibold text-green-600">
                    {getValueDisplay(selectedVoucher.type, selectedVoucher.value)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usage</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedVoucher.usedCount} / {selectedVoucher.maxUses || '∞'}
                  </p>
                </div>
              </div>

              {selectedVoucher.expiryDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedVoucher.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedVoucher.redeemedBy && selectedVoucher.redeemedBy.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recent Redemptions</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedVoucher.redeemedBy.slice(0, 5).map((redemption, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{redemption.userName}</span>
                        <span className="text-gray-500">
                          {new Date(redemption.redeemedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherList;
