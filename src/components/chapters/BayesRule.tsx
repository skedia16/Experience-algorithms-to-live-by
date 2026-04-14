import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, Calculator, TrendingUp, History } from 'lucide-react';

export default function BayesRule() {
  const [wins, setWins] = React.useState(1);
  const [attempts, setAttempts] = React.useState(1);
  const [age, setAge] = React.useState(10);

  const laplaceEstimate = (wins + 1) / (attempts + 2);
  const copernicanEstimate = age * 2;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Bayes's Rule</h2>
        <p className="text-lg leading-relaxed">
          How do we predict the future from a single data point? 
          <strong> Bayes's Rule</strong> allows us to combine our prior beliefs with new evidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="book-shadow border-none bg-card/50">
          <CardHeader>
            <div className="p-2 w-fit rounded-lg bg-blue-100 mb-2">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle>Laplace's Law</CardTitle>
            <CardDescription>Predicting success rates from small data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you win a raffle on your first try, are the odds 100%? 
              Laplace says: add 1 to wins, and 2 to attempts.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wins">Wins</Label>
                <Input 
                  id="wins" 
                  type="number" 
                  value={wins} 
                  onChange={(e) => setWins(Math.max(0, parseInt(e.target.value) || 0))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attempts">Attempts</Label>
                <Input 
                  id="attempts" 
                  type="number" 
                  value={attempts} 
                  onChange={(e) => setAttempts(Math.max(wins, parseInt(e.target.value) || 0))} 
                />
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-xl text-center space-y-2">
              <div className="text-xs text-blue-600 uppercase font-bold tracking-widest">Estimated Probability</div>
              <div className="text-5xl font-heading font-bold text-blue-900">
                {(laplaceEstimate * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-blue-700 italic">
                Formula: (w + 1) / (n + 2)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="book-shadow border-none bg-card/50">
          <CardHeader>
            <div className="p-2 w-fit rounded-lg bg-orange-100 mb-2">
              <History className="h-5 w-5 text-orange-600" />
            </div>
            <CardTitle>The Copernican Principle</CardTitle>
            <CardDescription>Predicting longevity from current age</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you encounter something that has lasted for 10 years, 
              how much longer will it last? Without other info, assume you're at the halfway point.
            </p>

            <div className="space-y-2">
              <Label htmlFor="age">Current Age (years)</Label>
              <Input 
                id="age" 
                type="number" 
                value={age} 
                onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))} 
              />
            </div>

            <div className="p-6 bg-orange-50 rounded-xl text-center space-y-2">
              <div className="text-xs text-orange-600 uppercase font-bold tracking-widest">Predicted Total Lifespan</div>
              <div className="text-5xl font-heading font-bold text-orange-900">
                {copernicanEstimate} <span className="text-xl">years</span>
              </div>
              <p className="text-xs text-orange-700 italic">
                Prediction: It will last another {age} years.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="book-shadow border-none bg-primary text-primary-foreground">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-heading font-bold">Protect Your Priors</h3>
              <p className="opacity-80 leading-relaxed">
                "Small data is big data in disguise." We carry rich priors about the world. 
                But be careful: the news and social media can skew your priors by showing you 
                rare events (plane crashes, lottery wins) as if they were common.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                <span>Being a good Bayesian means representing the world in correct proportions.</span>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-white/10 rounded-2xl flex items-center justify-center p-8">
              <div className="relative w-full h-full">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-accent rounded-full blur-3xl opacity-20" 
                />
                <div className="relative z-10 w-full h-full border-4 border-white/20 rounded-full flex items-center justify-center">
                  <Brain className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Brain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54Z" />
    </svg>
  )
}
