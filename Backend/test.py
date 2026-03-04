import os
import random
import string
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi

# Load environment variables
load_dotenv()

# Connect to MongoDB
uri = os.getenv("MONGO_URI")
client = MongoClient(uri, tlsCAFile=certifi.where(), server_api=ServerApi('1'))
db = client["FirstDB"]
stColl = db["Students"]

# Data pools for random generation
male_names = ["Aarav", "Vihaan", "Aditya", "Kashif", "Arjun", "Rohan", "Karan", "Rahul", "Omar", "Zain"]
female_names = ["Ananya", "Diya", "Isha", "Priya", "Sara", "Zara", "Neha", "Kavya", "Aisha", "Fatima"]
last_names = ["Sharma", "Verma", "Mehta", "Khan", "Ahmed", "Singh", "Patel", "Gupta", "Ali", "Das"]
cities = [
    "Dehradun, Uttarakhand", "Noida, Uttar Pradesh", "Bengaluru, Karnataka", 
    "Mumbai, Maharashtra", "Delhi, NCR", "Pune, Maharashtra", 
    "Hyderabad, Telangana", "Chennai, Tamil Nadu"
]
courses = ["BCA", "BBA", "BSc IT"]

students_to_insert = []

print("Generating 50 test students with random Roll Numbers...")

def generateRandomRollNo(course: str):
    """Generates a secure, random, and unique 6-character roll number."""
    while True:
        chars = string.ascii_uppercase + string.digits
        random_suffix = ''.join(random.choices(chars, k=6))
        newRoll = f"{course}-{random_suffix}"
        
        # Check database to ensure no collision
        existing_student = stColl.find_one({"rollNo": newRoll})
        if not existing_student:    
            return newRoll

# Generate 50 students
for _ in range(50):
    gender = random.choice(["Male", "Female"])
    f_name = random.choice(male_names) if gender == "Male" else random.choice(female_names)
    l_name = random.choice(last_names)
    full_name = f"{f_name} {l_name}"

    email = f"{f_name.lower()}.{l_name.lower()}{random.randint(10,999)}@testmail.com"
    phone = str(random.randint(8000000000, 9999999999))
    course = random.choice(courses)
    address = f"{random.randint(1, 150)} Random Street, {random.choice(cities)}"

    random_days_ago = random.randint(0, 30)
    random_minutes_ago = random.randint(0, 1440)
    created_at = datetime.now(timezone.utc) - timedelta(days=random_days_ago, minutes=random_minutes_ago)

    student_data = {
        "firstName": f_name,
        "name": full_name,
        "email": email,
        "phone": phone,
        "gender": gender,
        "course": course,
        "rollNo": generateRandomRollNo(course), # <--- Using the random generator here
        "address": address,
        "createdAt": created_at
    }

    students_to_insert.append(student_data)

# Upload to database
if students_to_insert:
    # Optional: Delete existing students to start fresh
    # stColl.delete_many({}) 
    
    result = stColl.insert_many(students_to_insert)
    print(f"✅ Successfully uploaded {len(result.inserted_ids)} students to MongoDB!")