import { useState } from 'react';
import { Menu, X, Heart, LogOut, Settings } from 'lucide-react';
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
    <nav className="sticky top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" onClick={closeMenu}>
            <a className="flex items-center gap-2 text-2xl font-bold text-red-600 hover:text-red-700 transition-colors">
              <Heart size={28} className="fill-red-600" />
              <span className="hidden sm:inline">Regala Amor</span>
            </a>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/">
              <a className={`font-semibold transition-colors ${
                isActive('/') 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}>
                Inicio
              </a>
            </Link>

            {isAdmin && (
              <>
                <Link href="/admin">
                  <a className={`font-semibold transition-colors ${
                    isActive('/admin') 
                      ? 'text-red-600 border-b-2 border-red-600' 
                      : 'text-gray-700 hover:text-red-600'
                  }`}>
                    Dashboard
                  </a>
                </Link>

                <Link href="/admin/products">
                  <a className={`font-semibold transition-colors ${
                    isActive('/admin/products') 
                      ? 'text-red-600 border-b-2 border-red-600' 
                      : 'text-gray-700 hover:text-red-600'
                  }`}>
                    Productos
                  </a>
                </Link>

                <Link href="/admin/orders">
                  <a className={`font-semibold transition-colors ${
                    isActive('/admin/orders') 
                      ? 'text-red-600 border-b-2 border-red-600' 
                      : 'text-gray-700 hover:text-red-600'
                  }`}>
                    Pedidos
                  </a>
                </Link>
              </>
            )}
          </div>

          {/* Admin Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <>
                <Link href="/admin/settings">
                  <a className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings size={20} />
                  </a>
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <LogOut size={18} />
                  Salir
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
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
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link href="/">
              <a
                onClick={closeMenu}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-red-50 text-red-600 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Inicio
              </a>
            </Link>

            {isAdmin && (
              <>
                <Link href="/admin">
                  <a
                    onClick={closeMenu}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive('/admin') 
                        ? 'bg-red-50 text-red-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </a>
                </Link>

                <Link href="/admin/products">
                  <a
                    onClick={closeMenu}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive('/admin/products') 
                        ? 'bg-red-50 text-red-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Productos
                  </a>
                </Link>

                <Link href="/admin/orders">
                  <a
                    onClick={closeMenu}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive('/admin/orders') 
                        ? 'bg-red-50 text-red-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Pedidos
                  </a>
                </Link>

                <Link href="/admin/settings">
                  <a
                    onClick={closeMenu}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive('/admin/settings') 
                        ? 'bg-red-50 text-red-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Configuración
                  </a>
                </Link>

                <button
                  onClick={() => {
                    closeMenu();
                    onLogout?.();
                  }}
                  className="w-full mt-2 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <LogOut size={18} />
                  Salir
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
