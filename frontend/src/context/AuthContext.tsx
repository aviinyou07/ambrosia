"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from './CartContext';
import { createOrder as createOrderApi } from '@/lib/apis';

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: Address;
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  addresses: Address[];
  addAddress: (addr: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  getOrderById: (orderId: string) => Order | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('avyara_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedAddresses = localStorage.getItem('avyara_addresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      } else {
        // default dummy address
        setAddresses([
          {
            id: 'addr-1',
            fullName: 'Ananya Sharma',
            street: 'Flat 402, Royal Palms, Palm Beach Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400706',
            phone: '+91 98765 43210',
            isDefault: true,
          }
        ]);
      }

      const savedOrders = localStorage.getItem('avyara_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Sample seed order for demonstration
        setOrders([
          {
            id: 'AVY-98214',
            date: 'October 8, 2026',
            items: [
              {
                id: 'prod-1',
                title: 'Floral Block Print Cotton Kurta Set',
                slug: 'floral-block-print-cotton-kurta-set',
                price: 2699,
                originalPrice: 4499,
                image: '/images/ethnic_kurta_set_1789624822973.jpg',
                size: 'M',
                quantity: 1,
              }
            ],
            subtotal: 2699,
            discount: 0,
            shippingFee: 0,
            total: 2699,
            status: 'Delivered',
            shippingAddress: {
              id: 'addr-1',
              fullName: 'Ananya Sharma',
              street: 'Flat 402, Royal Palms, Palm Beach Road',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400706',
              phone: '+91 98765 43210'
            },
            paymentMethod: 'UPI'
          }
        ]);
      }
    } catch {
      // ignore JSON errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        localStorage.setItem('avyara_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('avyara_user');
      }
      localStorage.setItem('avyara_addresses', JSON.stringify(addresses));
      localStorage.setItem('avyara_orders', JSON.stringify(orders));
    }
  }, [user, addresses, orders, isLoaded]);

  const login = (email: string, name = 'Valued Customer') => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone: '+91 98765 43210',
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addr,
      id: 'addr-' + Date.now(),
    };
    setAddresses(prev => [newAddr, ...prev]);
  };

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `AVY-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Confirmed',
    };

    setOrders(prev => [newOrder, ...prev]);

    // Asynchronously persist to backend PostgreSQL
    createOrderApi({
      id: orderId,
      customer_name: orderData.shippingAddress.fullName || user?.name || 'Valued Customer',
      customer_email: user?.email || 'customer@example.com',
      customer_phone: orderData.shippingAddress.phone || user?.phone || '+91 98765 00000',
      shipping_address: {
        address: orderData.shippingAddress.street,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        pincode: orderData.shippingAddress.pincode,
      },
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shipping_fee: orderData.shippingFee,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      items: orderData.items.map(it => ({
        product_title: it.title,
        product_image: it.image,
        size: it.size,
        quantity: it.quantity,
        unit_price: it.price,
      })),
    } as any).catch(err => {
      console.warn('Backend order persistence skipped (local fallback active):', err);
    });

    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    const cleanId = orderId.trim().toUpperCase();
    return orders.find(o => o.id.toUpperCase() === cleanId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        addresses,
        addAddress,
        removeAddress,
        orders,
        createOrder,
        getOrderById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
