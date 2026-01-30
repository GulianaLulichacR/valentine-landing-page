import { useState } from 'react';
import { Menu, X, Heart, LogOut, LogIn } from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface NavbarProps {
  isAdmin?: boolean;
  onLogout?: () => void;
}

export default function Navbar({ isAdmin = false, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 group">
            <Heart size={28} className="fill-red-600 text-red-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="hidden sm:inline text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Regala Amor
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {/* Inicio */}
            <Link 
              href="/" 
              className={`font-semibold transition-all duration-300 pb-2 border-b-2 relative group ${
                isActive('/') 
                  ? 'text-red-600 border-red-600' 
                  : 'text-gray-700 border-transparent hover:text-red-600'
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Inicio
              {!isActive('/') && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
              )}
            </Link>

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link 
                  href="/admin" 
                  className={`font-semibold transition-all duration-300 pb-2 border-b-2 relative group ${
                    isActive('/admin') 
                      ? 'text-red-600 border-red-600' 
                      : 'text-gray-700 border-transparent hover:text-red-600'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Dashboard
                  {!isActive('/admin') && (
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  )}
                </Link>

                <Link 
                  href="/admin/products" 
                  className={`font-semibold transition-all duration-300 pb-2 border-b-2 relative group ${
                    isActive('/admin/products') 
                      ? 'text-red-600 border-red-600' 
                      : 'text-gray-700 border-transparent hover:text-red-600'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Productos
                  {!isActive('/admin/products') && (
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  )}
                </Link>

                <Link 
                  href="/admin/orders" 
                  className={`font-semibold transition-all duration-300 pb-2 border-b-2 relative group ${
                    isActive('/admin/orders') 
                      ? 'text-red-600 border-red-600' 
                      : 'text-gray-700 border-transparent hover:text-red-600'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Pedidos
                  {!isActive('/admin/orders') && (
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold group"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                Salir
              </button>
            ) : (
              <Link 
                href="/admin/login" 
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold group"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <LogIn size={18} className="group-hover:scale-110 transition-transform duration-300" />
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {isAdmin ? (
              <button
                onClick={onLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <Link 
                href="/admin/login" 
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogIn size={20} />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 animate-fade-in">
            <Link
              href="/"
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg transition-all duration-300 font-semibold ${
                isActive('/') 
                  ? 'bg-red-50 text-red-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Inicio
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-semibold ${
                    isActive('/admin') 
                      ? 'bg-red-50 text-red-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Dashboard
                </Link>

                <Link
                  href="/admin/products"
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-semibold ${
                    isActive('/admin/products') 
                      ? 'bg-red-50 text-red-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Productos
                </Link>

                <Link
                  href="/admin/orders"
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-semibold ${
                    isActive('/admin/orders') 
                      ? 'bg-red-50 text-red-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Pedidos
                </Link>
              </>
            )}

            {/* Mobile Auth Button */}
            {isAdmin ? (
              <button
                onClick={() => {
                  closeMenu();
                  onLogout?.();
                }}
                className="w-full mt-3 flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold justify-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <LogOut size={18} />
                Salir
              </button>
            ) : (
              <Link
                href="/admin/login"
                onClick={closeMenu}
                className="w-full mt-3 flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold justify-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <LogIn size={18} />
                Iniciar Sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
