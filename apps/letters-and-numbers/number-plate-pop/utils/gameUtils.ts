
export const WORD_EMOJI_MAP: Record<string, string> = {
  "ant": "🐜",
  "bat": "🦇",
  "bed": "🛏️",
  "bee": "🐝",
  "bin": "🗑️",
  "box": "📦",
  "bus": "🚌",
  "car": "🚗",
  "cat": "🐱",
  "cup": "🥤",
  "cut": "✂️",
  "dad": "👨",
  "dog": "🐶",
  "egg": "🥚",
  "fox": "🦊",
  "hat": "👒",
  "hen": "🐔",
  "leg": "🦵",
  "lip": "👄",
  "map": "🗺️",
  "mug": "☕",
  "mum": "👩",
  "nut": "🥜",
  "pan": "🍳",
  "pen": "🖊️",
  "pig": "🐷",
  "rat": "🐀",
  "red": "🔴",
  "run": "🏃",
  "sad": "😢",
  "six": "6️⃣",
  "sun": "☀️",
  "ten": "🔟",
  "van": "🚐",
  "web": "🕸️",
  "wet": "💦"
};

export const generateUKPlate = () => {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "0123456789";

  const getRandomChar = (source: string) => source[Math.floor(Math.random() * source.length)];

  // Get random word
  const words = Object.keys(WORD_EMOJI_MAP);
  const rawWord = words[Math.floor(Math.random() * words.length)];
  
  // Ensure word is uppercase for the number plate regardless of map key casing
  const word = rawWord.toUpperCase();
  const emoji = WORD_EMOJI_MAP[rawWord];

  // Format: AA99 WORD
  const p1 = getRandomChar(letters);
  const p2 = getRandomChar(letters);
  const n1 = getRandomChar(numbers);
  const n2 = getRandomChar(numbers);

  return {
    plate: `${p1}${p2}${n1}${n2} ${word}`,
    word,
    emoji
  };
};

// Simple confetti particle class for the canvas
export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  emoji?: string;
  rotation: number;
  rotationSpeed: number;

  constructor(x: number, y: number, emoji?: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 6; // Initial upward burst
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.size = emoji ? Math.random() * 30 + 20 : Math.random() * 10 + 5;
    this.life = 200;
    this.emoji = emoji;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.15; // Gravity
    this.life -= 1;
    this.rotation += this.rotationSpeed;
    
    // Air resistance
    this.vx *= 0.99;
    
    if (!this.emoji) {
        this.size *= 0.96;
    } else {
        if (this.life < 40) this.size *= 0.9;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.emoji) {
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, 0, 0);
    } else {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
  }
}
