import React, { useState } from 'react';
import { Plus, Upload, Copy } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import ImportModal from '../components/users/ImportModal';
import { User } from '../types/user';

const Users = () => {
  const { user: currentUser } = useAuthStore();
  const { activeYear } = useAcademicYearStore();
  const { users } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Solo el coordinador general puede acceder a esta página
  if (currentUser?.role !== 'coordinador_general') {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  const filteredUsers = activeYear
    ? users.filter((u) => u.academicYearId === activeYear.id)
    : users;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="mt-1 text-sm text-gray-500">
            {activeYear ? `Curso académico: ${activeYear.year}` : 'Todos los cursos'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </button>
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <UserForm
            initialData={selectedUser}
            onSubmit={(data) => {
              console.log('Guardando usuario:', data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <UserList
          users={filteredUsers}
          onUserClick={(user) => {
            setSelectedUser(user);
            setShowForm(true);
          }}
        />
      )}

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
};

export default Users;