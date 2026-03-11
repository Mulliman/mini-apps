
import React, { useEffect, useRef } from 'react';
import { Particle } from '../utils/gameUtils';

interface ConfettiProps {
  isActive: boolean;
  emoji?: string;
}

export const Confetti: React.FC<ConfettiProps> = ({ isActive, emoji }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      particles.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Burst
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Initial heavy burst
    for (let i = 0; i < 50; i++) {
      particles.current.push(new Particle(centerX, centerY, emoji));
    }

    let frame = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particles.current.splice(index, 1);
        }
      });

      // Continually add particles if active to create "whizzing" effect
      if (isActive && particles.current.length < 100 && frame % 5 === 0) {
         particles.current.push(new Particle(canvas.width / 2, canvas.height / 2, emoji));
      }
      frame++;

      if (particles.current.length > 0 || isActive) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, emoji]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};
