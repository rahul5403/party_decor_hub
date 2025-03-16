import time
import json
import hashlib
import base64
import requests
from fastapi import FastAPI, HTTPException, Request
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# PhonePe API Credentials (Set these in .env file)
PHONEPE_MERCHANT_ID = os.getenv("PHONEPE_MERCHANT_ID")
PHONEPE_SALT_KEY = os.getenv("PHONEPE_SALT_KEY")
PHONEPE_SALT_INDEX = os.getenv("PHONEPE_SALT_INDEX")
PHONEPE_BASE_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
PHONEPE_STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status"
CALLBACK_URL = "https://your-backend.com/phonepe/callback"

# Function to generate X-VERIFY header
def generate_x_verify(payload: str) -> str:
    checksum = hashlib.sha256((payload + PHONEPE_SALT_KEY).encode()).hexdigest()
    return f"{checksum}##{PHONEPE_SALT_INDEX}"

# API Endpoint to Initiate Payment
@app.post("/phonepe/initiate-payment")
async def initiate_payment(request: Request):
    try:
        data = await request.json()
        amount = data.get("amount")  # Amount in INR
        user_id = data.get("user_id")

        if not amount or not user_id:
            raise HTTPException(status_code=400, detail="Amount and user_id are required.")

        transaction_id = f"txn_{user_id}_{int(time.time())}"  # Unique transaction ID

        payload = {
            "merchantId": PHONEPE_MERCHANT_ID,
            "merchantTransactionId": transaction_id,
            "amount": amount * 100,  # Convert to paise
            "redirectUrl": CALLBACK_URL,
            "callbackUrl": CALLBACK_URL,
            "mobileNumber": "9999999999",  # Optional
            "paymentInstrument": {"type": "PAY_PAGE"}
        }

        json_payload = json.dumps(payload)
        encoded_payload = base64.b64encode(json_payload.encode()).decode()
        x_verify = generate_x_verify(encoded_payload)

        headers = {
            "Content-Type": "application/json",
            "X-VERIFY": x_verify,
            "X-MERCHANT-ID": PHONEPE_MERCHANT_ID
        }

        response = requests.post(PHONEPE_BASE_URL, headers=headers, json={"request": encoded_payload})

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API Endpoint to Verify Payment Status
@app.get("/phonepe/check-payment-status")
async def check_payment_status(transaction_id: str):
    try:
        url = f"{PHONEPE_STATUS_URL}/{PHONEPE_MERCHANT_ID}/{transaction_id}"
        x_verify = generate_x_verify(f"/pg/v1/status/{PHONEPE_MERCHANT_ID}/{transaction_id}")
                                                                                            
        headers = {
            "Content-Type": "application/json",
            "X-VERIFY": x_verify
        }

        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run FastAPI server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
