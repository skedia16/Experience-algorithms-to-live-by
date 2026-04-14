import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Coffee, Zap, AlertCircle, CheckCircle2, Clock, DollarSign, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface Task {
  id: string;
  name: string;
  duration: number;
  value: number;
  color: string;
}

const TASKS: Task[] = [
  { id: '1', name: 'Code Feature', duration: 5, value: 150, color: 'bg-blue-500' },
  { id: '2', name: 'Write Report', duration: 4, value: 100, color: 'bg-purple-500' },
  { id: '3', name: 'Research', duration: 3, value: 60, color: 'bg-amber-500' },
  { id: '4', name: 'Emails', duration: 2, value: 40, color: 'bg-emerald-500' },
  { id: '5', name: 'Meeting', duration: 1, value: 30, color: 'bg-rose-500' },
];

const MAX_TIME = 8;

export default function Relaxation() {
  const [mode, setMode] = React.useState<'strict' | 'relaxed'>('strict');
  const [selectedTasks, setSelectedTasks] = React.useState<{ id: string; fraction: number }[]>([]);

  const solveStrict = React.useCallback(() => {
    // Simple 0/1 Knapsack solver for small N
    let bestValue = 0;
    let bestCombo: string[] = [];

    for (let i = 0; i < (1 << TASKS.length); i++) {
      let currentWeight = 0;
      let currentValue = 0;
      let currentCombo: string[] = [];
      
      for (let j = 0; j < TASKS.length; j++) {
        if ((i >> j) & 1) {
          currentWeight += TASKS[j].duration;
          currentValue += TASKS[j].value;
          currentCombo.push(TASKS[j].id);
        }
      }

      if (currentWeight <= MAX_TIME && currentValue > bestValue) {
        bestValue = currentValue;
        bestCombo = currentCombo;
      }
    }

    setSelectedTasks(bestCombo.map(id => ({ id, fraction: 1 })));
    setMode('strict');
  }, []);

  const solveRelaxed = React.useCallback(() => {
    // Fractional Knapsack (Greedy)
    const sorted = [...TASKS].sort((a, b) => (b.value / b.duration) - (a.value / a.duration));
    let remainingTime = MAX_TIME;
    const result: { id: string; fraction: number }[] = [];

    for (const task of sorted) {
      if (remainingTime <= 0) break;
      if (task.duration <= remainingTime) {
        result.push({ id: task.id, fraction: 1 });
        remainingTime -= task.duration;
      } else {
        result.push({ id: task.id, fraction: remainingTime / task.duration });
        remainingTime = 0;
      }
    }

    setSelectedTasks(result);
    setMode('relaxed');
  }, []);

  React.useEffect(() => {
    if (mode === 'strict') solveStrict();
    else solveRelaxed();
  }, [mode, solveStrict, solveRelaxed]);

  const totalValue = selectedTasks.reduce((acc, st) => {
    const task = TASKS.find(t => t.id === st.id);
    return acc + (task ? task.value * st.fraction : 0);
  }, 0);

  const totalTime = selectedTasks.reduce((acc, st) => {
    const task = TASKS.find(t => t.id === st.id);
    return acc + (task ? task.duration * st.fraction : 0);
  }, 0);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Relaxation</h2>
        <p className="text-lg leading-relaxed italic text-muted-foreground">
          "When the perfect solution is impossible, how do you find one that's 'good enough'?"
        </p>
        <p className="text-lg leading-relaxed">
          In computer science, many problems are <strong>NP-Hard</strong>, meaning they are practically impossible to solve perfectly as they grow. 
          <strong> Relaxation</strong> is the art of "letting it slide"—ignoring some constraints to find a path forward.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 book-shadow border-none bg-card/50">
          <CardHeader>
            <CardTitle>The Knapsack Dilemma</CardTitle>
            <CardDescription>You have 8 hours. Which tasks give you the most value?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Day Visualization */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Your 8-Hour Day
                </Label>
                <Badge variant="outline" className="font-mono">
                  {totalTime.toFixed(1)}h / {MAX_TIME}h
                </Badge>
              </div>
              <div className="h-12 w-full bg-accent/10 rounded-xl overflow-hidden flex border-2 border-accent/20">
                <AnimatePresence>
                  {selectedTasks.map((st) => {
                    const task = TASKS.find(t => t.id === st.id);
                    if (!task) return null;
                    return (
                      <motion.div
                        key={st.id}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${(task.duration * st.fraction / MAX_TIME) * 100}%`, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className={cn(task.color, "h-full border-r border-white/20 relative group")}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-[10px] text-white font-bold truncate px-1">
                          {task.name} ({Math.round(st.fraction * 100)}%)
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TASKS.map((task) => {
                const selection = selectedTasks.find(st => st.id === task.id);
                const isUsed = !!selection;
                const fraction = selection?.fraction || 0;

                return (
                  <div 
                    key={task.id} 
                    className={cn(
                      "p-3 rounded-xl border transition-all flex items-center justify-between",
                      isUsed ? "bg-card border-primary/20 shadow-sm" : "bg-accent/5 border-transparent opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-8 rounded-full", task.color)} />
                      <div>
                        <div className="text-sm font-bold">{task.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {task.duration}h • ${task.value} (${(task.value / task.duration).toFixed(0)}/h)
                        </div>
                      </div>
                    </div>
                    {isUsed && (
                      <Badge variant={fraction === 1 ? "default" : "outline"} className="text-[10px]">
                        {fraction === 1 ? "Full" : `${Math.round(fraction * 100)}%`}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-4 pt-4">
              <Button 
                variant={mode === 'strict' ? 'default' : 'outline'} 
                className="flex-1 h-12"
                onClick={() => setMode('strict')}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Strict (Integer)
              </Button>
              <Button 
                variant={mode === 'relaxed' ? 'default' : 'outline'} 
                className="flex-1 h-12"
                onClick={() => setMode('relaxed')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Relaxed (Continuous)
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="book-shadow border-none bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Total Value
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-5xl font-heading font-bold">${totalValue.toFixed(0)}</div>
              <p className="text-xs opacity-70 leading-relaxed italic">
                {mode === 'strict' 
                  ? "In Strict mode, you must finish every task. This makes the problem 'NP-Hard'—impossible to solve perfectly for large lists."
                  : "In Relaxed mode, you can do partial tasks. This is easy to solve and gives you a 'bound'—the maximum possible value you could ever achieve."}
              </p>
            </CardContent>
          </Card>

          <Card className="book-shadow border-none bg-accent/10">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest opacity-60">The Lesson</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  <strong>Continuous Relaxation</strong>: If you can't decide which big projects to finish, 
                  just do the most valuable parts of each.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  <strong>Lagrangian Relaxation</strong>: If a rule is impossible to follow, 
                  turn it into a "cost" you're willing to pay.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
