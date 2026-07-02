import { HiOutlineCalendar, HiOutlineShoppingBag, HiOutlineKey, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

export default function AccountSummaryCard({ 
  memberSince = 'N/A',
  totalOrders = 0,
  loginMethod = 'Email',
  registrationDate = null,
  isEmailVerified = false
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  const stats = [
    {
      label: 'Member Since',
      value: memberSince,
      icon: HiOutlineCalendar,
      color: 'text-blue-600'
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: HiOutlineShoppingBag,
      color: 'text-green-600'
    },
    {
      label: 'Login Method',
      value: loginMethod,
      icon: HiOutlineKey,
      color: 'text-purple-600'
    },
    {
      label: 'Registration Date',
      value: formatDate(registrationDate),
      icon: HiOutlineCalendar,
      color: 'text-indigo-600'
    },
    {
      label: 'Email Status',
      value: isEmailVerified ? 'Verified' : 'Not Verified',
      icon: isEmailVerified ? HiOutlineCheckCircle : HiOutlineXCircle,
      color: isEmailVerified ? 'text-green-600' : 'text-yellow-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
        Account Summary
      </h3>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className={`flex items-center justify-between py-3 ${
                index < stats.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-gray-600 font-medium">{stat.label}</span>
              </div>
              <span className="font-bold text-gray-900 text-lg">
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

