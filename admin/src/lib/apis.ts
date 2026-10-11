/**
 * Ambrosia Admin Central API Client
 * Target Host: admin.ambrosiavastra.com
 * Powered by NEXT_PUBLIC_API_URL environment variable
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
).replace(/\/$/, '');

export const R2_PUBLIC_URL = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-8204a887dc104db5bc9768e902671861.r2.dev'
).replace(/\/$/, '');

/**
 * Get headers including Bearer token if present
 */
export const getHeaders = (customToken?: string, isMultipart: boolean = false) => {
  const headers: Record<string, string> = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  const token =
    customToken ||
    (typeof window !== 'undefined' ? localStorage.getItem('ambrosia_admin_token') : null);

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Master Endpoints Reference
 */
export const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    me: `${API_BASE_URL}/auth/me`,
  },
  analytics: {
    dashboard: `${API_BASE_URL}/analytics/dashboard`,
    revenueTrend: `${API_BASE_URL}/analytics/revenue-trend`,
  },
  products: {
    list: `${API_BASE_URL}/products`,
    get: (slug: string) => `${API_BASE_URL}/products/${slug}`,
    create: `${API_BASE_URL}/products`,
    update: (id: string) => `${API_BASE_URL}/products/${id}`,
    delete: (id: string) => `${API_BASE_URL}/products/${id}`,
  },
  categories: {
    list: `${API_BASE_URL}/categories`,
    get: (slug: string) => `${API_BASE_URL}/categories/${slug}`,
    create: `${API_BASE_URL}/categories`,
    update: (id: string) => `${API_BASE_URL}/categories/${id}`,
    delete: (id: string) => `${API_BASE_URL}/categories/${id}`,
  },
  orders: {
    list: `${API_BASE_URL}/orders`,
    get: (id: string) => `${API_BASE_URL}/orders/${id}`,
    updateStatus: (id: string) => `${API_BASE_URL}/orders/${id}/status`,
  },
  inventory: {
    list: `${API_BASE_URL}/inventory`,
    updateStock: (variantId: string) => `${API_BASE_URL}/inventory/${variantId}/stock`,
  },
  customers: {
    list: `${API_BASE_URL}/customers`,
    get: (id: string) => `${API_BASE_URL}/customers/${id}`,
    updateRole: (id: string) => `${API_BASE_URL}/customers/${id}/role`,
  },
  coupons: {
    list: `${API_BASE_URL}/coupons`,
    create: `${API_BASE_URL}/coupons`,
    toggleStatus: (id: string) => `${API_BASE_URL}/coupons/${id}/status`,
    delete: (id: string) => `${API_BASE_URL}/coupons/${id}`,
  },
  returns: {
    list: `${API_BASE_URL}/returns`,
    get: (id: string) => `${API_BASE_URL}/returns/${id}`,
    updateStatus: (id: string) => `${API_BASE_URL}/returns/${id}/status`,
  },
  media: {
    upload: `${API_BASE_URL}/media/upload`,
    list: `${API_BASE_URL}/media/list`,
    presign: `${API_BASE_URL}/media/presign`,
  },
};

