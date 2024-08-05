
# Sistema de Gestión de Adquisiciones - ADRES

Este proyecto es una aplicación web con una API backend para gestionar requisitos de adquisición.

## Requisitos

- Python 3.8+
- pip

## Instalación

1. Clona este repositorio: git clone [https://github.com/juanriano/Prueba-ADRES.git](https://github.com/juanriano/Prueba-ADRES)
2. Navega al directorio del proyecto: cd sistema-adquisiciones-adres
3. Instala las dependencias: pip install -r requirements.txt

## Ejecución

1. Inicia la aplicación: python app.py
2. Abr un navegador y ve a `http://localhost:5000`

## Características

- Registro de nuevas adquisiciones
- Visualización de adquisiciones existentes
- Edición de adquisiciones
- Desactivación/activación de adquisiciones
- Registro y visualización de historial de cambios para cada adquisición
- API RESTful para interactuar con el backend
- Almacenamiento de datos en SQLite

## Tecnologías Utilizadas

- Frontend: HTML, CSS, JavaScript
- Backend: Python, Flask, SQLAlchemy
- Base de datos: SQLite

## Estructura del Proyecto

/proyecto
	/api
**
    init** .py
		modelos.py
		rutas.py
	/static
		/css
			normalize.css
			styles.css
		/js
			main.js
			servicioAdquisicion.js
			servicioUI.js
			servicioValidacion.js
		/img
			logo.svg
	/templates
		index.html
	app.py
	requirements.txt
	README.md

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios propuestos antes de realizar un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
