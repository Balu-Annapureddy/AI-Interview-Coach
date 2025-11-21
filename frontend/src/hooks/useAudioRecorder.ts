import { useState, useRef, useCallback } from 'react';

interface UseAudioRecorderProps {
    onAudioData: (data: Int16Array) => void;
}

export const useAudioRecorder = ({ onAudioData }: UseAudioRecorderProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const inputRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Create AudioContext with 16kHz sample rate
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 16000,
            });
            audioContextRef.current = audioContext;

            const input = audioContext.createMediaStreamSource(stream);
            inputRef.current = input;

            // Buffer size 4096 is ~256ms at 16kHz. Close enough to 200ms.
            // For exact 200ms (3200 samples), we'd need a circular buffer, but 4096 is fine for now.
            // We'll stick to 4096 for simplicity and performance.
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                // Convert Float32 to Int16
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    // Clamp and scale to 16-bit integer
                    const s = Math.max(-1, Math.min(1, inputData[i]));
                    pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                onAudioData(pcmData);
            };

            input.connect(processor);
            processor.connect(audioContext.destination); // Needed for Chrome to fire events

            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    }, [onAudioData]);

    const stopRecording = useCallback(() => {
        if (processorRef.current && inputRef.current) {
            inputRef.current.disconnect();
            processorRef.current.disconnect();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        setIsRecording(false);
    }, []);

    return { isRecording, startRecording, stopRecording };
};
