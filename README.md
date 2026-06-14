TaskManager - SoftDev Solutions

**Versión:** v1.0.0

📖 Acerca del Proyecto
**TaskManager** es una aplicación web desarrollada para la empresa **SoftDev Solutions**. 
El objetivo de este sistema es administrar y gestionar de manera eficiente las tareas y actividades de un equipo de trabajo.

Este proyecto forma parte de la Práctica Integradora de la Unidad 2 de Desarrollo Web Integral, orientada a la 
implementación de estrategias de control de versiones y flujos de trabajo colaborativos utilizando Git y GitHub.

📂 Estructura del Proyecto
El proyecto sigue una arquitectura base para desarrollo web, organizada de la siguiente manera:

TaskManager/
│
├── index.html        # Estructura principal de la aplicación
├── CSS/
│   └── styles.css    # Hojas de estilo generales y específicas
├── JS/
│   └── script.js     # Lógica de la aplicación y manipulación del DOM
├── assets/           # Imágenes, íconos y recursos multimedia
└── README.md         # Documentación del proyecto

🔒 main: Rama principal. Contiene exclusivamente el código de producción estable y funcional.

🔄 develop: Rama de integración. Recibe todas las nuevas funcionalidades terminadas antes de pasar a producción.

🛠️ feature/<nombre>: Ramas de desarrollo para nuevas tareas. 
Ejemplos: feature/interfaz, feature/login, feature/documentacion.


Políticas de Flujo de Trabajo y Pull Requests
Todos los colaboradores deben apegarse a las siguientes normativas:

1. Protección de Ramas: Ningún integrante puede realizar commits ni pushes directos sobre la rama main ni develop.

2. Origen de los Cambios: Todo cambio, sin excepción, debe desarrollarse en una rama feature o hotfix.

3. Integración (Pull Requests): Todo código nuevo se integra a develop únicamente mediante un Pull Request (PR).

4. Reglas de Aprobación para el PR:
   - Debe incluir un título descriptivo.
   - Debe contener una descripción de los cambios realizados.
   - Debe incluir evidencia (capturas de pantalla) de pruebas realizadas verificando que no hay errores.


5. Políticas de Merge:
   - develop solo recibe cambios de ramas feature/*.
   - main solo recibe cambios desde la rama develop.


Guía de Inicio para Desarrolladores
Instrucciones paso a paso para que el equipo comience a trabajar en sus tareas asignadas:

1. Clonar el repositorio
git clone <URL-DEL-REPOSITORIO>
cd TaskManager


2. Descargar los últimos cambios (Evitar usar main para desarrollo)
git fetch origin
git checkout develop
git pull origin develop

3. Crear una nueva rama para tu tarea
git checkout -b feature/nombre-de-tu-tarea

5. Realizar cambios y generar Commits (Mínimo 3 por integrante)
git add .
git commit -m "Agrega menú principal en index.html"

5. Subir tu rama al repositorio remoto
git push -u origin feature/nombre-de-tu-tarea
