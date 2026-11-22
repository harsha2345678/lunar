import unittest
from app.main import (
    get_detections,
    get_lander_risk,
    get_rover_state,
    get_analytics,
    get_mission_overview,
    get_notifications,
)

class TestLunarAPI(unittest.TestCase):
    def test_detections_endpoint(self):
        data = get_detections()
        self.assertGreaterEqual(len(data.boulders), 6)
        self.assertEqual(data.model, "YOLOv9-Lunar")

    def test_lander_risk_endpoint(self):
        data = get_lander_risk()
        self.assertEqual(data.safety_score, 88)
        self.assertGreaterEqual(len(data.safe_zones), 2)

    def test_rover_state_endpoint(self):
        data = get_rover_state()
        self.assertEqual(data.risk_score, 14)
        self.assertEqual(len(data.hazards), 3)

    def test_mission_analytics_endpoint(self):
        data = get_analytics(range="7d")
        self.assertEqual(len(data.size_histogram.bars), 7)
        self.assertEqual(len(data.hazard_donut), 3)

    def test_mission_overview_endpoint(self):
        data = get_mission_overview()
        self.assertEqual(len(data.metrics), 4)
        self.assertEqual(len(data.detection_feed), 4)

    def test_notifications_endpoint(self):
        data = get_notifications(unread=True)
        self.assertGreaterEqual(data.unread_count, 1)

if __name__ == "__main__":
    unittest.main()
