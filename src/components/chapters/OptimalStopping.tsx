import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Info, Home, User, CheckCircle2, XCircle } from 'lucide-react';

export default function OptimalStopping() {
  const [poolSize, setPoolSize] = React.useState(100);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [applicants, setApplicants] = React.useState<{ id: number; score: number; status: 'unseen' | 'looking' | 'leaping' | 'hired' | 'passed' }[]>([]);
  const [bestInLooking, setBestInLooking] = React.useState(0);
  const [hiredApplicant, setHiredApplicant] = React.useState<number | null>(null);

  const optimalThreshold = Math.round(poolSize * 0.37);

  const generateApplicants = () => {
    const newApplicants = Array.from({ length: poolSize }, (_, i) => ({
      id: i + 1,
      score: Math.floor(Math.random() * 100),
      status: 'unseen' as const
    }));
    setApplicants(newApplicants);
    setCurrentStep(0);
    setBestInLooking(0);
    setHiredApplicant(null);
  };

  React.useEffect(() => {
    generateApplicants();
  }, [poolSize]);

  const nextStep = () => {
    if (currentStep >= poolSize || hiredApplicant !== null) return;

    const newApplicants = [...applicants];
    const current = newApplicants[currentStep];

    if (currentStep < optimalThreshold) {
      current.status = 'looking';
      if (current.score > bestInLooking) {
        setBestInLooking(current.score);
      }
      setCurrentStep(currentStep + 1);
    } else {
      current.status = 'leaping';
      if (current.score > bestInLooking) {
        current.status = 'hired';
        setHiredApplicant(current.id);
      } else {
        current.status = 'passed';
        setCurrentStep(currentStep + 1);
      }
    }
    setApplicants(newApplicants);
  };

  const runSimulation = () => {
    let step = currentStep;
    let best = bestInLooking;
    const newApplicants = [...applicants];
    
    while (step < poolSize) {
      const current = newApplicants[step];
      if (step < optimalThreshold) {
        current.status = 'looking';
        if (current.score > best) best = current.score;
      } else {
        if (current.score > best) {
          current.status = 'hired';
          setHiredApplicant(current.id);
          setApplicants(newApplicants);
          setBestInLooking(best);
          setCurrentStep(step);
          return;
        } else {
          current.status = 'passed';
        }
      }
      step++;
    }
    setApplicants(newApplicants);
    setBestInLooking(best);
    setCurrentStep(step);
  };

  const data = applicants.map(a => ({
    name: a.id,
    score: a.score,
    status: a.status
  }));

  const actualBest = Math.max(...applicants.map(a => a.score));
  const hiredScore = hiredApplicant ? applicants.find(a => a.id === hiredApplicant)?.score : null;
  const isSuccess = hiredScore === actualBest;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Optimal Stopping</h2>
        <p className="text-lg leading-relaxed">
          Imagine you're searching for an apartment in a competitive market. 
          You can't go back to an apartment once you've passed it. 
          How many should you look at before you're ready to commit?
        </p>
        <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <Info className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm italic">
            The <strong>37% Rule</strong>: Spend the first 37% of your search "looking" (calibrating) 
            without committing. After that, "leap" for the first option that beats everything you've seen so far.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 book-shadow border-none bg-card/50">
          <CardHeader>
            <CardTitle>Simulation: Apartment Hunting</CardTitle>
            <CardDescription>
              Pool Size: {poolSize} | Threshold: {optimalThreshold} (37%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm text-xs">
                            <p className="font-bold">Applicant #{data.name}</p>
                            <p>Score: {data.score}</p>
                            <p className="capitalize">Status: {data.status}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine x={optimalThreshold} stroke="hsl(var(--primary))" strokeDasharray="3 3" label={{ position: 'top', value: 'Threshold', fill: 'hsl(var(--primary))', fontSize: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="rgba(0,0,0,0.2)" 
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      let fill = "#d1d1d1";
                      if (payload.status === 'looking') fill = "#fbbf24";
                      if (payload.status === 'leaping') fill = "#94a3b8";
                      if (payload.status === 'passed') fill = "#f87171";
                      if (payload.status === 'hired') fill = "#22c55e";
                      
                      return (
                        <circle key={payload.name} cx={cx} cy={cy} r={payload.status === 'hired' ? 6 : 3} fill={fill} />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={nextStep} disabled={currentStep >= poolSize || hiredApplicant !== null}>
                Next Applicant
              </Button>
              <Button variant="secondary" onClick={runSimulation} disabled={currentStep >= poolSize || hiredApplicant !== null}>
                Run to End
              </Button>
              <Button variant="outline" onClick={generateApplicants}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="book-shadow border-none">
            <CardHeader>
              <CardTitle className="text-lg">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Total Applicants</label>
                  <span className="font-mono">{poolSize}</span>
                </div>
                <Slider 
                  value={[poolSize]} 
                  onValueChange={(v: number[]) => setPoolSize(v[0])} 
                  min={10} 
                  max={200} 
                  step={10} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="book-shadow border-none bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Best in Look Phase:</span>
                <span className="font-bold">{bestInLooking}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Hired Score:</span>
                <span className="font-bold">{hiredScore ?? '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Actual Best:</span>
                <span className="font-bold">{actualBest}</span>
              </div>
              <div className="pt-4 border-t border-primary-foreground/20">
                {hiredApplicant ? (
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                    <span className="font-medium">
                      {isSuccess ? "Found the best!" : "Settled for less."}
                    </span>
                  </div>
                ) : currentStep >= poolSize ? (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span className="font-medium">Ended with nothing.</span>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-primary-foreground border-primary-foreground/50">
                    Simulation in progress...
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
