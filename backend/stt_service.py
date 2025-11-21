import os
import numpy as np

# Try to import faster_whisper, fall back to dummy service if not available
try:
    from faster_whisper import WhisperModel
    WHISPER_AVAILABLE = True
except (ImportError, OSError) as e:
    print(f"Warning: faster_whisper not available ({e}). Using fallback STT service.")
    WHISPER_AVAILABLE = False
    from stt_service_fallback import STTServiceFallback

class STTService:
    def __init__(self, model_size="tiny.en", device="cpu", compute_type="int8"):
        """
        Initialize the Whisper model or fallback service.
        :param model_size: Size of the model (tiny.en, base.en, small.en, etc.)
        :param device: 'cpu' or 'cuda'
        :param compute_type: 'int8', 'float16', 'float32'
        """
        if WHISPER_AVAILABLE:
            print(f"Loading Whisper model: {model_size} on {device}...")
            self.model = WhisperModel(model_size, device=device, compute_type=compute_type)
            print("Whisper model loaded.")
            self.use_fallback = False
        else:
            print("Using fallback STT service (dummy transcription)")
            self.fallback = STTServiceFallback()
            self.use_fallback = True

    def transcribe(self, audio_data: np.ndarray, sample_rate: int = 16000) -> str:
        """
        Transcribe audio data.
        :param audio_data: Numpy array of audio samples
        :param sample_rate: Sample rate of the audio
        :return: Transcribed text
        """
        if self.use_fallback:
            return self.fallback.transcribe(audio_data, sample_rate)
        
        # faster-whisper expects float32 audio in range [-1, 1]
        if audio_data.dtype == np.int16:
            audio_data = audio_data.astype(np.float32) / 32768.0
        
        segments, info = self.model.transcribe(audio_data, beam_size=5, language="en", condition_on_previous_text=False)
        
        text = " ".join([segment.text for segment in segments])
        return text.strip()
