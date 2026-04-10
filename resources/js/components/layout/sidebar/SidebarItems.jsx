export const SidebarContent = [
  {
    heading: 'Main',
    children: [
      {
        name: "Dashboard",
        icon: "LayoutDashboard",
        url: "/dashboard",
      },
      {
        name: "Products",
        icon: "Package",
        url: "/products",
      },
      {
        name: "Orders",
        icon: "ShoppingCart",
        url: "/orders",
      },
    ],
  },
  {
    heading: 'User Management',
    children: [
      {
        name: 'Stores',
        icon: 'Store',
        url: '/dashboard/stores',
      },
      {
        name: 'Influencers',
        icon: 'Sparkles',
        url: '/dashboard/influencers',
      },
      {
        name: 'Clients',
        icon: 'Users',
        url: '/dashboard/clients',
      },
      {
        name: 'Shipping Companies',
        icon: 'Truck',
        url: '/dashboard/shipping-companies',
      },
      {
        name: 'Shipping Employees',
        icon: 'UserCog',
        url: '/dashboard/shipping-employees',
      },
    ],
  },
  {
    heading: 'System',
    children: [
      {
        name: 'Analytics',
        icon: 'BarChart3',
        url: '/analytics',
      },
      {
        name: 'Settings',
        icon: 'Settings',
        url: '/settings',
      },
    ],
  },
  {
    heading: 'Account',
    children: [
      {
        name: 'Profile',
        icon: 'UserCircle',
        url: '/profile',
      },
      {
        name: 'Logout',
        icon: 'LogOut',
        url: '/logout',
      },
    ],
  },
];

export default SidebarContent;
