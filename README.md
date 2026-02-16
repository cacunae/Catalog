# Catalogo Retail - React + Vite + Java + Maven + Spring Boot

Este repositorio contiene la solucion de la prueba tecnica de catalogo retail, con:

- Frontend: React + Vite (TypeScript)
- Backend: Java + Maven + Spring Boot
- Datos: `catalog.json` cargado en memoria (sin base de datos)


## 1. Requisitos previos

Herramientas necesarias a instalar antes de ejecutar el proyecto:

1. Java JDK (8 o superior)
2. Maven (3.8+ recomendado)
3. Node.js (20+ recomendado)
4. npm (10+ recomendado)

Versiones de este entorno:

- Java: `25.0.2`
- Maven: `3.9.12`
- Node: `v24.13.0`
- npm: `11.6.2`

## 2. Verificar instalaciones

```text
java -version
mvn -version
node -v
npm -v o npm.cmd -v
```


## 3. Estructura del proyecto

```text
Catalog/
  backend/        # API Spring Boot
  frontend/front/ # App React + Vite
  Catalogo_Retail.pdf
```

## 4. Levantar backend (Spring Boot)

1. Abrir terminal en la carpeta backend:

```powershell
cd backend
```

2. Ejecutar tests:

```powershell
mvn test
```

3. Iniciar API:

```powershell
mvn spring-boot:run
```

4. Verificar endpoint de salud:

```powershell
curl http://localhost:8080/api/health
```

Debe responder:

```text
ok
```

## 5. Endpoints principales de la API

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/{id}`

Parámetros soportados en `GET /api/products`:

- `search`
- `brand`
- `category`
- `minPrice`
- `maxPrice`
- `sortBy` (`name|price|oldPrice|stock|brand|category|id`)
- `sortDir` (`asc|desc`)
- `page` (>= 0)
- `size` (1..100)

Ejemplo:

```powershell
curl "http://localhost:8080/api/products?page=0&size=5&sortBy=price&sortDir=desc"
```

Prueba de validacion (debe retornar HTTP 400):

```powershell
curl "http://localhost:8080/api/products?size=0"
```

## 6. Levantar frontend (React + Vite)

1. En otra terminal dirigirse a la carpeta de front end:

```powershell
cd frontend/front
```

2. Instalar dependencias:

```powershell
npm install
```

3. Iniciar servidor de desarrollo:

```powershell
npm run dev
```

4. Abrir en navegador:

- `http://localhost:5173`

Se consume por defecto:

- `http://localhost:8080/api/products`


