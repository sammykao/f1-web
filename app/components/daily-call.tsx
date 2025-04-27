'use client';

import { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

interface DailyCallProps {
  roomUrl: string;
}

export function DailyCall({ roomUrl }: DailyCallProps) {
  const callFrameRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || callFrameRef.current) return;

    let frame: any = null;
    const initDaily = async () => {
      try {
        // Destroy any existing frames first
        const existingFrames = document.querySelectorAll('iframe[title="daily-frame"]');
        existingFrames.forEach(frame => frame.remove());

        // Create and configure the Daily.co call frame
        frame = DailyIframe.createFrame(wrapper, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '0',
          },
          showLeaveButton: true,
          showFullscreenButton: true,
        });

        // Store the frame reference
        callFrameRef.current = frame;

        // Join the call
        await frame.join({ url: roomUrl });
      } catch (error) {
        console.error('Error initializing Daily.co:', error);
      }
    };

    initDaily();

    // Cleanup on unmount
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [roomUrl]);

  return (
    <div ref={wrapperRef} className="w-full h-full absolute inset-0" />
  );
} 