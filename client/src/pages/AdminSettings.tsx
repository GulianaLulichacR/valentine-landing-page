import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ToastContainer';

interface Settings {
  whatsappNumber: string;
  notificationEmail: string;
  siteName: string;
  siteDescription: string;
}

export default function AdminSettings() {
  const { toasts, removeToast, success, error } = useToast();
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: '+51999999999',
    notificationEmail: 'gulianalulichacr048@gmail.com',
    siteName: 'Regala Amor',
    siteDescription: 'Arreglos florales exclusivos que expresan tus sentimientos',
  });
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        success('Configuración guardada exitosamente');
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        error('Error al guardar la configuración');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} onLogout={handleLogout} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sitio</h1>
          <p className="text-gray-600 mt-1">Administra los parámetros de notificaciones y contacto</p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📱 Número de WhatsApp para Pedidos
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              placeholder="+51999999999"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: +[código país][número]. Ejemplo: +51987654321
            </p>
          </div>

          {/* Notification Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📧 Email para Notificaciones
            </label>
            <input
              type="email"
              value={settings.notificationEmail}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recibirás notificaciones de nuevos pedidos en este email
            </p>
          </div>

          {/* Site Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏪 Nombre del Sitio
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              placeholder="Regala Amor"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Site Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Descripción del Sitio
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              placeholder="Descripción de tu negocio"
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Información importante:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>El número de WhatsApp se usará para los links de contacto de pedidos</li>
                  <li>El email de notificaciones recibirá confirmaciones de nuevos pedidos</li>
                  <li>Todos los cambios se guardarán inmediatamente</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            
            {isSaved && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                ✓ Guardado correctamente
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Guía de Configuración</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">WhatsApp</h3>
              <p>Asegúrate de que el número esté verificado en WhatsApp Business para recibir mensajes de clientes.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p>Verifica que el email esté activo y que puedas recibir emails. Revisa la carpeta de spam si no recibes notificaciones.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Notificaciones</h3>
              <p>Recibirás notificaciones automáticas cuando se realicen nuevos pedidos. Puedes cambiar el email en cualquier momento.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
