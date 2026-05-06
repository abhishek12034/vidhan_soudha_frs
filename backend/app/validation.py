import datetime
from pydantic import BaseModel


class ReportResponse(BaseModel):
    fullName: str
    entryCount: int
    exitCount: int
    totalTimeInRoomSeconds: int
    totalTimeInRoomFormatted: str
    registeredFaceId: str


class ReportQueryRequest(BaseModel):
    start_date: datetime.date
    end_date: datetime.date
