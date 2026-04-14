import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProductsPage } from './components/ProductsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { AuthModal } from './components/AuthModal';
import { CartSheet } from './components/CartSheet';
import { CheckoutModal } from './components/CheckoutModal';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    customer: null,
  });

  const [adminAuth, setAdminAuth] = useState({
    isAuthenticated: false,
    user: null,
  });
  
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedAuth = localStorage.getItem('ecommerce_auth');
    const storedAdminAuth = localStorage.getItem('admin_auth');
    const storedCart = localStorage.getItem('ecommerce_cart');
    
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        localStorage.removeItem('ecommerce_auth');
      }
    }

    if (storedAdminAuth) {
      try {
        const parsedAdminAuth = JSON.parse(storedAdminAuth);
        setAdminAuth(parsedAdminAuth);
        setCurrentPage('admin-dashboard');
      } catch (error) {
        localStorage.removeItem('admin_auth');
      }
    }
    
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      } catch (error) {
        localStorage.removeItem('ecommerce_cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    console.log('Admin Auth State Changed:', {
      isAuthenticated: adminAuth.isAuthenticated,
      user: adminAuth.user,
      currentPage: currentPage
    });
  }, [adminAuth, currentPage]);
  
  const login = (customer) => {
    const newAuth = { isAuthenticated: true, customer };
    setAuth(newAuth);
    localStorage.setItem('ecommerce_auth', JSON.stringify(newAuth));
    setAuthModalOpen(false);
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, customer: null });
    localStorage.removeItem('ecommerce_auth');
    setCart([]);
    localStorage.removeItem('ecommerce_cart');
  };

  const adminLogin = (user) => {
    console.log('adminLogin called with user:', user);
    const newAdminAuth = { isAuthenticated: true, user };
    setAdminAuth(newAdminAuth);
    localStorage.setItem('admin_auth', JSON.stringify(newAdminAuth));
    console.log('Setting current page to admin-dashboard');
    setCurrentPage('admin-dashboard');
    setAuthModalOpen(false);
  };

  const adminLogout = () => {
    setAdminAuth({ isAuthenticated: false, user: null });
    localStorage.removeItem('admin_auth');
    setCurrentPage('home');
  };

  const addToCart = (product, quantity = 1) => {
    if (!auth.isAuthenticated) {
      setAuthModalOpen(true);
      setAuthMode('login');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const renderCurrentPage = () => {
    console.log('Rendering page:', currentPage, 'adminAuth:', adminAuth);
    
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToProducts={() => setCurrentPage('products')} />;
      case 'products':
        return <ProductsPage addToCart={addToCart} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin-dashboard':
        console.log('Attempting to render admin dashboard...');
        if (adminAuth.isAuthenticated && adminAuth.user) {
          console.log('Admin is authenticated, rendering Dashboard component');
          return <Dashboard user={adminAuth.user} onLogout={adminLogout} />;
        } else {
          console.log('Admin not authenticated, redirecting to home');
          setCurrentPage('home');
          return <HomePage onNavigateToProducts={() => setCurrentPage('products')} />;
        }
      default:
        return <HomePage onNavigateToProducts={() => setCurrentPage('products')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentPage !== 'admin-dashboard' && (
        <Header
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          auth={auth}
          onLogin={() => openAuth('login')}
          onRegister={() => openAuth('register')}
          onLogout={logout}
          cartItemCount={getTotalItems()}
          onOpenCart={() => setCartOpen(true)}
        />
      )}
      
      <main>
        {renderCurrentPage()}
      </main>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onLogin={login}
        onAdminLogin={adminLogin}
      />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        totalPrice={getTotalPrice()}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        totalPrice={getTotalPrice()}
        customer={auth.customer}
        onOrderComplete={clearCart}
      />

      <Toaster />
    </div>
  );
}