import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLocation('/admin/login');
        return;
      }
    };

    checkAuth();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch('/api/stats/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setLocation('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setLocation('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido al panel de administración</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        ) : stats ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Products */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Productos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                  </div>
                  <Package className="text-blue-500" size={40} />
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Pedidos Totales</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="text-green-500" size={40} />
                </div>
              </div>

              {/* Pending Orders */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Pedidos Pendientes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                  </div>
                  <AlertCircle className="text-yellow-500" size={40} />
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Ingresos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">S/. {(stats.totalSales || 0).toFixed(2)}</p>
                  </div>
                  <TrendingUp className="text-red-500" size={40} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Add Product */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <Package className="text-blue-500 mb-4" size={32} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Agregar Producto</h3>
                <p className="text-gray-600 text-sm mb-4">Crea un nuevo producto para tu tienda</p>
                <a
                  href="/admin/products/new"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  Crear Producto
                </a>
              </div>

              {/* View Orders */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <ShoppingCart className="text-green-500 mb-4" size={32} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ver Pedidos</h3>
                <p className="text-gray-600 text-sm mb-4">Gestiona todos los pedidos recibidos</p>
                <a
                  href="/admin/orders"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                >
                  Ver Pedidos
                </a>
              </div>

              {/* Manage Products */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <Users className="text-purple-500 mb-4" size={32} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestionar Productos</h3>
                <p className="text-gray-600 text-sm mb-4">Edita o elimina productos existentes</p>
                <a
                  href="/admin/products"
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
                >
                  Ir a Productos
                </a>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