/**
 * Standard HTTP Fetch Request Wrapper
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const isFormData = options.body instanceof FormData;
    const res = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(undefined, isFormData),
        ...(options.headers || {}),
      },
    });

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.error(`Admin API Error on [${url}]:`, error);
    return {
      success: false,
      message: error.message || 'Server connection error',
    };
  }
}

// ----------------- Explicit Typed Admin Action Methods -----------------

// 1. Auth
export const adminLogin = async (credentials: { email: string; password: string }) => {
  return apiRequest<{ token: string; user: any }>(ENDPOINTS.auth.login, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const getAdminProfile = async () => {
  return apiRequest<any>(ENDPOINTS.auth.me);
};

// 2. Analytics
export const getDashboardAnalytics = async () => {
  return apiRequest<any>(ENDPOINTS.analytics.dashboard);
};

export const getRevenueTrend = async (days = 30) => {
  return apiRequest<any[]>(`${ENDPOINTS.analytics.revenueTrend}?days=${days}`);
};

// 3. Products
export const getAdminProducts = async (filters: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.limit) params.append('limit', String(filters.limit));
  if (filters.offset) params.append('offset', String(filters.offset));
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<any[]>(`${ENDPOINTS.products.list}${qs}`);
};

export const createProduct = async (productData: any) => {
  return apiRequest<any>(ENDPOINTS.products.create, {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id: string, updates: any) => {
  return apiRequest<any>(ENDPOINTS.products.update(id), {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteProduct = async (id: string) => {
  return apiRequest<{ id: string }>(ENDPOINTS.products.delete(id), {
    method: 'DELETE',
  });
};

// 4. Categories
export const getAdminCategories = async () => {
  return apiRequest<any[]>(ENDPOINTS.categories.list);
};

export const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order?: number;
}) => {
  return apiRequest<any>(ENDPOINTS.categories.create, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCategory = async (id: string, data: any) => {
  return apiRequest<any>(ENDPOINTS.categories.update(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteCategory = async (id: string) => {
  return apiRequest<{ id: string }>(ENDPOINTS.categories.delete(id), {
    method: 'DELETE',
  });
};

// 5. Orders
export const getAdminOrders = async (filters: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  if (filters.limit) params.append('limit', String(filters.limit));
  if (filters.offset) params.append('offset', String(filters.offset));
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<any[]>(`${ENDPOINTS.orders.list}${qs}`);
};

export const getAdminOrderDetails = async (id: string) => {
  return apiRequest<any>(ENDPOINTS.orders.get(id));
};

export const updateOrderStatus = async (
  id: string,
  status: string,
  tracking_carrier?: string,
  tracking_number?: string
) => {
  return apiRequest<any>(ENDPOINTS.orders.updateStatus(id), {
    method: 'PATCH',
    body: JSON.stringify({ status, tracking_carrier, tracking_number }),
  });
};

// 6. Inventory
export const getAdminInventory = async (lowStockOnly = false) => {
  const qs = lowStockOnly ? '?lowStock=true' : '';
  return apiRequest<any[]>(`${ENDPOINTS.inventory.list}${qs}`);
};

export const updateInventoryStock = async (variantId: string, quantity: number) => {
  return apiRequest<any>(ENDPOINTS.inventory.updateStock(variantId), {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
};

// 7. Customers
export const getAdminCustomers = async (search?: string) => {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiRequest<any[]>(`${ENDPOINTS.customers.list}${qs}`);
};

export const getAdminCustomerDetails = async (id: string) => {
  return apiRequest<any>(ENDPOINTS.customers.get(id));
};

export const updateCustomerRole = async (id: string, role: 'customer' | 'admin') => {
  return apiRequest<any>(ENDPOINTS.customers.updateRole(id), {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
};

// 8. Coupons
export const getAdminCoupons = async () => {
  return apiRequest<any[]>(ENDPOINTS.coupons.list);
};

export const createCoupon = async (data: {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value?: number;
  usage_limit?: number;
  expires_at?: string;
}) => {
  return apiRequest<any>(ENDPOINTS.coupons.create, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const toggleCouponActive = async (id: string, is_active: boolean) => {
  return apiRequest<any>(ENDPOINTS.coupons.toggleStatus(id), {
    method: 'PATCH',
    body: JSON.stringify({ is_active }),
  });
};

export const deleteCoupon = async (id: string) => {
  return apiRequest<{ id: string }>(ENDPOINTS.coupons.delete(id), {
    method: 'DELETE',
  });
};

// 9. Returns
export const getAdminReturns = async (status?: string) => {
  const qs = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
  return apiRequest<any[]>(`${ENDPOINTS.returns.list}${qs}`);
};

export const getAdminReturnDetails = async (id: string) => {
  return apiRequest<any>(ENDPOINTS.returns.get(id));
};

export const updateReturnRequestStatus = async (id: string, status: string) => {
  return apiRequest<any>(ENDPOINTS.returns.updateStatus(id), {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// 10. Media / R2
export const uploadMediaFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequest<{ url: string; filename: string; size: number }>(ENDPOINTS.media.upload, {
    method: 'POST',
    body: formData,
  });
};

export const listMediaAssets = async () => {
  return apiRequest<Array<{ key: string; url: string; size: number; lastModified: string }>>(
    ENDPOINTS.media.list
  );
};
