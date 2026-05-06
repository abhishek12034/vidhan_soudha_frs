from fastapi import APIRouter, Depends, Request
import json
from fastapi.encoders import jsonable_encoder
from datetime import datetime, time
from app.repository import ReportRepository
from app.validation import ReportQueryRequest, ReportResponse
from app.db import get_db

router = APIRouter()


@router.get("/report", response_model=list[ReportResponse])
async def get_report(
    request: Request, params: ReportQueryRequest = Depends(), db=Depends(get_db)
):
    # Converting date to epoch timestamp
    start_time_epoc = int(
        datetime.combine(params.start_date, time.min).timestamp() * 1000
    )
    end_time_epoc = int(datetime.combine(params.end_date, time.max).timestamp() * 1000)
    print(start_time_epoc, end_time_epoc)
    report_repo_obj = ReportRepository(db)
    report_data = await report_repo_obj.get_report_data(start_time_epoc, end_time_epoc)
    json_str = json.dumps(report_data, default=str)
    attendence_data = json.loads(json_str)
    return attendence_data
