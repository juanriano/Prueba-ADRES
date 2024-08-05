from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from pytz import timezone

db = SQLAlchemy()

# Configura la zona horaria local
tz = timezone('America/Bogota')

class Adquisicion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    presupuesto = db.Column(db.Float, nullable=False)
    unidad = db.Column(db.String(100), nullable=False)
    tipo = db.Column(db.String(100), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    valor_unitario = db.Column(db.Float, nullable=False)
    valor_total = db.Column(db.Float, nullable=False)
    fecha_adquisicion = db.Column(db.Date, nullable=False)
    proveedor = db.Column(db.String(100), nullable=False)
    documentacion = db.Column(db.Text)
    activo = db.Column(db.Boolean, default=True)

class Historial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    adquisicion_id = db.Column(db.Integer, db.ForeignKey('adquisicion.id'), nullable=False)
    fecha = db.Column(db.DateTime, default=lambda: datetime.now(tz))
    accion = db.Column(db.String(50), nullable=False)
    cambios = db.Column(db.Text)

    adquisicion = db.relationship('Adquisicion', backref=db.backref('historial', lazy=True))