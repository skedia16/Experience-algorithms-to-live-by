import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Info, Dice5, Zap, RefreshCcw, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Generate a landscape with multiple peaks
const generateLandscape = () => {
  const points = [];
  for (let x = 0; x <= 100; x++) {
    // A function with one global maximum and several local ones
    const y = 20 * Math.sin(x / 5) + 
              15 * Math.cos(x / 10) + 
              10 * Math.sin(x / 2) + 
              40; // Offset to keep it positive
    points.push({ x, y });
  }
  return points;
};

const LANDSCAPE = generateLandscape();
const GLOBAL_MAX = Math.max(...LANDSCAPE.map(p => p.y));
const GLOBAL_MAX_X = LANDSCAPE.find(p => p.y === GLOBAL_MAX)?.x || 0;

export default function Randomness() {
  const [currentX, setCurrentX] = React.useState(10);
  const [temperature, setTemperature] = React.useState(50);
  const [isRunning, setIsRunning] = React.useState(false);
  const [bestY, setBestY] = React.useState(0);
  const [isAutoCooling, setIsAutoCooling] = React.useState(false);
  const [path, setPath] = React.useState<{ x: number; y: number }[]>([]);

  const tempRef = React.useRef(temperature);
  const autoCoolRef = React.useRef(isAutoCooling);
  
  React.useEffect(() => {
    tempRef.current = temperature;
  }, [temperature]);

  React.useEffect(() => {
    autoCoolRef.current = isAutoCooling;
  }, [isAutoCooling]);

  const step = React.useCallback(() => {
    setCurrentX(prevX => {
      const currentY = LANDSCAPE[prevX].y;
      
      // Pick a neighbor
      const direction = Math.random() > 0.5 ? 1 : -1;
      const nextX = Math.max(0, Math.min(100, prevX + direction));
      const nextY = LANDSCAPE[nextX].y;
      
      const delta = nextY - currentY;
      
      // Acceptance probability
      let accept = false;
      if (delta > 0) {
        accept = true;
      } else {
        const probability = Math.exp(delta / (tempRef.current + 1));
        if (Math.random() < probability) {
          accept = true;
        }
      }
      
      if (accept) {
        setBestY(prevBest => Math.max(prevBest, nextY));
        setPath(prev => [...prev.slice(-20), { x: nextX, y: nextY }]);
        
        // Auto-cooling logic
        if (autoCoolRef.current && tempRef.current > 0.5) {
          setTemperature(prev => Math.max(0, prev * 0.99));
        }
        
        return nextX;
      }
      return prevX;
    });
  }, []);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(step, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning, step]);

  const reset = () => {
    setCurrentX(Math.floor(Math.random() * 100));
    setBestY(0);
    setIsRunning(false);
    setPath([]);
    setTemperature(50);
  };

  const currentY = LANDSCAPE[currentX].y;
  const isGlobalBest = bestY >= GLOBAL_MAX - 0.1;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Randomness</h2>
        <p className="text-lg leading-relaxed italic text-muted-foreground">
          "When you're stuck in a rut, sometimes the most logical thing to do is make a completely random move."
        </p>
        <p className="text-lg leading-relaxed">
          In computer science, <strong>Simulated Annealing</strong> uses randomness to find the best possible solution in a complex "landscape." 
          By allowing yourself to occasionally move "downhill" (making a worse choice), you avoid getting stuck in a local peak and find the global summit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 book-shadow border-none bg-card/50">
          <CardHeader>
            <CardTitle>Hill Climbing vs. Randomness</CardTitle>
            <CardDescription>
              High temperature = more exploration. Low temperature = settling down.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="h-[300px] w-full bg-accent/5 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LANDSCAPE} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="x" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={false}
                  />
                  {/* Path visualization */}
                  {path.map((p, i) => (
                    <ReferenceDot 
                      key={i}
                      x={p.x} 
                      y={p.y} 
                      r={2} 
                      fill="hsl(var(--primary))" 
                      fillOpacity={i / path.length}
                      stroke="none"
                    />
                  ))}
                  <ReferenceDot 
                    x={currentX} 
                    y={currentY} 
                    r={8} 
                    fill="hsl(var(--primary))" 
                    stroke="#fff" 
                    strokeWidth={2} 
                  />
                  <ReferenceDot 
                    x={GLOBAL_MAX_X} 
                    y={GLOBAL_MAX} 
                    r={4} 
                    fill="#22c55e" 
                    stroke="#fff" 
                    strokeWidth={1} 
                    label={{ position: 'top', value: 'Goal', fontSize: 10, fill: '#22c55e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label className="font-bold">Temperature (Randomness)</Label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="auto-cool" 
                        checked={isAutoCooling} 
                        onChange={(e) => setIsAutoCooling(e.target.checked)}
                        className="rounded border-primary text-primary focus:ring-primary"
                      />
                      <label htmlFor="auto-cool" className="text-xs text-muted-foreground cursor-pointer">
                        Auto-Cooling Schedule
                      </label>
                    </div>
                  </div>
                  <Badge variant={temperature > 70 ? "destructive" : temperature < 20 ? "secondary" : "default"}>
                    {temperature.toFixed(0)}°
                  </Badge>
                </div>
                <Slider 
                  value={[temperature]} 
                  onValueChange={(v) => setTemperature(v[0])} 
                  min={0} 
                  max={100} 
                  step={1} 
                  disabled={isAutoCooling && isRunning}
                />
                <p className="text-[10px] text-muted-foreground italic">
                  {isAutoCooling 
                    ? "The temperature will automatically drop as the search progresses (Annealing)." 
                    : "Higher temperature makes the ball more likely to accept 'worse' moves to explore."}
                </p>
              </div>

              <div className="flex gap-4 items-end">
                <Button 
                  className="flex-1 h-12" 
                  onClick={() => setIsRunning(!isRunning)}
                  variant={isRunning ? "outline" : "default"}
                >
                  {isRunning ? "Pause" : "Start Search"}
                  <Zap className={cn("ml-2 h-4 w-4", isRunning && "animate-pulse")} />
                </Button>
                <Button variant="outline" className="h-12" onClick={reset}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="book-shadow border-none bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Search Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs opacity-70 uppercase tracking-widest">Current Height</span>
                <div className="text-4xl font-heading font-bold">{currentY.toFixed(1)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs opacity-70 uppercase tracking-widest">Best Found</span>
                <div className="text-4xl font-heading font-bold text-accent">{bestY.toFixed(1)}</div>
              </div>
              
              <div className="pt-4 border-t border-primary-foreground/20">
                {isGlobalBest ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-bold">Global Maximum Found!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 opacity-70">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm italic">Searching for the peak...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-accent/10 rounded-2xl border border-accent/20">
            <h4 className="font-bold text-primary mb-2">The Miller-Rabin Lesson</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sometimes, a "probabilistic" answer is better than no answer at all. 
              If you can be 99.999% sure of something in a second, why wait a billion years to be 100% sure?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
