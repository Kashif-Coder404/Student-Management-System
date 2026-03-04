from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pydantic import BaseModel , EmailStr
from typing import Optional # Import this
from dotenv import load_dotenv
import os

load_dotenv()

app  = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1:5500",
    "http://192.168.31.116:5500",# Add the origin where your JS is running
    "https://stmansys.netlify.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
uri = os.getenv("MONGO_URI")

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db  = client["FirstDB"]
stColl = db["Students"]
prKeyColl = db["Privatekeys"]

isAdmin = False

@app.get("/")
def home():
    print(uri)
    print("Data base: ",db)
    return {"msg" : "Server is running"}

@app.get("/students")
def students():
    students = list(stColl.find({}, {"_id" : 0}))
    return {"studentsNum": len(students), "studentData" : students}

class AdminKey(BaseModel):
    authKey: Optional[str] = None
@app.post("/adminCheck")
def adminCheck(payload: AdminKey):
    dbData = prKeyColl.find_one({}, {"_id" : 0 , "key": 1})
    db_key = dbData["key"] if dbData else None
    global isAdmin
    # return {"YOUR KEY": payload.key, "DB KEY" : db_key}
    print(f"User key: ",payload)
    if payload.authKey == db_key:
        isAdmin = True
        print("true runs") 
        return {"msg" : "Access Granted!" , "isAdmin" : isAdmin , "status" : "success"}
    else:
        isAdmin = False
        print("false runs")
        return {"msg" : "Key invalid" , "status" : "error" , "isAdmin" : False}


class StudentDetails(BaseModel):
    firstName: str
    name: str
    email: EmailStr
    phone: str
    gender: str
    course: str
    address: str

@app.post("/addStudent")
def addStudent(st: StudentDetails):
    
    def generateRollNo(course: str):
        courseStNum = stColl.count_documents({"course": course})
        leadingZero = "-00" if courseStNum < 10 else "-0"
        genRollNo = course + leadingZero + str(courseStNum + 1)
        return genRollNo
    
    students = list(stColl.find({"course": st.course}, {"_id": 0}))
    
    
    # Checking for the already present student with name for now
    for el in students:
        if(el["name"] == st.name and el["email"] == st.email.lower()):
            print(f"Student {el["name"]} Already Present")
            return {"message": "Student Already Present", "status": "error"}
    
    #Adding student to database
    
    student_data = {
        "firstName": st.firstName,
        "name": st.name,
        "email": st.email.lower(),
        "phone": st.phone,
        "gender": st.gender,
        "course": st.course,
        "rollNo": generateRollNo(st.course),
        "address": st.address
    }

    
    stColl.insert_one(student_data)
    
    return {
            "message": "Student added!",
            "student": list(stColl.find({"course": st.course}, {"_id": 0})),
            "status": "success"
    }
        
class DeleteStudent(BaseModel):
    # Making these optional prevents the 422 error when fields are missing
    stRoll: Optional[str] = None
    name: Optional[str] = None
@app.post("/delStudent")
def delStudent(payload: DeleteStudent):
    
    if not payload.stRoll or not payload.name:
        return {
            "msg": "Roll number and name are required",
            "status": "error",
            "isAdmin": isAdmin
        }
    students = stColl.find_one({"rollNo" : payload.stRoll , "name" : payload.name})
    
    if(not students):
        print(students)
        return {
                "msg": "Student not found",
                "status": "error",
                "isAdmin": isAdmin
            }
    
    stColl.delete_one({"rollNo" : payload.stRoll , "name" : payload.name})
    
    return {"msg": "Student Deleted","status" : "success" , "isAdmin" : isAdmin}

class StudentDetail(BaseModel):
    stRoll: Optional[str] = None
@app.post("/stDet")
def studentDetail(payload: StudentDetail):
    student = stColl.find_one({"rollNo": payload.stRoll}, {"_id" : 0})
    if not student:
        return {"error": "Student not found"}

    return {"msg" : student}

@app.post("/logout")
def logout():
    global isAdmin
    isAdmin = False
    
    return {"message" :"Logged out!", "status" : "success"}
