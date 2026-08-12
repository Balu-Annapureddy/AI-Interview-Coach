# Backend Setup Instructions

## Prerequisites

### Windows Users: Microsoft Visual C++ Redistributable

Both `faster-whisper` and `openai-whisper` require the **Microsoft Visual C++ Redistributable** to be installed on Windows.

**Download and install from:**
- [VC++ Redistributable (x64)](https://aka.ms/vs/17/release/vc_redist.x64.exe)

After installation, restart your terminal/IDE.

### Python Dependencies

Install all required packages:

```bash
# Activate virtual environment
backend\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Fallback Mode

If you cannot install the VC++ Redistributable, the application will automatically use a **fallback STT service** that generates dummy transcriptions for development purposes. This allows you to:
- Test the WebSocket pipeline
- Verify the analysis logic
- Develop the frontend

The fallback service will print a warning message when initialized.

## Running the Backend

```bash
# From project root
python backend/main.py
```

The server will start on `http://localhost:8000`

## Testing

```bash
# Test the STT service
python backend/test_stt.py
```
