import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const COLORS = ['#E63946', '#F77F88', '#D4A5A5', '#A8DADC', '#457B9D'];

export function SalesTrendChart({ data }: { data: SalesData[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Ventas por Día (Últimos 30 días)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#E63946" 
            name="Ventas (S/.)"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="orders" 
            stroke="#457B9D" 
            name="Pedidos"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopProductsChart({ data }: { data: ProductData[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Productos Más Vendidos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#E63946" name="Ventas" />
          <Bar dataKey="revenue" fill="#457B9D" name="Ingresos (S/.)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrderStatusChart({ data }: { data: OrderStatusData[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Estado de Pedidos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  color = 'blue' 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  color?: 'red' | 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {subtitle && <p className="text-xs mt-2 opacity-60">{subtitle}</p>}
    </div>
  );
}
