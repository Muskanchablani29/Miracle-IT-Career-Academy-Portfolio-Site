import requests
import json

# Test the announcements API
try:
    response = requests.get('http://localhost:8000/api/courses/announcements/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data)} announcements")
        for i, announcement in enumerate(data[:2]):
            print(f"{i+1}. {announcement.get('title', 'No title')} - {announcement.get('course_title', 'No course')}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")