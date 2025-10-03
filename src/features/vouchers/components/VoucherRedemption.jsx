import React, { useState } from 'react';
import { Ticket, CheckCircle, XCircle, AlertCircle, Search, Gift, DollarSign, Percent, Clock } from 'lucide-react';
import { validateVoucher, redeemVoucher as redeemVoucherApi } from '../../../api/voucherApi';

const VoucherRedemption = ({ userId, onRedemptionSuccess }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [redemptionHistory, setRedemptionHistory] = useState([]);

  // Mock data for demonstration
  const mockVouchers = {
    'WELCOME2024': {
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
      isValid: true,
      canRedeem: true,
      discountAmount: 0, // Will be calculated based on cart/order
      message: 'Valid voucher! Ready to apply 20% discount.'
    },
    'EXPIRED123': {
      id: 2,
      code: 'EXPIRED123',
      title: 'Expired Voucher',
      description: 'This voucher has expired',
      type: 'fixed',
      value: 50,
      status: 'expired',
      isValid: false,
      canRedeem: false,
      message: 'This voucher has expired and cannot be used.'
    },
    'USEDUP456': {
      id: 3,
      code: 'USEDUP456',
      title: 'Used Up Voucher',
      description: 'Maximum uses reached',
      type: 'percentage',
      value: 15,
      maxUses: 50,
      usedCount: 50,
      status: 'active',
      isValid: false,
      canRedeem: false,
      message: 'This voucher has reached its maximum number of uses.'
    },
    'INVALID789': {
      id: null,
      code: 'INVALID789',
      isValid: false,
      canRedeem: false,
      message: 'Invalid voucher code. Please check and try again.'
    }
  };

  const validateVoucher = async () => {
    if (!voucherCode.trim()) {
      setValidationResult({
        isValid: false,
        canRedeem: false,
        message: 'Please enter a voucher code.'
      });
      return;
    }

    setLoading(true);
    setValidationResult(null);

    try {
      const response = await validateVoucher(voucherCode.toUpperCase(), userId);

      if (response.success) {
        const voucher = response.data;
        setValidationResult({
          ...voucher,
          isValid: true,
          canRedeem: true,
          discountAmount: calculateDiscount(voucher),
          message: 'Valid voucher! Ready to apply discount.'
        });
      } else {
        setValidationResult({
          isValid: false,
          canRedeem: false,
          message: response.message || 'Invalid voucher code. Please check and try again.'
        });
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        canRedeem: false,
        message: 'An error occurred while validating the voucher. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (voucher) => {
    // Mock calculation - in real app, this would be based on cart/order total
    const mockOrderTotal = 100; // $100 example

    if (voucher.type === 'percentage') {
      return (mockOrderTotal * voucher.value) / 100;
    } else {
      return Math.min(voucher.value, mockOrderTotal);
    }
  };

  const redeemVoucher = async () => {
    if (!validationResult || !validationResult.canRedeem) return;

    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const redemption = {
        id: Date.now(),
        code: voucherCode.toUpperCase(),
        title: validationResult.title,
        discountAmount: validationResult.discountAmount,
        redeemedAt: new Date().toISOString(),
        status: 'successful'
      };

      setRedemptionHistory(prev => [redemption, ...prev]);
      setValidationResult(null);
      setVoucherCode('');

      if (onRedemptionSuccess) {
        onRedemptionSuccess(redemption);
      }

    } catch (error) {
      setValidationResult(prev => ({
        ...prev,
        message: 'Failed to redeem voucher. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (result) => {
    if (!result) return null;

    if (result.isValid && result.canRedeem) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else {
      return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getStatusColor = (result) => {
    if (!result) return '';

    if (result.isValid && result.canRedeem) {
      return 'border-green-200 bg-green-50';
    } else {
      return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Ticket className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Redeem Voucher</h1>
        <p className="text-gray-600 mt-1">Enter your voucher code to get discounts on your purchases</p>
      </div>

      {/* Voucher Input */}
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voucher Code
              </label>
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Enter voucher code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-lg tracking-wider"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        validateVoucher();
                      }
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={validateVoucher}
                  disabled={loading || !voucherCode.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Checking...' : 'Validate'}
                </button>
              </div>
            </div>

            {/* Validation Result */}
            {validationResult && (
              <div className={`border-l-4 rounded-r-lg p-4 ${getStatusColor(validationResult)}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getStatusIcon(validationResult)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${
                      validationResult.isValid && validationResult.canRedeem
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}>
                      {validationResult.message}
                    </p>

                    {validationResult.isValid && validationResult.canRedeem && (
                      <div className="mt-3">
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{validationResult.title}</h4>
                              <p className="text-sm text-gray-600">{validationResult.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-lg font-bold text-green-600">
                                {validationResult.type === 'percentage' ? (
                                  <Percent className="w-5 h-5 mr-1" />
                                ) : (
                                  <DollarSign className="w-5 h-5 mr-1" />
                                )}
                                {validationResult.type === 'percentage'
                                  ? `${validationResult.value}%`
                                  : `$${validationResult.value}`
                                }
                              </div>
                              <div className="text-sm text-gray-500">
                                Save ${validationResult.discountAmount?.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {validationResult.expiryDate && (
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              Expires {new Date(validationResult.expiryDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={redeemVoucher}
                          disabled={loading}
                          className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Gift className="w-4 h-4" />
                          )}
                          <span>{loading ? 'Redeeming...' : 'Redeem Voucher'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Redemption History */}
      {redemptionHistory.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Redemptions</h3>
            <div className="space-y-3">
              {redemptionHistory.map((redemption) => (
                <div key={redemption.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{redemption.title}</p>
                      <p className="text-xs text-gray-500 font-mono">{redemption.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      -${redemption.discountAmount?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(redemption.redeemedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-2">How to Redeem Vouchers</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Enter your voucher code in the field above</li>
                <li>• Click "Validate" to check if the voucher is valid</li>
                <li>• If valid, click "Redeem Voucher" to apply the discount</li>
                <li>• Each voucher can only be used once per user</li>
                <li>• Make sure the voucher hasn't expired</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherRedemption;
