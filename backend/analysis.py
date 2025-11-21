import re

class Analyzer:
    def __init__(self):
        self.filler_words = {"um", "uh", "like", "basically", "you know", "actually", "literally"}
        
    def analyze_text(self, text: str, duration_seconds: float):
        words = text.lower().split()
        word_count = len(words)
        
        # WPM Calculation
        wpm = int((word_count / duration_seconds) * 60) if duration_seconds > 0 else 0
        
        # Filler Word Detection
        found_fillers = [w for w in words if w in self.filler_words]
        
        # Basic Sentiment (Placeholder)
        # In a real app, use NLTK or TextBlob or a transformer model
        sentiment = "neutral"
        tone = "neutral"
        confidence = 0.8
        
        # Simple heuristics
        if "good" in words or "great" in words:
            sentiment = "positive"
        elif "bad" in words or "difficult" in words:
            sentiment = "negative"
            
        return {
            "wpm": wpm,
            "filler_words": found_fillers,
            "sentiment": sentiment,
            "tone": tone,
            "confidence": confidence,
            "recommendation": self._get_recommendation(wpm, len(found_fillers))
        }

    def _get_recommendation(self, wpm, filler_count):
        if wpm > 160:
            return "You are speaking a bit too fast. Try to slow down."
        if wpm < 110:
            return "You are speaking a bit slowly. Try to pick up the pace."
        if filler_count > 2:
            return "Try to reduce filler words like 'um' and 'like'."
        return "Good pace and clarity. Keep it up!"
