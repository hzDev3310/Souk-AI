export const SidebarContent = [
  {
    heading: 'Main',
    children: [
      {
        name: "Dashboard",
        icon: "LayoutDashboard",
        url: "/dashboard",
        roles: ['ADMIN', 'STORE', 'INFLUENCER', 'CLIENT'],
      },
      {
        name: "Products",
        icon: "Package",
        url: "/dashboard/products",
        roles: ['ADMIN', 'STORE', 'CLIENT'],
      },
      {
        name: "Categories",
        icon: "Layers",
        url: "/dashboard/categories",
        roles: ['ADMIN'],
      },
      {
        name: "Orders",
        icon: "ShoppingCart",
        url: "/dashboard/orders",
        roles: ['ADMIN', 'STORE', 'CLIENT'],
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
        roles: ['ADMIN'],
      },
      {
        name: 'Influencers',
        icon: 'Sparkles',
        url: '/dashboard/influencers',
        roles: ['ADMIN'],
      },
      {
        name: 'Clients',
        icon: 'Users',
        url: '/dashboard/clients',
        roles: ['ADMIN'],
      },
      {
        name: 'Shipping Companies',
        icon: 'Truck',
        url: '/dashboard/shipping-companies',
        roles: ['ADMIN'],
      },
      {
        name: 'Shipping Employees',
        icon: 'UserCog',
        url: '/dashboard/shipping-employees',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    heading: 'System',
    children: [
      {
        name: 'Analytics',
        icon: 'BarChart3',
        url: '/dashboard/analytics',
        roles: ['ADMIN', 'STORE'],
      },
      {
        name: 'Settings',
        icon: 'Settings',
        url: '/dashboard/settings',
        roles: ['ADMIN', 'STORE', 'INFLUENCER', 'CLIENT'],
      },
      {
        name: 'Parameters',
        icon: 'Sliders',
        url: '/dashboard/parameters',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    heading: 'Account',
    children: [
      {
        name: 'Profile',
        icon: 'UserCircle',
        url: '/dashboard/profile',
        roles: ['ADMIN', 'STORE', 'INFLUENCER', 'CLIENT'],
      },
      {
        name: 'Logout',
        icon: 'LogOut',
        url: '/logout',
        roles: ['ADMIN', 'STORE', 'INFLUENCER', 'CLIENT'],
      },
    ],
  },
];

export default SidebarContent;
