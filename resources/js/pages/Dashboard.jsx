import React from 'react';
import CardBox from '@/components/shared/CardBox';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'primary',
    },
    {
      title: 'Orders',
      value: '2,350',
      change: '+15.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'secondary',
    },
    {
      title: 'Customers',
      value: '12,234',
      change: '+5.4%',
      trend: 'up',
      icon: Users,
      color: 'success',
    },
    {
      title: 'Growth',
      value: '+18.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'info',
    },
  ];

  const colorClasses = {
    primary: 'bg-lightprimary text-primary',
    secondary: 'bg-lightsecondary text-secondary',
    success: 'bg-lightsuccess text-success',
    info: 'bg-lightinfo text-info',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-link">Dashboard</h1>
        <p className="text-darklink">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <CardBox key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-darklink">{stat.title}</p>
                <h3 className="text-2xl font-bold text-link mt-1">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight size={16} className="text-success" />
                  ) : (
                    <ArrowDownRight size={16} className="text-error" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-success' : 'text-error'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-darklink">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </CardBox>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <CardBox className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-link">Recent Orders</h3>
              <button className="text-sm text-primary hover:text-primaryemphasis">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-darkborder">
                    <th className="text-left py-3 px-4 text-sm font-medium text-darklink">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-darklink">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-darklink">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-darklink">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-darkborder/50">
                    <td className="py-3 px-4 text-sm text-link">#ORD-001</td>
                    <td className="py-3 px-4 text-sm text-link">John Doe</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-lightsuccess text-success">Completed</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-link">$120.50</td>
                  </tr>
                  <tr className="border-b border-darkborder/50">
                    <td className="py-3 px-4 text-sm text-link">#ORD-002</td>
                    <td className="py-3 px-4 text-sm text-link">Jane Smith</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-lightwarning text-warning">Pending</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-link">$85.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-link">#ORD-003</td>
                    <td className="py-3 px-4 text-sm text-link">Mike Johnson</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-lightprimary text-primary">Processing</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-link">$230.25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBox>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-1">
          <CardBox className="p-6">
            <h3 className="text-lg font-semibold text-link mb-4">Top Products</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-lightprimary flex items-center justify-center">
                  <span className="text-primary font-bold">P1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-link">Premium Widget</p>
                  <p className="text-xs text-darklink">234 sales</p>
                </div>
                <p className="text-sm font-medium text-link">$12,340</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-lightsecondary flex items-center justify-center">
                  <span className="text-secondary font-bold">P2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-link">Deluxe Package</p>
                  <p className="text-xs text-darklink">189 sales</p>
                </div>
                <p className="text-sm font-medium text-link">$9,450</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-lightsuccess flex items-center justify-center">
                  <span className="text-success font-bold">P3</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-link">Starter Kit</p>
                  <p className="text-xs text-darklink">156 sales</p>
                </div>
                <p className="text-sm font-medium text-link">$7,800</p>
              </div>
            </div>
          </CardBox>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
