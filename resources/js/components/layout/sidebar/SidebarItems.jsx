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
      {
        name: "Customers",
        icon: "Users",
        url: "/customers",
      },
    ],
  },
  {
    heading: 'Management',
    children: [
      {
        name: 'Stores',
        icon: 'Store',
        url: '/stores',
      },
      {
        name: 'Influencers',
        icon: 'Sparkles',
        url: '/influencers',
      },
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
