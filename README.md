# Red de Innovación FP

Sistema de gestión integral para la Red de Innovación de Formación Profesional, diseñado para coordinar y administrar la red de centros educativos, subredes y familias profesionales.

## Descripción

La Red de Innovación FP es una plataforma web que facilita la gestión y coordinación de la red de innovación en Formación Profesional. Permite la interacción entre diferentes niveles de coordinación, desde gestores de centros hasta coordinadores generales.

### Funcionalidades Principales

#### 1. Gestión de Usuarios y Roles
- **Roles diferenciados**:
  - Gestor: Gestión a nivel de centro
  - Coordinador de Subred: Coordinación de CIFP y centros asociados
  - Coordinador General: Administración global del sistema
- Importación masiva de usuarios (CSV)
- Sistema de permisos granular
- Gestión de perfiles y datos de contacto

#### 2. Estructura de Red
- **Gestión de Subredes**:
  - Organización por islas
  - Asignación de CIFP coordinadores
  - Control de centros asociados
- **Gestión de Centros**:
  - CIFP y IES
  - Asignación a subredes
  - Datos de contacto y ubicación
- **Familias Profesionales**:
  - Catálogo de especialidades
  - Asignación a centros
  - Coordinación específica

#### 3. Formularios y Recogida de Datos
- **Constructor de formularios**:
  - Múltiples tipos de campos
  - Lógica condicional
  - Validaciones personalizadas
- **Gestión de respuestas**:
  - Guardado automático
  - Historial de cambios
  - Exportación de datos
- **Plantillas**:
  - Importación desde Word
  - Reutilización de formularios
  - Versiones por curso académico

#### 4. Dashboards y Visualización
- **Widgets personalizables**:
  - Tablas de datos
  - Gráficos estadísticos
  - Tablas dinámicas (pivot)
  - KPIs y métricas
  - Texto y enlaces
- **Diseño flexible**:
  - Layout adaptable
  - Tamaños configurables
  - Actualización en tiempo real
- **Fuentes de datos**:
  - Conexión con formularios
  - Filtros avanzados
  - Agrupación de datos

#### 5. Comunicación
- **Mensajería interna**:
  - Chat entre usuarios
  - Historial de conversaciones
  - Notificaciones
- **Contacto directo**:
  - Envío de correos
  - Llamadas telefónicas
  - Gestión de contactos

#### 6. Cursos Académicos
- **Gestión temporal**:
  - Creación de cursos
  - Períodos académicos
  - Activación/desactivación
- **Asistente de configuración**:
  - Importación de datos previos
  - Configuración guiada
  - Verificación de requisitos

#### 7. Personalización
- **Apariencia**:
  - Colores corporativos
  - Logo y favicon
  - Diseño responsive
- **Configuración**:
  - Nombre de la aplicación
  - Datos institucionales
  - Preferencias del sistema

### Características Técnicas

- Interfaz moderna y responsive
- Arquitectura basada en React
- Almacenamiento persistente
- Exportación de datos en múltiples formatos
- Sistema de notificaciones en tiempo real
- Gestión de errores y recuperación
- Backups automáticos

## Instrucciones de Instalación

### 1. Instalación en Ubuntu Server

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Git
sudo apt install -y git

# Clonar el repositorio
git clone https://github.com/tu-usuario/red-innovacion-fp.git
cd red-innovacion-fp

# Instalar dependencias
npm install

# Construir la aplicación
npm run build

# Instalar PM2 para gestionar el proceso
sudo npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "red-innovacion" -- start

# Configurar PM2 para iniciar con el sistema
pm2 startup
pm2 save
```

### 2. Instalación en Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5173

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Para ejecutar con Docker Compose:
```bash
docker-compose up -d
```

### 3. Instalación en Portainer

1. Acceder a Portainer
2. Ir a "Stacks" → "Add stack"
3. Copiar el contenido del docker-compose.yml
4. Configurar variables de entorno si es necesario
5. Hacer clic en "Deploy the stack"

### 4. Instalación en Proxmox

1. Crear un contenedor LXC en Proxmox:
```bash
# Crear contenedor Ubuntu
pct create 100 local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst

# Configurar recursos
pct set 100 -cores 2
pct set 100 -memory 2048
pct set 100 -swap 1024
pct set 100 -net0 name=eth0,bridge=vmbr0,ip=dhcp

# Iniciar contenedor
pct start 100
```

2. Acceder al contenedor:
```bash
pct enter 100
```

3. Seguir los pasos de instalación de Ubuntu Server mencionados anteriormente.

### Requisitos del Sistema

- Node.js 18 o superior
- NPM 8 o superior
- 2GB RAM mínimo
- 10GB espacio en disco
- Conexión a Internet

### Configuración de Producción

1. Configurar variables de entorno:
```bash
cp .env.example .env
```

2. Editar `.env`:
```env
NODE_ENV=production
VITE_API_URL=https://tu-api.com
```

3. Configurar proxy inverso (Nginx ejemplo):
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Mantenimiento

- **Backups**:
  ```bash
  # Backup de la base de datos
  tar -czf backup-$(date +%F).tar.gz ./data

  # Restaurar backup
  tar -xzf backup-YYYY-MM-DD.tar.gz
  ```

- **Actualizaciones**:
  ```bash
  # Actualizar dependencias
  npm update

  # Reconstruir la aplicación
  npm run build

  # Reiniciar servicio
  pm2 restart red-innovacion
  ```

- **Logs**:
  ```bash
  # Ver logs en tiempo real
  pm2 logs red-innovacion

  # Rotar logs
  pm2 flush
  ```

### Solución de Problemas

1. **Error de permisos**:
```bash
sudo chown -R $USER:$USER /ruta/aplicacion
```

2. **Puerto en uso**:
```bash
sudo lsof -i :5173
kill -9 PID
```

3. **Problemas de memoria**:
```bash
# Aumentar límite de archivos
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Seguridad

1. Configurar firewall:
```bash
sudo ufw allow 5173
sudo ufw enable
```

2. Configurar SSL con Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```
