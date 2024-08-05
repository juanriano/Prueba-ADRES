# Sistema de Gestión de Adquisiciones - ADRES

Este proyecto es una aplicación web con una API backend para gestionar requisitos de adquisición para la Administradora de los Recursos del Sistema General de Seguridad Social en Salud (ADRES).

## Repositorio

El código fuente de este proyecto está disponible en:
[https://github.com/juanriano/Prueba-ADRES/tree/main/proyecto](https://github.com/juanriano/Prueba-ADRES/tree/main/proyecto)

## Requisitos

- Visual Studio Code
- Extensión de Python para VSCode
- Extensión de Flask-RESTful para VSCode (opcional, pero recomendada)
- Python 3.8+

## Configuración del proyecto

1. Clona el repositorio: git clone [https://github.com/juanriano/Prueba-ADRES.git](https://github.com/juanriano/Prueba-ADRES.git)
2. Abre la carpeta del proyecto en VSCode: code Prueba-ADRES/proyecto
3. VSCode debeía detectar automáticamente el entorno Python. Si no lo hace, puedes seleccionar el intérprete de Python manualmente:

- Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
- Escribe "Python: Select Interpreter"
- Selecciona el intérprete de Python adecuado (conda)

4. Instala las dependencias:

- Abre una terminal en VSCode (`Terminal > New Terminal`)
- Ejecuta: `pip install -r requirements.txt`

## Ejecución del proyecto

1. En VSCode, abre el archivo `app.py`
2. Haz clic en el botón "Run" en la esquina superior derecha, o presiona F5
3. VSCode iniciará el servidor Flask y te mostrará la URL en la consola de depuración

Alternativamente, puedes ejecutar el servidor desde la terminal integrada de VSCode: python app.py

El servidor estará disponible en `http://localhost:5000`.

## Uso

1. Abre un navegador y ve a `http://localhost:5000`
2. Usa la interfaz para gestionar las adquisiciones

## Características

- Registro de nuevas adquisiciones
- Visualización de adquisiciones existentes
- Edición de adquisiciones
- Desactivación/activación de adquisiciones
- Registro y visualización de historial de cambios

## Tecnologías Utilizadas

- Backend: Python, Flask, SQLAlchemy
- Frontend: HTML, CSS, JavaScript
- Base de datos: SQLite

## Contacto

Juan Carlos Riano - juan.carlos.riano2@gmail.com

Enlace del proyecto: [https://github.com/juanriano/Prueba-ADRES/tree/main/proyecto](https://github.com/juanriano/Prueba-ADRES/tree/main/proyecto)
