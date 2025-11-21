import React, { useEffect, useState } from 'react';
import { WebSocketProvider, useWebSocket } from './contexts/WebSocketContext';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { AudioVisualizer } from './components/AudioVisualizer';

const Dashboard = () => {
  const { isConnected, sendMessage, lastMessage } = useWebSocket();
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<any>(null);

  const onAudioData = (data: Int16Array) => {
    if (isConnected) {
      // Send raw PCM data as binary
      sendMessage(data.buffer as ArrayBuffer);
    }
  };

  const { isRecording, startRecording, stopRecording } = useAudioRecorder({ onAudioData });

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.transcript) {
        setTranscript(prev => prev + ' ' + lastMessage.transcript);
      }
      setFeedback(lastMessage);
    }
  }, [lastMessage]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AI Interview Coach
        </h1>
        <div className={`px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Controls & Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Live Session</h2>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${isRecording
                  ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  }`}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>

            <div className="mb-6">
              <AudioVisualizer isRecording={isRecording} />
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 h-64 overflow-y-auto border border-slate-700/50">
              <p className="text-slate-400 text-sm mb-2">Transcript:</p>
              <p className="text-lg leading-relaxed text-slate-200">
                {transcript || "Start speaking to see transcription..."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Real-time Feedback */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Real-time Analysis</h2>

            {feedback ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-400 text-xs uppercase">WPM</p>
                    <p className="text-2xl font-bold text-blue-400">{feedback.wpm || 0}</p>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-400 text-xs uppercase">Confidence</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {Math.round((feedback.confidence || 0) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase mb-1">Tone</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${feedback.sentiment === 'positive' ? 'bg-green-500' :
                      feedback.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                    <span className="capitalize font-medium">{feedback.tone || 'Neutral'}</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase mb-2">Filler Words</p>
                  <div className="flex flex-wrap gap-2">
                    {feedback.filler_words && feedback.filler_words.length > 0 ? (
                      feedback.filler_words.map((word: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-md border border-red-500/30">
                          {word}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm italic">None detected</span>
                    )}
                  </div>
                </div>

                {feedback.recommendation && (
                  <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                    <p className="text-blue-400 text-xs uppercase mb-1">Coach Tip</p>
                    <p className="text-sm text-blue-100">{feedback.recommendation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <p>Waiting for analysis...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <WebSocketProvider>
      <Dashboard />
    </WebSocketProvider>
  );
}

export default App;
