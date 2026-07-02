import Link from 'next/link';
import { 
  HiOutlineShoppingBag, 
  HiOutlineLockClosed, 
  HiOutlineCog 
} from 'react-icons/hi';

export default function QuickActionsCard() {
  const actions = [
    {
      href: '/orders',
      icon: HiOutlineShoppingBag,
      label: 'My Orders',
      description: 'View order history'
    },
    {
      href: '/cart',
      icon: HiOutlineShoppingBag,
      label: 'Shopping Cart',
      description: 'Items in cart'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isLink = action.href !== '#';
          
          const content = (
            <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all group cursor-pointer">
              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-black transition-colors">
                <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-700 group-hover:text-black transition-colors">
                  {action.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {action.description}
                </div>
              </div>
            </div>
          );

          if (isLink) {
            return (
              <Link key={index} href={action.href} className="block">
                {content}
              </Link>
            );
          }

          return (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full text-left"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

