from analysis import Analyzer
from stt_service import STTService
import numpy as np
import random

class AudioProcessor:
    def __init__(self):
        self.buffer = bytearray()
        self.sample_rate = 16000
        self.chunk_duration = 0.2  # 200ms
        self.chunk_size = int(self.sample_rate * self.chunk_duration * 2) # 2 bytes per sample (16-bit)
        self.analyzer = Analyzer()
        self.stt_service = STTService()
        self.transcript_buffer = []

    def process(self, chunk: bytes):
        """
        Process incoming audio chunk.
        Returns analysis result if a full processing unit is ready, else None.
        """
        self.buffer.extend(chunk)
        
        # Process every 1 second of audio
        if len(self.buffer) >= self.sample_rate * 2 * 1: 
            # Convert to numpy array
            audio_data = np.frombuffer(self.buffer, dtype=np.int16)
            
            # Clear buffer (keep last 0.1s for continuity if needed, but clearing for now)
            self.buffer = bytearray()
            
            return self._analyze(audio_data)
        
        return None

    def _analyze(self, audio_data):
        # Transcribe audio
        transcript_segment = self.stt_service.transcribe(audio_data)
        
        # Analyze
        analysis = self.analyzer.analyze_text(transcript_segment, 1.0) # 1 second duration
        
        # Add transcript to result
        analysis["transcript"] = transcript_segment
        
        return analysis
