import logging
from flask import Blueprint, request, jsonify
from .modelos import db, Adquisicion, Historial
from datetime import datetime
from pytz import timezone

api = Blueprint('api', __name__)
logging.basicConfig(level=logging.DEBUG)

# Configura la zona horaria local
tz = timezone('America/Bogota')

@api.route('/')
def index():
    return "Bienvenido a la API de Adquisiciones"

@api.route('/adquisiciones', methods=['GET'])
def obtener_adquisiciones():
    try:
        adquisiciones = Adquisicion.query.all()
        logging.debug(f"Obtenidas {len(adquisiciones)} adquisiciones")
        return jsonify([{
            'id': a.id,
            'presupuesto': a.presupuesto,
            'unidad': a.unidad,
            'tipo': a.tipo,
            'cantidad': a.cantidad,
            'valor_unitario': a.valor_unitario,
            'valor_total': a.valor_total,
            'fecha_adquisicion': a.fecha_adquisicion.isoformat(),
            'proveedor': a.proveedor,
            'documentacion': a.documentacion,
            'activo': a.activo
        } for a in adquisiciones])
    except Exception as e:
        logging.error(f"Error al obtener adquisiciones: {str(e)}")
        return jsonify({'error': 'Error al obtener adquisiciones'}), 500

@api.route('/adquisiciones', methods=['POST'])
def crear_adquisicion():
    datos = request.json
    logging.debug(f"Datos recibidos para crear adquisición: {datos}")
    if not datos:
        return jsonify({'error': 'No se proporcionaron datos'}), 400
    
    try:
        nueva_adquisicion = Adquisicion(
            presupuesto=float(datos['presupuesto']),
            unidad=datos['unidad'],
            tipo=datos['tipo'],
            cantidad=int(datos['cantidad']),
            valor_unitario=float(datos['valor_unitario']),
            valor_total=float(datos['cantidad']) * float(datos['valor_unitario']),
            fecha_adquisicion=datetime.strptime(datos['fecha_adquisicion'], '%Y-%m-%d').date(),
            proveedor=datos['proveedor'],
            documentacion=datos.get('documentacion', '')
        )
        db.session.add(nueva_adquisicion)
        db.session.commit()
        logging.debug(f"Nueva adquisición creada con ID: {nueva_adquisicion.id}")

        historial = Historial(
            adquisicion_id=nueva_adquisicion.id,
            accion='Creado',
            cambios='Adquisición inicial'
        )
        db.session.add(historial)
        db.session.commit()
        logging.debug("Historial creado para la nueva adquisición")

        return jsonify({'mensaje': 'Adquisición creada exitosamente', 'id': nueva_adquisicion.id}), 201
    except KeyError as e:
        logging.error(f"Falta el campo requerido: {str(e)}")
        return jsonify({'error': f'Falta el campo requerido: {str(e)}'}), 400
    except ValueError as e:
        logging.error(f"Error de conversión de datos: {str(e)}")
        return jsonify({'error': f'Error de conversión de datos: {str(e)}'}), 400
    except Exception as e:
        logging.error(f"Error al crear la adquisición: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Error al crear la adquisición: {str(e)}'}), 500

@api.route('/adquisiciones/<int:id>', methods=['PUT'])
def actualizar_adquisicion(id):
    adquisicion = Adquisicion.query.get_or_404(id)
    datos = request.json
    logging.debug(f"Datos recibidos para actualizar adquisición {id}: {datos}")
    if not datos:
        return jsonify({'error': 'No se proporcionaron datos para actualizar'}), 400

    cambios = []

    try:
        for clave, valor in datos.items():
            if clave == 'fecha_adquisicion':
                valor = datetime.strptime(valor, '%Y-%m-%d').date()
            elif clave in ['presupuesto', 'valor_unitario']:
                valor = float(valor)
            elif clave == 'cantidad':
                valor = int(valor)
            
            if hasattr(adquisicion, clave) and getattr(adquisicion, clave) != valor:
                cambios.append(f"{clave}: {getattr(adquisicion, clave)} → {valor}")
                setattr(adquisicion, clave, valor)

        if 'cantidad' in datos or 'valor_unitario' in datos:
            adquisicion.valor_total = adquisicion.cantidad * adquisicion.valor_unitario

        db.session.commit()
        logging.debug(f"Adquisición {id} actualizada")

        if cambios:
            historial = Historial(
                adquisicion_id=id,
                accion='Actualizado',
                cambios=', '.join(cambios)
            )
            db.session.add(historial)
            db.session.commit()
            logging.debug(f"Historial creado para la actualización de adquisición {id}")

        return jsonify({'mensaje': 'Adquisición actualizada exitosamente'})
    except ValueError as e:
        logging.error(f"Error de conversión de datos: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Error de conversión de datos: {str(e)}'}), 400
    except Exception as e:
        logging.error(f"Error al actualizar la adquisición {id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Error al actualizar la adquisición: {str(e)}'}), 500

@api.route('/adquisiciones/<int:id>/alternar', methods=['PUT'])
def alternar_adquisicion(id):
    try:
        adquisicion = Adquisicion.query.get_or_404(id)
        adquisicion.activo = not adquisicion.activo
        db.session.commit()
        logging.debug(f"Estado de adquisición {id} alternado a {'activo' if adquisicion.activo else 'inactivo'}")

        historial = Historial(
            adquisicion_id=id,
            accion='Activado' if adquisicion.activo else 'Desactivado',
            cambios=f"Estado cambiado a {'activo' if adquisicion.activo else 'inactivo'}"
        )
        db.session.add(historial)
        db.session.commit()
        logging.debug(f"Historial creado para el cambio de estado de adquisición {id}")

        return jsonify({'mensaje': 'Estado de la adquisición alternado exitosamente'})
    except Exception as e:
        logging.error(f"Error al alternar el estado de la adquisición {id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Error al alternar el estado de la adquisición: {str(e)}'}), 500

@api.route('/adquisiciones/<int:id>/historial', methods=['GET'])
def obtener_historial_adquisicion(id):
    try:
        historial = Historial.query.filter_by(adquisicion_id=id).order_by(Historial.fecha.desc()).all()
        logging.debug(f"Obtenido historial para adquisición {id}: {len(historial)} entradas")
        return jsonify([{
            'fecha': h.fecha.astimezone(tz).isoformat(),
            'accion': h.accion,
            'cambios': h.cambios
        } for h in historial])
    except Exception as e:
        logging.error(f"Error al obtener el historial de la adquisición {id}: {str(e)}")
        return jsonify({'error': f'Error al obtener el historial de la adquisición: {str(e)}'}), 500

@api.errorhandler(404)
def recurso_no_encontrado(error):
    logging.error(f"Recurso no encontrado: {request.url}")
    return jsonify({'error': 'Recurso no encontrado'}), 404

@api.errorhandler(500)
def error_interno_servidor(error):
    logging.error(f"Error interno del servidor: {str(error)}")
    return jsonify({'error': 'Error interno del servidor'}), 500