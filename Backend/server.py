from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional # Import this


import json,os
app = FastAPI()

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1:5500",
    "http://192.168.31.116:5500",# Add the origin where your JS is running
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

path = "./users.json"
isAdmin = False
class DeleteStudent(BaseModel):
    # Making these optional prevents the 422 error when fields are missing
    authKey: Optional[str] = None 
    stRoll: Optional[str] = None
    name: Optional[str] = None

def checkPath():
    if(os.path.exists(path)):
        return True
    else:
        with open(path,"w") as file:
            json.dump({},file,indent=4)
        return False

@app.get("/students/")
def students():
    checkPath()
    keys = 0
    lastkeyValue = {}
    with open(path,"r") as file:
            data = json.load(file)
            for key in data:
                if(not key): continue
                keys += 1
                lastkeyValue = data[key]
    
    return {"studentsNum": keys, "studentData" : data , "recentSt": lastkeyValue}
    
@app.post("/addStudent/")
def addStudent(student: dict):
    print("Recieved: ",student)
    def generateRollNo(course: str):
        courseStNum = 0
        genRollNo = ""

        try:
            # if file does not exist or is empty
            if not os.path.exists(path) or os.stat(path).st_size == 0:
                data = {}
            else:
                with open(path, "r") as f:
                    data = json.load(f)

            for key in data:
                if data[key].get("course") == course:
                    courseStNum += 1

            leadingZero = "-00" if courseStNum < 10 else "-0"
            genRollNo = course + leadingZero + str(courseStNum + 1)

            return genRollNo

        except json.JSONDecodeError:
            # fallback if JSON is broken
            return course + "-001"

        except Exception as e:
            print("Roll generation error:", e)
            return course + "-001"

    newRoll = generateRollNo(student.get("course"))

    try:
        # read existing data safely
        if not os.path.exists(path) or os.stat(path).st_size == 0:
            data = {}
        else:
            with open(path, "r") as f:
                data = json.load(f)

        name = student.get("name")
        namePresent = False

        for key in data:
            if data[key].get("name") == name:
                namePresent = True
                break

        if namePresent:
            print("Student Already Present. Try Different Name")
            return {"message": "Student Already Present", "status": "error"}

        # write data
        data[newRoll] = {
            "firstName": student.get("firstName"),
            "name": student.get("name"),
            "rollNo": newRoll,
            "email": student.get("email"),
            "phone": student.get("phone"),
            "gender": student.get("gender"),
            "course": student.get("course"),
            "address": student.get("address")
        }

        with open(path, "w") as file:
            json.dump(data, file, indent=4)

        print("Successfully added the student")

        return {
            "message": "Student added!",
            "student": data[newRoll],
            "status": "success"
        }

    except json.JSONDecodeError:
        return {"message": "Student data file is corrupted", "status": "error"}

    except Exception as e:
        print("Add student error:", e)
        return {"message": "Something went wrong", "status": "error"}

@app.post("/delStudents/") # Note: FastAPI uses curly braces {} for path parameters
def delStudents(payload: DeleteStudent):
    print(f"Payload Body: {payload}")
    global isAdmin

    # Check if the key from the URL matches your security requirement
    if not isAdmin:
        if payload.authKey != "yesDelSt2026":
            return {
                "msg" : "Invalid Key",
                "status" : "error",
                "isAdmin" : False
            }
        isAdmin = True
        print("admin check returned")
        return {
                "msg" : "Access granted",
                "status" : "success",
                "isAdmin" : True
            } 
    
    if not payload.stRoll or not payload.name:
        return {
            "msg": "Roll number and name are required",
            "status": "error",
            "isAdmin": isAdmin
        }
    try:
        with open(path, "r") as f:
            data = json.load(f)
        if payload.stRoll not in data:
            return {
                "msg": "Student not found",
                "status": "error",
                "isAdmin": isAdmin
            }
        if data[payload.stRoll].get("name") != payload.name:
            return {
                "msg": "Name does not match roll number",
                "status": "error",
                "isAdmin": isAdmin
            }
        del data[payload.stRoll]

        with open(path, "w") as f:
            json.dump(data, f, indent=4)
        
        return {
            "msg": "Student deleted successfully",
            "status": "success",
            "isAdmin": isAdmin
        }   
    except Exception as e:
        print("DELETE ERROR:", e)
        return {
            "msg": "Server error during deletion",
            "status": "error",
            "isAdmin": isAdmin
        }
@app.post("/logout")
def logout():
    global isAdmin
    isAdmin = False
    return {"message" :"Logged out!", "status" : "success"}