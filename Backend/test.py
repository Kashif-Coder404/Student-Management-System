import json,os

# # path = './users.json'
# # data = {}
# # if(not os.path.exists(path)):
# #     with open("./users.json","w") as file:
# #         json.dump({},file,indent=4)
# #         data = json.load(file)
    
# # def getUsersNum():
# #     with open(path,"r") as f:
# #         data = json.load(f)
# #         keys = 0
# #         for key in data:
# #             if(key):
# #                 keys = keys +1
# #         return keys

# # def addStudent(student: dict):
# #     keys = 0
# #     with open(path,"r") as f:
# #         data = json.load(f)
# #         for key in data:
# #             if(key):
# #                 keys += 1
# #         with open(path,"w") as file:
# #             data["S"+ str(keys + 1)] = {
# #                 "name": student.get("name"),
# #                 "rollNo": student.get("rollNo"),
# #                 "email":student.get("email"),
# #                 "phone":student.get("phone"),
# #                 "gender":student.get("gender"),
# #                 "course":student.get("course"),
# #                 "address": student.get("address")}
# #             json.dump(data,file,indent=4)


# # def delSt(stRoll):
# #     with open(path,"r") as f:
# #         data = json.load(f)
# #         with open(path,"w") as file:
# #             try:
# #                 del data[stRoll]
# #                 json.dump(data,file,indent=4)
# #                 return {"message": "Student Deleted Successfully"}
# #             except KeyError:
# #                 return {"message": "Student Not present"}


# stData = {
#     "s1": {
#         "name": "somename",
#         "rollNo": 12364
#     },
#     "s2": {
#         "name": "somename",
#         "rollNo": 12364
#     }
# }
path = "./users.json"
# isAdmin = False
# def delSt(rollNo,name):
#     try:
#         with open(path, "r") as f:
#             data = json.load(f)
            
#         if rollNo in data and data[rollNo].get("name") == name:
#             del data[rollNo]
#             with open(path, "w") as file:
#                 json.dump(data, file, indent=4)
#         else:
#             print(data[rollNo].get("name"))
#     except KeyError:
#             print("key error found!")          
#     except Exception as e:
#             print("ERROR: ", str(e)) 

# delSt("12345","Kashif ahmead")

# def generateRollNo(course: str):
#     courseStNum = 0
#     genRollNo = ""
#     with open(path,"r") as f:
#         data = json.load(f)
#         for key in data:
#             if(key):
#                 if(data[key].get("course") == course):
#                     courseStNum += 1
#         leadingZero = "-00" if courseStNum < 10 else "-0"
#         genRollNo = course + leadingZero + str(courseStNum + 1)
#     return str(genRollNo)

# def addSt(student):
#     newRoll = generateRollNo(student.get("course"))
#     with open(path,"r") as f:
#         data = json.load(f)
#         name = student.get("name")
#         namePresent = False
#         for key in data:
#             if(key):     
#                 if(data[key].get("name") == name):
#                     namePresent = True
#                     break
#         if namePresent:
#             print("Student Already Present. Try Different Name")
            
            
#             return {"message": "Student Already Present", "status": "error"}
#         with open(path,"w") as file:
#             data[newRoll] = {
#                 "firstName": student.get("firstName"),
#                 "name": student.get("name"),
#                 "rollNo": newRoll,
#                 "email":student.get("email"),
#                 "phone":student.get("phone"),
#                 "gender":student.get("gender"),
#                 "course":student.get("course"),
#                 "address": student.get("address")}
#             json.dump(data,file,indent=4)
#             print("successfully added the Student")
#             return {"message": "Student added!","student": student , "status": "success"}
# stObj = {
#         "firstName": "Kashif",
#         "name": "Kashif Ahmead",
#         "rollNo": "366454",
#         "email": "faeezdon77@gmail.com",
#         "phone": "976090395",
#         "gender": "Male",
#         "course": "B.B.A",
#         "address": "35/84 Muslim colony lakhi bhagh Dehradun"
# }      

# roll = "B.C.A-001"
# def stDet(rollNo):
#     with open(path,"r") as file:
#         data = json.load(file)
#         print(data.get(rollNo))
# stDet(roll)



def courseData():
    if not os.path.exists(path):
        