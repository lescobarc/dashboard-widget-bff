

# Dashboard Widget: BFF + Frontend Angular

---

## Descripción General
Este proyecto implementa un Backend-for-Frontend (BFF) en Node.js/Express que expone un endpoint `/api/dashboard-widget` para combinar información del clima y el precio de Bitcoin. Incluye un frontend en Angular 20+ que consume este endpoint y muestra la información en un widget autocontenible, reutilizable y accesible.

---

## Requisitos previos

- Node.js >= 18.x (recomendado 18.x o 20.x para Angular 20)
- Angular CLI >= 20.x
- npm >= 9.x

---

## Tabla de Contenidos
- [Arquitectura Visual](#arquitectura-visual)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Instalación y Ejecución](#instalación-y-ejecución)
  - [Backend (BFF)](#backend-bff)
  - [Frontend (Angular)](#frontend-angular)
- [Comandos útiles](#comandos-útiles)
- [Uso del Endpoint](#uso-del-endpoint)
- [Pruebas](#pruebas)
- [Manejo de Errores](#manejo-de-errores)
- [Contexto de ejecución para la IA](#contexto-de-ejecución-para-la-ia)
- [Registro de Prompts de IA](#registro-de-prompts-de-ia)
- [Justificación de la elección tecnológica para el widget (MFE)](#justificación-de-la-elección-tecnológica-para-el-widget-mfe)
- [¿Cómo integrar el widget en otros proyectos Angular?](#cómo-integrar-el-widget-en-otros-proyectos-angular)
- [Autor](#autor)

---

## Arquitectura Visual

```
Frontend (Angular) <----> BFF (Node/Express) <----> APIs externas (Clima/Bitcoin)
```

---

## Estructura de Carpetas

```
prueba-tecnica/
  backend/
    src/
      controllers/
      routes/
      services/
      utils/
      app.js
      server.js
    tests/
    package.json
    ...
  dashboard-widget/
    src/
      app/
        core/
          models/
          services/
        features/
          dashboard-widget/
            dashboard-widget.component.html
            dashboard-widget.component.scss
            dashboard-widget.component.ts
            dashboard-widget.component.spec.ts
        ...
      ...
    angular.json
    package.json
    ...
  README.md
```

- **backend/**: BFF en Node.js/Express, lógica de negocio, consumo de APIs externas, pruebas unitarias.
- **dashboard-widget/**: Frontend Angular, widget autocontenible, arquitectura limpia, pruebas unitarias.

---

## Instalación y Ejecución

### Backend (BFF)
1. Ve a la carpeta `backend`:
   ```sh
   cd backend
   ```
2. Instala dependencias:
   ```sh
   npm install
   ```
3. Consigue una API key gratuita de [OpenWeatherMap](https://openweathermap.org/api) y configúrala en el archivo `.env`:
   ```env
   OPENWEATHER_API_KEY=tu_api_key_aqui
   ```
4. Inicia el servidor:
   ```sh
   npm start # o node src/server.js
   ```
5. El backend quedará escuchando en `http://localhost:3000`

### Frontend (Angular)
1. Ve a la carpeta del frontend:
   ```sh
   cd dashboard-widget
   ```
2. Instala dependencias:
   ```sh
   npm install
   ```
3. Inicia la aplicación:
   ```sh
   ng serve --port 4200
   ```
4. Accede a `http://localhost:4200` en tu navegador.

---

## Comandos útiles

| Acción                | Backend                | Frontend                |
|-----------------------|------------------------|-------------------------|
| Instalar dependencias | `npm install`          | `npm install`           |
| Iniciar servidor      | `npm start`            | `ng serve --port 4200`  |
| Ejecutar pruebas      | `npx jest`             | `ng test`               |

---

## Uso del Endpoint


**GET** `/api/dashboard-widget?city=Ciudad`

**Ejemplo de respuesta:**

```
Status: 200 OK
Content-Type: application/json; charset=utf-8

{
  "city": "Bogotá",
  "weather": {
    "city": "Bogotá",
    "description": "cielo claro",
    "temperature": 251.15,
    "icon": "01d"
  },
  "bitcoin": {
    "usd": 119709
  }
}
```

> ⚠️ **Nota:** Los valores son solo ejemplos. Los datos reales dependen del clima y el precio de Bitcoin al momento de la consulta.

**Campos de la respuesta:**
- `city`: Nombre de la ciudad consultada.
- `weather`: Información meteorológica actual de la ciudad.
  - `city`: Nombre de la ciudad.
  - `description`: Descripción del clima.
  - `temperature`: Temperatura actual (en Kelvin).
  - `icon`: Código de icono de OpenWeatherMap.
- `bitcoin`: Precio actual de Bitcoin.
  - `usd`: Precio en dólares estadounidenses (USD).

---

## Pruebas

### Backend
- Las pruebas unitarias están en la carpeta `backend/tests`, segregadas en subcarpetas de `controllers` y `services` para facilitar el mantenimiento y la cobertura.
- **Importante:** Los tests usan sintaxis ECMAScript Modules (`import`/`export`). Asegúrate de que tu `backend/package.json` tenga `"type": "module"` y que el archivo `jest.config.json` incluya `"extensionsToTreatAsEsm": [".js"]`.
- Ejecuta las pruebas desde la carpeta `backend`:
  ```sh
  cd backend
  npx jest tests/controllers/dashboardWidget.controller.test.js
  npx jest tests/services/bitcoin.service.test.js
  npx jest tests/services/weather.service.test.js
  ```
- Si ves un error relacionado con `Cannot use import statement outside a module`, ejecuta Jest con el siguiente flag:
  ```sh
  node --experimental-vm-modules node_modules/jest/bin/jest.js tests/controllers/dashboardWidget.controller.test.js
  ```
- Las pruebas cubren controladores y servicios, incluyendo manejo de errores y mocks de APIs externas.

### Frontend
- Las pruebas unitarias del widget están en `dashboard-widget/src/app/features/dashboard-widget/dashboard-widget.component.spec.ts`.
- Para ejecutarlas y verificar que todo funciona correctamente:
  ```sh
  cd dashboard-widget
  ng test --browsers=ChromeHeadless --watch=false
  ```

---

## Manejo de Errores

### Backend
- Todos los errores de las APIs externas (OpenWeatherMap, CoinGecko) son capturados y gestionados mediante un middleware centralizado.
- Se devuelven respuestas con códigos HTTP apropiados (`400`, `404`, `500`, etc.) y mensajes claros en formato JSON, por ejemplo:
  ```json
  {
    "error": "No se pudo obtener el clima para la ciudad especificada."
  }
  ```
- Los errores inesperados se registran en consola para facilitar el debugging, sin exponer detalles sensibles al cliente.
- Se utilizan clases de error personalizadas (`ApiError`) para un manejo consistente y mantenible.

### Frontend
- El frontend detecta y muestra mensajes de error amigables al usuario si la API responde con error o no hay conexión.
- Se gestionan estados de error en el widget, mostrando mensajes claros y opciones de reintento si es necesario.
- Los errores de red, de parsing o de datos incompletos se manejan de forma centralizada en el servicio Angular.
- Ejemplo de mensaje mostrado al usuario:
  > "No se pudo cargar la información. Por favor, intenta nuevamente más tarde."

---

## Contexto de ejecución para la IA

- Estás colaborando en el desarrollo de un proyecto técnico que implementa un Backend-for-Frontend (BFF) en Node.js/Express y un frontend en Angular 20+.
- El objetivo es construir un widget que combine información del clima y el precio de Bitcoin para una ciudad, con arquitectura modular, pruebas automatizadas y documentación profesional.
- Todas las respuestas deben ser aplicables, claras, alineadas a buenas prácticas de ingeniería de software y estándares de calidad para equipos de desarrollo.
- Prioriza la mantenibilidad, la calidad del código, la cobertura de pruebas y la claridad en la documentación.

---

## Registro de Prompts de IA

### 1. "Diseña la arquitectura de un BFF en Node.js/Express que combine datos de OpenWeatherMap y CoinGecko en un solo endpoint REST. Incluye manejo de errores, buenas prácticas y estructura de carpetas modular."
**Ayuda:** Me permitió obtener una estructura de backend robusta, con separación clara de controladores, servicios y rutas, y recomendaciones para manejo de errores y pruebas.

### 2. "Genera un servicio en Angular 20+ que consuma un endpoint `/api/dashboard-widget?city=Ciudad` y devuelva un observable tipado. Usa HttpClient y buenas prácticas de Angular."
**Ayuda:** Obtuve un servicio Angular limpio y reutilizable, con tipado fuerte y manejo de errores, acelerando la integración con el frontend.

### 3. "Crea un componente Angular standalone, autocontenible y accesible, que muestre el clima y el precio de Bitcoin para una ciudad. Incluye loading, error y fallback si no se puede determinar la ciudad. Usa SCSS y BEM."
**Ayuda:** Me ayudó a construir un widget visualmente atractivo, accesible y robusto, siguiendo buenas prácticas de UI y UX.

### 4. "Implementa un entorno de pruebas unitarias robusto en Angular moderno, utilizando Jest. Proporciona la configuración necesaria y ejemplos para asegurar cobertura y mantenibilidad."
**Ayuda:** Obtuve una implementación funcional y profesional de un entorno de testing con Jest, incluyendo archivos de configuración y ejemplos prácticos que garantizan la calidad y mantenibilidad del software.

### 5. "Genera un README profesional y técnico para un proyecto de software, incluyendo secciones de arquitectura, instalación, pruebas, despliegue, manejo de errores. Asegúrate de que sea claro, completo y alineado a buenas prácticas de ingeniería."
**Ayuda:** Obtuve un README estructurado y profesional, con todas las secciones clave para la documentación de un proyecto de software, facilitando la comprensión, el despliegue y el mantenimiento por parte de cualquier equipo técnico.

---

## Justificación de la elección tecnológica para el widget (MFE)

Se eligió Angular 20+ con componentes standalone porque permite crear widgets autocontenidos, reutilizables y fácilmente integrables en cualquier aplicación Angular moderna. La arquitectura standalone elimina dependencias innecesarias de módulos, facilita el testing y el mantenimiento, y es compatible con enfoques de microfrontend. Además, Angular ofrece robustez, tipado fuerte y herramientas avanzadas para desarrollo empresarial, lo que garantiza escalabilidad y calidad en el tiempo.

---

## ¿Cómo integrar el widget en otros proyectos Angular?

1. **Copia el componente y su servicio:** Lleva los archivos `dashboard-widget.component.ts`, `.html`, `.scss` y el servicio a tu nuevo proyecto.
2. **Importa el componente standalone:**
   - En el componente donde lo quieras usar, agrégalo en los `imports`:
     ```typescript
     imports: [DashboardWidgetComponent]
     ```
   - En el template:
     ```html
     <dashboard-widget></dashboard-widget>
     ```
3. **Asegúrate de que el BFF esté corriendo y accesible desde el frontend.**

Si necesitas integrarlo en otros frameworks (React, Vue, etc.), puedes migrar el widget a un Web Component usando Angular Elements.

- **Node.js/Express** para el BFF por su rapidez para prototipar y facilidad de integración con APIs externas.
- **Angular 20+** para el frontend por su robustez, soporte a componentes standalone y arquitectura limpia.
- **Arquitectura modular**: separación clara de responsabilidades en controladores, servicios y rutas.
- **Widget autocontenible**: el componente puede ser reutilizado en otros proyectos o microfrontends.

---

## Autor
- Desarrollado por [Laura Escobar]
- Contacto: [lescobarco@hotmail.com]

