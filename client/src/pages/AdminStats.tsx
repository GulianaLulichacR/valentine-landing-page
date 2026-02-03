import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Loader2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { SalesTrendChart, TopProductsChart, OrderStatusChart, StatCard } from '@/components/StatsCharts';

interface Overview {
  totalOrders: number;
  totalSales: number;
  totalProducts: number;
  pendingOrders: number;
}

interface SalesData {
  date: string;
  orders: number;
  sales: number;
}

interface ProductData {
  name: string;
  sales: number;
  revenue: number;
}

interface OrderStatusData {
  name: string;
  value: number;
}

interface RecentOrder {
  id: number;
  productName: string;
  senderName: string;
  price: number;
  status: string;
  date: string;
}

export default function AdminStats() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatusData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

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

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Fetch all stats in parallel
      const [overviewRes, salesRes, productsRes, statusRes, ordersRes] = await Promise.all([
        fetch('/api/stats/overview', { headers }),
        fetch('/api/stats/sales-by-day', { headers }),
        fetch('/api/stats/top-products', { headers }),
        fetch('/api/stats/orders-status', { headers }),
        fetch('/api/stats/recent-orders', { headers }),
      ]);

      if (overviewRes.status === 401 || salesRes.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setLocation('/admin/login');
        return;
      }

      if (!overviewRes.ok || !salesRes.ok || !productsRes.ok || !statusRes.ok || !ordersRes.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const overviewData = await overviewRes.json();
      const salesDataArray = await salesRes.json();
      const productsDataArray = await productsRes.json();
      const statusDataArray = await statusRes.json();
      const ordersDataArray = await ordersRes.json();

      setOverview(overviewData);
      setSalesData(salesDataArray);
      setTopProducts(productsDataArray);
      setOrderStatus(statusDataArray);
      setRecentOrders(ordersDataArray);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Estadísticas</h1>
          <p className="text-gray-600 mt-1">Visualiza el rendimiento de tu tienda</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total de Pedidos"
              value={overview.totalOrders}
              color="blue"
            />
            <StatCard
              title="Ventas Totales"
              value={`S/. ${overview.totalSales.toFixed(2)}`}
              color="green"
            />
            <StatCard
              title="Productos"
              value={overview.totalProducts}
              color="purple"
            />
            <StatCard
              title="Pedidos Pendientes"
              value={overview.pendingOrders}
              color="red"
            />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {salesData.length > 0 && (
            <SalesTrendChart data={salesData} />
          )}
          {topProducts.length > 0 && (
            <TopProductsChart data={topProducts} />
          )}
        </div>

        {/* Order Status and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {orderStatus.length > 0 && (
            <div className="lg:col-span-1">
              <OrderStatusChart data={orderStatus} />
            </div>
          )}

          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Últimos Pedidos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{order.productName}</td>
                      <td className="py-3 px-4 text-gray-600">{order.senderName}</td>
                      <td className="py-3 px-4 text-gray-900 font-semibold">S/. {order.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'completed' ? 'Completado' :
                           order.status === 'pending' ? 'Pendiente' :
                           order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentOrders.length === 0 && (
                <p className="text-center py-8 text-gray-500">No hay pedidos aún</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
