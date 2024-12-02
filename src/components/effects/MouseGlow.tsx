import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  angle: number;
  speed: number;
  life: number;
  opacity: number;
  colorOffset: number; // New property for color variation
}

export default function MouseGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const points = useRef<Point[]>([]);
  const animationFrameId = useRef<number>();
  const lastSpawn = useRef(0);
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const noise = (x: number, y: number) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      return (Math.sin(X * 0.05 + Y * 0.1 + time.current * 0.001) + 1) * 0.5;
    };

    // Color palette
    const colors = {
      blue: { r: 59, g: 130, b: 246 },   // Bright blue
      purple: { r: 147, g: 51, b: 234 }, // Vibrant purple
      pink: { r: 236, g: 72, b: 153 },   // Hot pink
      indigo: { r: 79, g: 70, b: 229 },  // Deep indigo
    };

    const getColor = (offset: number) => {
      const t = (time.current * 0.0005 + offset) % 1;
      const phase = t * Math.PI * 2;
      
      return {
        r: Math.sin(phase) * 20 + colors.blue.r,
        g: Math.sin(phase + 2) * 20 + colors.purple.g,
        b: Math.sin(phase + 4) * 20 + colors.pink.b,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const spawnInterval = 16;

      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };

      if (now - lastSpawn.current > spawnInterval) {
        if (points.current.length < 200) {
          const angle = Math.random() * Math.PI * 2;
          points.current.push({
            x: mousePosition.current.x,
            y: mousePosition.current.y,
            prevX: mousePosition.current.x,
            prevY: mousePosition.current.y,
            angle,
            speed: 0.15 + Math.random() * 0.25,
            life: 1.0,
            opacity: 0.8 + Math.random() * 0.2,
            colorOffset: Math.random(), // Random color offset for each point
          });
        }
        lastSpawn.current = now;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.3;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'screen';

      points.current.forEach((point) => {
        point.prevX = point.x;
        point.prevY = point.y;

        const noiseX = noise(point.x * 0.003, time.current * 0.003) * 2 - 1;
        const noiseY = noise(point.y * 0.003, time.current * 0.003) * 2 - 1;
        
        point.angle += noiseX * 0.01;
        point.speed *= 0.997;
        
        point.x += Math.cos(point.angle) * point.speed + noiseX * 0.1;
        point.y += Math.sin(point.angle) * point.speed + noiseY * 0.1;
        
        point.life *= 0.995;
        
        const size = 150 * point.life;
        const alpha = point.life * point.opacity;

        const gradient = ctx.createLinearGradient(
          point.prevX, point.prevY,
          point.x, point.y
        );

        // Dynamic color transitions
        const startColor = getColor(point.colorOffset);
        const midColor1 = getColor(point.colorOffset + 0.33);
        const midColor2 = getColor(point.colorOffset + 0.66);
        const endColor = getColor(point.colorOffset + 1);

        gradient.addColorStop(0, `rgba(${startColor.r}, ${startColor.g}, ${startColor.b}, ${alpha * 0.8})`);
        gradient.addColorStop(0.3, `rgba(${midColor1.r}, ${midColor1.g}, ${midColor1.b}, ${alpha * 0.7})`);
        gradient.addColorStop(0.6, `rgba(${midColor2.r}, ${midColor2.g}, ${midColor2.b}, ${alpha * 0.6})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(point.prevX, point.prevY);
        
        const dx = point.x - point.prevX;
        const dy = point.y - point.prevY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const cx1 = point.prevX + dx * 0.3 + noiseX * dist * 0.15;
        const cy1 = point.prevY + dy * 0.3 + noiseY * dist * 0.15;
        const cx2 = point.prevX + dx * 0.7 + noiseX * dist * 0.15;
        const cy2 = point.prevY + dy * 0.7 + noiseY * dist * 0.15;

        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, point.x, point.y);
        
        ctx.lineWidth = size * 0.8;
        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });

      points.current = points.current.filter(point => point.life > 0.01);

      animationFrameId.current = requestAnimationFrame(render);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        mixBlendMode: 'screen',
        filter: 'blur(8px)',
        opacity: 1
      }}
    />
  );
}