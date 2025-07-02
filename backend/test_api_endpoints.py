#!/usr/bin/env python
"""
Test API endpoints for notifications and receipts
"""
import os
import sys
import django
import requests

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_api_endpoints():
    """Test API endpoints"""
    base_url = 'http://localhost:8000/api'
    
    endpoints_to_test = [
        '/admin-notifications/',
        '/student-notifications/',
        '/fee-payments/download-receipt/',
        '/fee-reports/',
    ]
    
    print("Testing API endpoints...")
    
    for endpoint in endpoints_to_test:
        url = base_url + endpoint
        try:
            # Test GET request (without authentication for now)
            response = requests.get(url, timeout=5)
            status = "✅ Available" if response.status_code in [200, 401, 403] else f"❌ Error ({response.status_code})"
            print(f"{endpoint}: {status}")
        except requests.exceptions.ConnectionError:
            print(f"{endpoint}: ❌ Server not running")
        except Exception as e:
            print(f"{endpoint}: ❌ Error - {str(e)}")

if __name__ == "__main__":
    test_api_endpoints()