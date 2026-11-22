import unittest
from app.main import health_check

class TestHealth(unittest.TestCase):
    def test_health_endpoint_direct(self):
        response = health_check()
        self.assertEqual(response.status, "ok")
        self.assertIn("Lunar Sentry", response.app)

if __name__ == "__main__":
    unittest.main()
