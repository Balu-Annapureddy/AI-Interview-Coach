import numpy as np
import random

class STTServiceFallback:
    """
    Fallback STT service for development when Whisper dependencies are not available.
    This generates realistic-looking dummy transcripts for testing the pipeline.
    """
    def __init__(self):
        print("Using Fallback STT Service (dummy transcription)")
        self.word_pool = [
            "I", "am", "speaking", "now", "and", "testing", "the", "system",
            "um", "like", "basically", "you", "know", "actually", "so",
            "this", "is", "a", "test", "of", "the", "interview", "coach",
            "application", "we", "are", "building", "today", "right",
            "okay", "well", "let", "me", "think", "about", "that"
        ]
    
    def transcribe(self, audio_data: np.ndarray, sample_rate: int = 16000) -> str:
        """
        Generate dummy transcript based on audio length.
        :param audio_data: Numpy array of audio samples
        :param sample_rate: Sample rate of the audio
        :return: Dummy transcribed text
        """
        # Calculate duration
        duration = len(audio_data) / sample_rate
        
        # Generate words based on duration (roughly 2-3 words per second)
        num_words = max(1, int(duration * 2.5))
        words = [random.choice(self.word_pool) for _ in range(num_words)]
        
        return " ".join(words)
