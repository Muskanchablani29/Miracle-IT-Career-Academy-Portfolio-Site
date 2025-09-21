#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.urls import reverse
from django.test import RequestFactory
from users.views import AttendanceViewSet

def test_attendance_endpoint():
    try:
        # Test if the URL pattern exists
        factory = RequestFactory()
        request = factory.get('/api/attendance/overall-stats/')
        
        # Create viewset instance
        viewset = AttendanceViewSet()
        viewset.request = request
        
        # Test the overall_stats method
        response = viewset.overall_stats(request)
        print(f"Attendance endpoint test: {response.status_code}")
        print(f"Response data: {response.data}")
        
    except Exception as e:
        print(f"Error testing attendance endpoint: {e}")

if __name__ == "__main__":
    test_attendance_endpoint()