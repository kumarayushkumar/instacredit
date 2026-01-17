from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Literal
import time

app = FastAPI(
    title="Fake Lender API",
    description="Mock lender service for loan status simulation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Status type definition
LoanStatus = Literal["Applied", "Approved", "Disbursed", "Rejected"]

class LoanStatusResponse(BaseModel):
    loan_id: str
    user_id: str
    status: LoanStatus
    approved_amount: int | None
    updated_at: str

# Multiple loans data store
LOAN_DATA = [
    {
        "loan_id": "LN101",
        "user_id": "U12",
        "approved_amount": 50000,
        "last_update": time.time(),
        "current_status_index": 0,
    },
    {
        "loan_id": "LN102",
        "user_id": "U13",
        "approved_amount": 10000,
        "last_update": time.time(),
        "current_status_index": 0,
    }
]

# Status progression cycle: Applied -> Approved -> Disbursed -> Rejected -> Applied
STATUS_CYCLE = ["Applied", "Approved", "Disbursed", "Rejected"]

def get_current_status(loan_data: dict) -> tuple[LoanStatus, int]:
    """
    Returns the current status based on time-based progression.
    Status changes every 20 seconds and cycles through all statuses.
    """
    current_time = time.time()
    time_elapsed = current_time - loan_data["last_update"]

    update_interval = 5	# seconds

    # If enough time has passed, progress to next status
    current_index = loan_data["current_status_index"]
    if time_elapsed >= update_interval:
        # Cycle to next status (wrap around after Rejected)
        new_index = (current_index + 1) % len(STATUS_CYCLE)
        loan_data["current_status_index"] = new_index
        loan_data["last_update"] = current_time
        return STATUS_CYCLE[new_index], new_index

    # Return current status
    return STATUS_CYCLE[current_index], current_index

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Fake Lender API",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/lender/loan-status")
async def get_loan_status() -> list[LoanStatusResponse]:
    """
    Get the current status of all loans.
    Status cycles every 20 seconds: Applied -> Approved -> Disbursed -> Rejected -> Applied
    """

    responses = []
    for loan_data in LOAN_DATA:
        status, _ = get_current_status(loan_data)

        approved_amount = 0
        if status in ["Approved", "Disbursed"]:
            approved_amount = loan_data["approved_amount"]

        responses.append(LoanStatusResponse(
            loan_id=loan_data["loan_id"],
            user_id=loan_data["user_id"],
            status=status,
            approved_amount=approved_amount,
            updated_at=datetime.now().isoformat()
        ))

    return responses

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
