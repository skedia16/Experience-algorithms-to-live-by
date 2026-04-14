import React from 'react';
import { motion, Reorder } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Clock, Calendar, ListChecks, ArrowRight, AlertTriangle } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  duration: number;
  dueIn: number;
}

export default function Scheduling() {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: '1', name: 'Email Client', duration: 1, dueIn: 5 },
    { id: '2', name: 'Write Report', duration: 4, dueIn: 10 },
    { id: '3', name: 'Fix Bug', duration: 2, dueIn: 3 },
    { id: '4', name: 'Plan Meeting', duration: 1, dueIn: 8 },
  ]);

  const sortBySPT = () => {
    const sorted = [...tasks].sort((a, b) => a.duration - b.duration);
    setTasks(sorted);
  };

  const sortByEDD = () => {
    const sorted = [...tasks].sort((a, b) => a.dueIn - b.dueIn);
    setTasks(sorted);
  };

  const calculateStats = () => {
    let currentTime = 0;
    let totalWaitTime = 0;
    let maxLateness = 0;

    tasks.forEach(task => {
      currentTime += task.duration;
      totalWaitTime += currentTime;
      const lateness = Math.max(0, currentTime - task.dueIn);
      if (lateness > maxLateness) maxLateness = lateness;
    });

    return { avgWait: totalWaitTime / tasks.length, maxLateness };
  };

  const { avgWait, maxLateness } = calculateStats();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Scheduling</h2>
        <p className="text-lg leading-relaxed">
          How do you decide what to do first? 
          The best strategy depends on your goal.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-blue-900">Shortest Processing Time (SPT)</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                Always do the quickest task first. This minimizes your average wait time and 
                shortens your to-do list as fast as possible.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <Calendar className="h-5 w-5 text-orange-600 shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-orange-900">Earliest Due Date (EDD)</p>
              <p className="text-xs text-orange-800 leading-relaxed">
                Do the task due soonest. This minimizes your "maximum lateness"—the 
                single most overdue item on your list.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 book-shadow border-none bg-card/50">
          <CardHeader>
            <CardTitle>Interactive Task List</CardTitle>
            <CardDescription>Drag to reorder tasks and see how metrics change</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-2">
              {tasks.map((task) => (
                <Reorder.Item 
                  key={task.id} 
                  value={task}
                  className="p-4 bg-card border rounded-xl flex items-center justify-between cursor-grab active:cursor-grabbing book-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-secondary">
                      <ListChecks className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold">{task.name}</div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.duration}h</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due in {task.dueIn}h</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Priority {task.id}</Badge>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={sortBySPT}>
                Sort by Duration (SPT)
              </Button>
              <Button variant="outline" className="flex-1" onClick={sortByEDD}>
                Sort by Due Date (EDD)
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="book-shadow border-none bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Scheduling Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs opacity-70 uppercase font-bold tracking-wider">Avg. Time on List</div>
                <div className="text-4xl font-heading font-bold">{avgWait.toFixed(1)}h</div>
                <p className="text-xs opacity-60 italic">Lower is better for your peace of mind.</p>
              </div>
              <div className="space-y-2">
                <div className="text-xs opacity-70 uppercase font-bold tracking-wider">Max Lateness</div>
                <div className="text-4xl font-heading font-bold">{maxLateness}h</div>
                <p className="text-xs opacity-60 italic">Lower is better for your reputation.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="book-shadow border-none bg-amber-50 border-amber-100">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-bold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                The Danger Zone
              </h4>
              <div className="space-y-3 text-sm text-amber-800">
                <p>
                  <strong>Context Switching</strong>: Every time you switch tasks, you pay a "tax" in time and focus.
                </p>
                <p>
                  <strong>Thrashing</strong>: When you spend more time deciding what to do than actually doing it.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
