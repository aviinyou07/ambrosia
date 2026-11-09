/**
 * Ambrosia Storefront Central API Client
 * Configured via process.env.NEXT_PUBLIC_API_URL
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
).replace(/\/$/, '');

/**
 * Public base URL of the object storage (self-hosted RustFS).
 *
 * The fallback must stay in step with the storage host that next.config.ts
 * derives from the same variable: if they disagree, next/image rejects the host
 * and every image breaks at runtime with no build-time warning. It previously
 * fell back to a Cloudflare R2 bucket that this deployment no longer uses.
 */
export const STORAGE_PUBLIC_URL = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://s3.173.249.2.14.sslip.io/ambrosia'
).replace(/\/$/, '');

/** @deprecated Use STORAGE_PUBLIC_URL; kept so existing imports keep working. */
export const R2_PUBLIC_URL = STORAGE_PUBLIC_URL;

/**
 * Common Headers Generator
 */
export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authToken =
    token || (typeof window !== 'undefined' ? localStorage.getItem('avyara_token') : null);

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

/**
 * Endpoints Dictionary
 */
export const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`,
  },
  categories: {
    list: `${API_BASE_URL}/categories`,
    get: (slug: string) => `${API_BASE_URL}/categories/${slug}`,
  },
  products: {
    list: `${API_BASE_URL}/products`,
    get: (slug: string) => `${API_BASE_URL}/products/${slug}`,
  },
  orders: {
    create: `${API_BASE_URL}/orders`,
    get: (id: string) => `${API_BASE_URL}/orders/${id}`,
  },
  coupons: {
    validate: `${API_BASE_URL}/coupons/validate`,
  },
  returns: {
    create: `${API_BASE_URL}/returns`,
  },
};

/**
 * Generic API Fetcher
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {}),
      },
    });

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.error(`API Error on [${url}]:`, error);
    return {
      success: false,
      message: error.message || 'Network error occurred. Please try again.',
    };
  }
}

// ----------------- Storefront Action Methods -----------------

export const getProducts = async (params: {
  category?: string;
  search?: string;
  maxPrice?: number;
  isFeatured?: boolean;
  sortBy?: string;
  limit?: number;
  offset?: number;
} = {}) => {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  if (params.maxPrice) query.append('maxPrice', String(params.maxPrice));
  if (params.isFeatured !== undefined) query.append('isFeatured', String(params.isFeatured));
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.limit) query.append('limit', String(params.limit));
  if (params.offset) query.append('offset', String(params.offset));

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return apiFetch<any[]>(`${ENDPOINTS.products.list}${queryString}`);
};

export const getProductBySlug = async (slug: string) => {
  return apiFetch<any>(ENDPOINTS.products.get(slug));
};

export const getCategories = async () => {
  return apiFetch<any[]>(ENDPOINTS.categories.list);
};

export const createOrder = async (orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  payment_method: string;
  items: Array<{
    product_id?: string;
    product_title: string;
    product_image?: string;
    size: string;
    quantity: number;
    unit_price: number;
  }>;
}) => {
  return apiFetch<any>(ENDPOINTS.orders.create, {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const getOrderById = async (id: string) => {
  return apiFetch<any>(ENDPOINTS.orders.get(id));
};

export const validateCouponCode = async (code: string, cartTotal: number) => {
  return apiFetch<any>(ENDPOINTS.coupons.validate, {
    method: 'POST',
    body: JSON.stringify({ code, cartTotal }),
  });
};

export const submitReturn = async (data: {
  order_id: string;
  customer_email: string;
  request_type: string;
  reason: string;
  comments?: string;
}) => {
  return apiFetch<any>(ENDPOINTS.returns.create, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  return apiFetch<{ token: string; user: any }>(ENDPOINTS.auth.login, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  return apiFetch<{ token: string; user: any }>(ENDPOINTS.auth.register, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getCurrentUser = async (token?: string) => {
  return apiFetch<any>(ENDPOINTS.auth.me, {
    headers: getHeaders(token),
  });
};
