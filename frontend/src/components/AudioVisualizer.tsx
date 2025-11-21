import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
// @ts-ignore
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

interface AudioVisualizerProps {
    isRecording: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const recordPluginRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ws = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#4ade80', // Green-400
            progressColor: '#22c55e', // Green-500
            cursorColor: 'transparent',
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            height: 100,
            normalize: true,
            minPxPerSec: 100,
        });

        const record = RecordPlugin.create();
        ws.registerPlugin(record);

        wavesurferRef.current = ws;
        recordPluginRef.current = record;

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (recordPluginRef.current) {
            if (isRecording) {
                // startMic() visualizes the audio without recording to a blob
                recordPluginRef.current.startMic();
            } else {
                recordPluginRef.current.stopMic();
            }
        }
    }, [isRecording]);

    return <div ref={containerRef} className="w-full h-24 bg-slate-800 rounded-lg overflow-hidden" />;
};
