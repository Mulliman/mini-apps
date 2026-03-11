import React, { useEffect, useState } from 'react';
import { Particle } from '../types';

const COLORS = ['#FFD700', '#FF0000', '#00FF00', '#00FFFF', '#FF00FF', '#FFFFFF'];

export const Sparkles: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Initialize explosion
    const newParticles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 5;
      newParticles.push({
        id: i,
        x: 0, // Relative to container
        y: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
      });
    }
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5, // Gravity
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: p.color,
            transform: `translate(${p.x}px, ${p.y}px)`,
            opacity: p.life,
          }}
        />
      ))}
    </div>
  );
};