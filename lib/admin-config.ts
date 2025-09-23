// Admin Configuration
export const ADMIN_CONFIG = {
  // Admin credentials (for initial setup)
  DEFAULT_ADMIN: {
    email: 'admin@jonsstore.com',
    password: 'admin123456',
    name: 'JonsStore Administrator'
  },
  
  // Admin features
  FEATURES: {
    PRODUCT_MANAGEMENT: true,
    ORDER_MANAGEMENT: true,
    USER_MANAGEMENT: true,
    ANALYTICS: true,
    SETTINGS: true
  },
  
  // Security settings
  SECURITY: {
    REQUIRE_ADMIN_ROLE: true,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
  },
  
  // Admin dashboard settings
  DASHBOARD: {
    ITEMS_PER_PAGE: 10,
    REFRESH_INTERVAL: 30000, // 30 seconds
    SHOW_ANALYTICS: true,
    SHOW_RECENT_ORDERS: true,
    SHOW_PRODUCT_STATS: true
  }
}

// Admin role permissions
export const ADMIN_PERMISSIONS = {
  PRODUCTS: {
    CREATE: true,
    READ: true,
    UPDATE: true,
    DELETE: false, // Prevent accidental deletion
    BULK_UPDATE: true
  },
  ORDERS: {
    READ: true,
    UPDATE_STATUS: true,
    CANCEL: true,
    REFUND: false // Requires additional verification
  },
  USERS: {
    READ: true,
    UPDATE_ROLE: true,
    SUSPEND: true,
    DELETE: false // Prevent accidental deletion
  },
  ANALYTICS: {
    VIEW_SALES: true,
    VIEW_USERS: true,
    EXPORT_DATA: true
  },
  SETTINGS: {
    UPDATE_STORE_INFO: true,
    UPDATE_PAYMENT_SETTINGS: false, // Requires additional verification
    UPDATE_SHIPPING_SETTINGS: true
  }
}

// Admin navigation menu
export const ADMIN_MENU = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/admin',
    permission: 'dashboard'
  },
  {
    id: 'products',
    label: 'Products',
    icon: 'Package',
    path: '/admin/products',
    permission: 'products.read'
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: 'ShoppingCart',
    path: '/admin/orders',
    permission: 'orders.read'
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'Users',
    path: '/admin/users',
    permission: 'users.read'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    path: '/admin/analytics',
    permission: 'analytics.view_sales'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/admin/settings',
    permission: 'settings.update_store_info'
  }
]

// Admin status messages
export const ADMIN_MESSAGES = {
  ACCESS_DENIED: 'You do not have permission to access this resource.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_LOCKED: 'Account has been locked due to multiple failed login attempts.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  ADMIN_REQUIRED: 'Admin access is required for this action.',
  OPERATION_SUCCESS: 'Operation completed successfully.',
  OPERATION_FAILED: 'Operation failed. Please try again.'
}

// Admin validation rules
export const ADMIN_VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 254
  },
  PRODUCT: {
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 1000,
    PRICE_MIN: 0,
    PRICE_MAX: 999999999,
    STOCK_MIN: 0,
    STOCK_MAX: 99999
  }
}
