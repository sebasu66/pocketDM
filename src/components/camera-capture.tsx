
'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Camera, RefreshCcw, Send, ArrowLeft } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onBack: () => void;
}

export function CameraCapture({ onCapture, onBack }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
  }, [stream]);

  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setImageSrc(canvas.toDataURL('image/png'));
        stopCamera();
      }
    }
  };
  
  const reset = () => {
    setImageSrc(null);
    startCamera();
  };

  useState(() => {
    startCamera();
    return () => stopCamera();
  });

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2"/>Back</Button>
        {imageSrc ? (
          <div className='flex gap-2'>
            <Button variant="outline" onClick={reset}><RefreshCcw className="mr-2"/>Retake</Button>
            <Button onClick={() => onCapture(imageSrc)}><Send className="mr-2" />Use Photo</Button>
          </div>
        ) : (
          <Button onClick={takePicture}><Camera className="mr-2"/>Take Picture</Button>
        )}
      </div>
    </div>
  );
}
