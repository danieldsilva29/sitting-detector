from fastapi import FastAPI
import cv2
import numpy as np
import base64
from pydantic import BaseModel

class Data(BaseModel):
    uri: str

app = FastAPI()

@app.post("/video")
async def root(uri: Data):
    print(uri)
    encoded_data = uri.uri
    arr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    classifier = cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_default.xml')
    faces = classifier.detectMultiScale(gray, 1.1, 4)
    if len(faces)!=0:
        return {"uri": "1"}
    else:
        return {"uri": "0"}

@app.get("/video")
def root():
    return {"message": "hello world this is the video api"}

#app.mount("/static", StaticFiles(directory="static"), name="static")

# templates = Jinja2Templates(directory="templates")

# @app.get("/", response_class=HTMLResponse)
# async def read_item():
#     return templates.TemplateResponse