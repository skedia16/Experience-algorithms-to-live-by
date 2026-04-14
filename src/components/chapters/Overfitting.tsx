import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Overfitting() {
  const [complexity, setComplexity] = React.useState(1);
  
  // Generate some noisy data
  const data = [
    { x: 1, y: 10 }, { x: 2, y: 15 }, { x: 3, y: 12 }, { x: 4, y: 18 },
    { x: 5, y: 25 }, { x: 6, y: 22 }, { x: 7, y: 30 }, { x: 8, y: 28 },
    { x: 9, y: 35 }, { x: 10, y: 40 }
  ];

  // Simple linear fit
  const linearFit = data.map(d => ({ x: d.x, y: 3 * d.x + 7 }));

  // Overfitted "wiggly" line
  const overfitFit = data.map((d, i) => ({
    x: d.x,
    y: complexity === 1 ? (3 * d.x + 7) : (d.y + (Math.sin(i * complexity) * 5))
  }));

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Overfitting</h2>
        <p className="text-lg leading-relaxed">
          The <strong>Case Against Complexity</strong>: Including more factors in a model 
          will always make it a better fit for the data you have, but it can make your 
          predictions for the future much worse.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 book-shadow border-none bg-card/50">
          <CardHeader>
            <CardTitle>The Bias-Variance Tradeoff</CardTitle>
            <CardDescription>Adjust complexity to see how the model "overfits" the noise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis type="number" dataKey="x" domain={[0, 11]} hide />
                  <YAxis type="number" domain={[0, 50]} hide />
                  <Tooltip />
                  <Line 
                    data={overfitFit} 
                    type="monotone" 
                    dataKey="y" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={false} 
                    animationDuration={500}
                  />
                  <Scatter name="Data Points" data={data} fill="hsl(var(--primary))" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="font-bold">Model Complexity</Label>
                <Badge variant={complexity > 5 ? "destructive" : "secondary"}>
                  {complexity === 1 ? "Simple (Linear)" : complexity > 5 ? "Overfitted" : "Balanced"}
                </Badge>
              </div>
              <Slider 
                value={[complexity]} 
                onValueChange={(v: number[]) => setComplexity(v[0])} 
                min={1} 
                max={10} 
                step={1} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="book-shadow border-none bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Key Concepts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  Regularization
                </h4>
                <p className="text-xs opacity-80 leading-relaxed">
                  Introducing a "complexity penalty" to your calculations. 
                  It forces the model to justify its complexity.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Cross-Validation
                </h4>
                <p className="text-xs opacity-80 leading-relaxed">
                  Testing your model on data it hasn't seen before. 
                  If it fails the test, it's overfitted.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  Early Stopping
                </h4>
                <p className="text-xs opacity-80 leading-relaxed">
                  Stopping the learning process before the model starts 
                  memorizing the noise in the data.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="book-shadow border-none italic bg-accent/10">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                "If you can't explain it simply, you don't understand it well enough."
              </p>
              <footer className="text-xs font-bold mt-2 uppercase tracking-widest opacity-60">— Anonymous</footer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
