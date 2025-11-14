from pydantic import BaseModel
from datetime import date


class ReporteFechas(BaseModel):
    fecha_inicio: date
    fecha_fin: date
