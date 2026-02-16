# gestor_opiniones
# 📮 Cómo Ejecutar y Probar Gestor Opiniones con Postman

Este documento explica paso a paso cómo ejecutar el proyecto **gestor_opiniones** y probar sus endpoints utilizando Postman.

---

# 📌 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v18 o superior recomendado)
- MongoDB (local o MongoDB Atlas)
- Postman
- Git

---

# 🚀 1. Clonar el Proyecto

```bash
git clone https://github.com/eGalv3zDev/gestor_opiniones.git
cd gestor_opiniones
```

---

# 📦 2. Instalar Dependencias

Con npm:

```bash
npm install
```

Con pnpm:

```bash
pnpm install
```

---

# ⚙️ 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3001
URL_MONGODB=mongodb://127.0.0.1:27017/gestor_opiniones
JWT_SECRET=mi_clave_super_secreta
```

Si usas MongoDB Atlas, reemplaza `URL_MONGODB` con tu cadena de conexión.

---

# ▶️ 4. Ejecutar el Servidor

```bash
npm start
```

Si todo está correcto, el servidor iniciará en:

```
http://localhost:3001
```

---

# 📮 5. Probar la API con Postman

## 🟢 5.1 Verificar que la API está activa

**Método:** GET  
**URL:**

```
http://localhost:3001/kinalOpinion/v1/health
```

**Respuesta esperada:**

```json
{
  "message": "API is running"
}
```

---

## 👤 5.2 Registrar Usuario

**Método:** POST  
**URL:**

```
http://localhost:3001/kinalOpinion/v1/auth/register
```

**Body → raw → JSON:**

```json
{
  "username": "usuario1",
  "email": "usuario1@gmail.com",
  "password": "123456"
}
```

**Resultado esperado:**
- Usuario creado correctamente
- Se devuelve un token JWT

Guarda el token para usarlo después.

---

## 🔐 5.3 Iniciar Sesión

**Método:** POST  
**URL:**

```
http://localhost:3001/kinalOpinion/v1/auth/login
```

**Body → raw → JSON:**

```json
{
  "email": "usuario1@gmail.com",
  "password": "123456"
}
```

**Respuesta esperada:**

```json
{
  "token": "TOKEN_JWT_AQUI"
}
```

---

## 🔒 5.4 Probar Ruta Protegida

**Método:** GET  
**URL:**

```
http://localhost:3001/kinalOpinion/v1/protected
```

### Configuración en Postman:

1. Ir a la pestaña **Authorization**
2. Tipo: **Bearer Token**
3. Pegar el token obtenido en el login

O manualmente en Headers:

```
Authorization: Bearer TU_TOKEN_AQUI
```

**Resultado esperado:**
Acceso autorizado si el token es válido.

---

# 📁 Crear una Colección en Postman (Opcional pero Recomendado)

1. Haz clic en **New → Collection**
2. Nombra la colección como: `Gestor Opiniones API`
3. Agrega los endpoints dentro de la colección
4. Guarda las requests

Esto te permitirá organizar mejor las pruebas.

---

# ✅ Flujo Recomendado de Prueba

1. Ejecutar servidor
2. Verificar `/health`
3. Registrar usuario
4. Iniciar sesión
5. Copiar token
6. Probar ruta protegida

---

# 🛠 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que MongoDB esté activo
- Revisa la variable `URL_MONGODB`

### Error 401 Unauthorized
- Verifica que el token esté correctamente copiado
- Asegúrate de usar el formato:
  
```
Bearer TU_TOKEN
```

---

# 🎯 Listo

Ahora puedes ejecutar y probar completamente la API usando Postman.
