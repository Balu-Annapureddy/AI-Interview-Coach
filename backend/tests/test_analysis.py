# -*- coding: utf-8 -*-
"""
InterviewCoach Unit Test Suite
Tests speech analysis, filler word extraction, WPM calculation, and feedback recommendations.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from analysis import Analyzer


class TestInterviewCoach(unittest.TestCase):

    def setUp(self):
        self.analyzer = Analyzer()

    def test_wpm_calculation(self):
        """Test words per minute calculation."""
        text = "This is a simple speech sample to test the words per minute calculation engine."
        duration = 6.0  # 14 words in 6 seconds -> 140 WPM
        result = self.analyzer.analyze_text(text, duration)
        self.assertEqual(result["wpm"], 140)

    def test_filler_word_detection(self):
        """Test filler word extraction."""
        text = "Um basically I think like we should uh start the project."
        duration = 10.0
        result = self.analyzer.analyze_text(text, duration)
        fillers = result["filler_words"]
        self.assertIn("um", fillers)
        self.assertIn("basically", fillers)
        self.assertIn("like", fillers)
        self.assertIn("uh", fillers)

    def test_speed_recommendation(self):
        """Test fast speech speed recommendation."""
        text = "word " * 180
        result = self.analyzer.analyze_text(text, 60.0)  # 180 WPM
        self.assertIn("too fast", result["recommendation"])

    def test_slow_recommendation(self):
        """Test slow speech speed recommendation."""
        text = "word " * 90
        result = self.analyzer.analyze_text(text, 60.0)  # 90 WPM
        self.assertIn("slowly", result["recommendation"])


if __name__ == "__main__":
    unittest.main()
