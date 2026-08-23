import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Loading audio engine...' },
      { progress: 40, text: 'Preparing synthwave interface...' },
      { progress: 60, text: 'Calibrating neon effects...' },
      { progress: 80, text: 'Synchronizing frequencies...' },
      { progress: 100, text: 'Experience ready.' },
    ];

    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setProgress(step.progress);
        setLoadingText(step.text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-deep flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-vignette" />
      <div className="absolute inset-0 scanlines opacity-20" />
      
      {/* Loading Content */}
      <div className="relative z-10 text-center px-4 xs:px-6 w-full max-w-2xl mx-auto">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="font-orbitron font-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gradient-neon mb-2 leading-tight break-words">
            GRAFENBERG
          </h1>
          <div className="waveform max-w-xs mx-auto opacity-80" />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-orange transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-muted-foreground text-sm animate-pulse">
          {loadingText}
        </p>

        {/* Progress Percentage */}
        <p className="text-neon-cyan font-orbitron font-bold text-lg mt-2">
          {progress}%
        </p>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-pulse opacity-60" />
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-neon-magenta rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-neon-orange rounded-full animate-pulse opacity-50" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default LoadingScreen;