import React, { useState, useRef, useEffect } from 'react';
import { Save, Upload, RefreshCw } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import ColorPicker from '../components/settings/ColorPicker';

const Settings = () => {
  const { user } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();
  const [formData, setFormData] = useState(settings);
  const [successMessage, setSuccessMessage] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  if (user?.role !== 'coordinador_general') {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Actualizar la configuración en el store
      updateSettings(formData);

      // Actualizar el favicon
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = formData.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
      
      // Actualizar el título
      document.title = formData.name;

      // Mostrar mensaje de éxito
      setSuccessMessage('Configuración guardada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
    }
  };

  const handleColorChange = (color: string, path: string[]) => {
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = color;
      return newData;
    });
  };

  const handleReset = () => {
    setFormData(settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="mt-1 text-sm text-gray-500">
          Personaliza la apariencia y configuración general de la aplicación
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre de la Aplicación
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <div className="mt-2 flex items-center space-x-4">
              <img
                src={formData.logo}
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
              <input
                type="file"
                ref={logoInputRef}
                onChange={(e) => handleImageUpload(e, 'logo')}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Cambiar Logo
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Favicon</label>
            <div className="mt-2 flex items-center space-x-4">
              <img
                src={formData.favicon}
                alt="Favicon"
                className="h-8 w-8 object-contain"
              />
              <input
                type="file"
                ref={faviconInputRef}
                onChange={(e) => handleImageUpload(e, 'favicon')}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => faviconInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Cambiar Favicon
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Colores</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ColorPicker
              label="Color Principal"
              color={formData.colors.primary}
              onChange={(color) => handleColorChange(color, ['colors', 'primary'])}
            />
            <ColorPicker
              label="Color Secundario"
              color={formData.colors.secondary}
              onChange={(color) => handleColorChange(color, ['colors', 'secondary'])}
            />
            <ColorPicker
              label="Barra de Navegación (Inicio)"
              color={formData.colors.navbar.from}
              onChange={(color) => handleColorChange(color, ['colors', 'navbar', 'from'])}
            />
            <ColorPicker
              label="Barra de Navegación (Fin)"
              color={formData.colors.navbar.to}
              onChange={(color) => handleColorChange(color, ['colors', 'navbar', 'to'])}
            />
            <ColorPicker
              label="Barra Lateral"
              color={formData.colors.sidebar}
              onChange={(color) => handleColorChange(color, ['colors', 'sidebar'])}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;