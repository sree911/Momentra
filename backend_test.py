import requests
import sys
import json
from datetime import datetime

class MomentraAPITester:
    def __init__(self, base_url="https://videography-hub-4.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - {name}")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                print(f"❌ FAILED - {name}")
                print(f"   Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text}")
                except:
                    pass
                self.failed_tests.append({
                    'test': name,
                    'endpoint': endpoint,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'error': response.text[:200] if response.text else 'No response'
                })

        except Exception as e:
            print(f"❌ FAILED - {name}")
            print(f"   Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'endpoint': endpoint,
                'expected': expected_status,
                'actual': 'Exception',
                'error': str(e)
            })
            return False, {}

        return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_create_booking(self):
        """Test booking creation"""
        booking_data = {
            "full_name": "Test User",
            "email": "test@example.com",
            "phone": "+91 9876543210",
            "booking_date": "2024-12-31",
            "duration": "2hr",
            "location": "Mumbai",
            "additional_notes": "Test booking for API testing"
        }
        
        success, response = self.run_test(
            "Create Booking",
            "POST",
            "bookings",
            200,
            data=booking_data
        )
        
        if success and isinstance(response, dict):
            return response.get('id')
        return None

    def test_get_bookings(self):
        """Test get all bookings"""
        return self.run_test("Get All Bookings", "GET", "bookings", 200)

    def test_create_membership(self):
        """Test membership creation"""
        membership_data = {
            "full_name": "Test Member",
            "email": "member@example.com",
            "phone": "+91 9876543211",
            "city": "Mumbai",
            "customer_type": "Creator",
            "message": "Test membership for API testing"
        }
        
        success, response = self.run_test(
            "Create Membership",
            "POST",
            "memberships",
            200,
            data=membership_data
        )
        
        if success and isinstance(response, dict):
            return response.get('id')
        return None

    def test_get_memberships(self):
        """Test get all memberships"""
        return self.run_test("Get All Memberships", "GET", "memberships", 200)

    def test_create_contact(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test Contact",
            "email": "contact@example.com",
            "message": "This is a test message for API testing"
        }
        
        success, response = self.run_test(
            "Create Contact",
            "POST",
            "contacts",
            200,
            data=contact_data
        )
        
        if success and isinstance(response, dict):
            return response.get('id')
        return None

    def test_get_contacts(self):
        """Test get all contacts"""
        return self.run_test("Get All Contacts", "GET", "contacts", 200)

    def test_excel_export(self):
        """Test Excel export endpoint"""
        success, response = self.run_test(
            "Excel Export",
            "GET",
            "admin/export",
            200
        )
        return success

    def test_form_validation(self):
        """Test form validation with invalid data"""
        print(f"\n🔍 Testing Form Validation...")
        
        # Test booking with missing fields
        invalid_booking = {
            "full_name": "Test",
            # Missing email, phone, etc.
        }
        
        success, response = self.run_test(
            "Invalid Booking Data",
            "POST",
            "bookings",
            422,  # Validation error
            data=invalid_booking
        )
        
        # Test membership with invalid email
        invalid_membership = {
            "full_name": "Test",
            "email": "invalid-email",
            "phone": "+91 9876543210",
            "city": "Mumbai",
            "customer_type": "Creator"
        }
        
        success, response = self.run_test(
            "Invalid Membership Email",
            "POST",
            "memberships",
            422,
            data=invalid_membership
        )

def main():
    print("🚀 Starting Momentra API Testing...")
    print("=" * 60)
    
    # Setup
    tester = MomentraAPITester()
    
    # Test API accessibility
    print("\n📡 Testing API Connectivity...")
    if not tester.test_api_root()[0]:
        print("❌ API is not accessible. Stopping tests.")
        return 1

    # Test all endpoints
    print("\n📝 Testing Booking Endpoints...")
    booking_id = tester.test_create_booking()
    tester.test_get_bookings()
    
    print("\n👥 Testing Membership Endpoints...")
    membership_id = tester.test_create_membership()
    tester.test_get_memberships()
    
    print("\n📞 Testing Contact Endpoints...")
    contact_id = tester.test_create_contact()
    tester.test_get_contacts()
    
    print("\n📊 Testing Admin Endpoints...")
    tester.test_excel_export()
    
    print("\n🔍 Testing Form Validation...")
    tester.test_form_validation()

    # Print results summary
    print("\n" + "=" * 60)
    print(f"📊 TEST SUMMARY")
    print("=" * 60)
    print(f"Total Tests: {tester.tests_run}")
    print(f"Passed: {tester.tests_passed}")
    print(f"Failed: {len(tester.failed_tests)}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for test in tester.failed_tests:
            print(f"   • {test['test']}: Expected {test['expected']}, got {test['actual']}")
            if test['error']:
                print(f"     Error: {test['error'][:100]}...")
    
    # Test IDs for reference
    print(f"\n🔗 Created Test Records:")
    if booking_id:
        print(f"   • Booking ID: {booking_id}")
    if membership_id:
        print(f"   • Membership ID: {membership_id}")
    if contact_id:
        print(f"   • Contact ID: {contact_id}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())