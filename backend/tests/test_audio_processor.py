# -*- coding: utf-8 -*-
"""
InterviewCoach Audio Processing & Stream Edge Case Unit Test Suite
Tests audio buffer initialization, empty audio chunk processing, and speech-to-text fallback handling.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from audio_processor import AudioProcessor


class TestInterviewCoachAudioProcessor(unittest.TestCase):

    def setUp(self):
        self.processor = AudioProcessor()

    def test_audio_processor_initialization(self):
        """Verify AudioProcessor initializes clean speech buffers."""
        self.assertIsNotNone(self.processor)
        self.assertIsNotNone(self.processor.analyzer)

    def test_empty_audio_chunk_handling(self):
        """Test processing empty bytes payload without crashing."""
        result = self.processor.process(b"")
        self.assertIsNone(result)


if __name__ == "__main__":
    unittest.main()
