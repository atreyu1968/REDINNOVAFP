import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useFormStore } from '../stores/formStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import { Form } from '../types/form';
import FormBuilder from '../components/forms/FormBuilder';
import FormList from '../components/forms/FormList';
import FormResponse from '../components/forms/FormResponse';
import ImportFormModal from '../components/forms/ImportFormModal';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Forms = () => {
  const { user } = useAuthStore();
  const { forms, addForm, updateForm } = useFormStore();
  const { showNotification } = useNotifications();
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const isAdmin = user?.role === 'coordinador_general';
  const userForms = isAdmin
    ? forms
    : forms.filter(
        (form) =>
          form.status === 'published' &&
          form.assignedRoles.includes(user?.role || '')
      );

  const handleFormSubmit = (formData: Partial<Form>) => {
    const now = new Date().toISOString();
    if (selectedForm) {
      updateForm({
        ...selectedForm,
        ...formData,
        updatedAt: now,
      } as Form);
      
      if (formData.status === 'published') {
        showNotification('success', 'El formulario ha sido publicado correctamente');
      } else {
        showNotification('success', 'El formulario ha sido guardado como borrador');
      }
    } else {
      addForm({
        ...formData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as Form);

      if (formData.status === 'published') {
        showNotification('success', 'El nuevo formulario ha sido publicado');
      } else {
        showNotification('success', 'El nuevo formulario ha sido guardado como borrador');
      }
    }
    setShowBuilder(false);
    setSelectedForm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Formularios</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isAdmin
              ? 'Gestión de formularios personalizados'
              : 'Formularios asignados'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Importar de Curso Anterior
            </button>
            <button
              onClick={() => {
                setSelectedForm(null);
                setShowBuilder(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Formulario
            </button>
          </div>
        )}
      </div>

      {showBuilder ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {selectedForm ? 'Editar Formulario' : 'Nuevo Formulario'}
          </h3>
          <FormBuilder
            initialData={selectedForm || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowBuilder(false);
              setSelectedForm(null);
            }}
          />
        </div>
      ) : showResponse ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <FormResponse
            form={selectedForm!}
            onClose={() => {
              setShowResponse(false);
              setSelectedForm(null);
            }}
          />
        </div>
      ) : (
        <FormList
          forms={userForms}
          isAdmin={isAdmin}
          onFormClick={(form) => {
            setSelectedForm(form);
            if (isAdmin) {
              setShowBuilder(true);
            } else {
              setShowResponse(true);
            }
          }}
        />
      )}

      {showImportModal && (
        <ImportFormModal
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default Forms;