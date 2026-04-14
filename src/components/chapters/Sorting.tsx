import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Play, RotateCcw, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function Sorting() {
  const [array, setArray] = React.useState<number[]>([]);
  const [sorting, setSorting] = React.useState(false);
  const [comparing, setComparing] = React.useState<[number, number] | null>(null);
  const [swapping, setSwapping] = React.useState<[number, number] | null>(null);
  const [sortedIndices, setSortedIndices] = React.useState<number[]>([]);
  const [comparisons, setComparisons] = React.useState(0);

  const resetArray = React.useCallback(() => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setSorting(false);
    setComparing(null);
    setSwapping(null);
    setSortedIndices([]);
    setComparisons(0);
  }, []);

  React.useEffect(() => {
    resetArray();
  }, [resetArray]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    setSorting(true);
    let arr = [...array];
    let n = arr.length;
    let comps = 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        comps++;
        setComparisons(comps);
        await sleep(50);

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          await sleep(50);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          setSwapping(null);
        }
      }
      setSortedIndices(prev => [...prev, n - i - 1]);
    }
    setComparing(null);
    setSorting(false);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Sorting</h2>
        <p className="text-lg leading-relaxed italic text-muted-foreground">
          "Should you spend hours alphabetizing your bookshelf, or just pile the books as they come?"
        </p>
        <p className="text-lg leading-relaxed">
          Sorting is the act of making order, but order has a cost. 
          The <strong>search-sort tradeoff</strong> tells us that sorting is only worth it 
          if you plan to search for things many times. If you're only looking for a book once, 
          alphabetizing the whole shelf is a waste of time.
        </p>
        <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <Info className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm italic">
            <strong>Big-O Notation</strong>: This is just a way to measure how much harder a task gets as it grows. 
            For example, sorting 100 books isn't twice as hard as sorting 50—it's actually <strong>four times</strong> as hard! 
            As your collection grows, the "agony" of sorting grows even faster.
          </p>
        </div>
      </div>

      <Card className="book-shadow border-none bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Visualizing Bubble Sort</CardTitle>
            <CardDescription>O(n²) Complexity - Simple but inefficient</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase font-bold">Comparisons</div>
              <div className="text-xl font-mono">{comparisons}</div>
            </div>
            <Button size="icon" variant="outline" onClick={resetArray} disabled={sorting}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button onClick={bubbleSort} disabled={sorting}>
              <Play className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-1 px-4 border-b border-muted pb-2">
            {array.map((value, idx) => {
              const isComparing = comparing?.includes(idx);
              const isSwapping = swapping?.includes(idx);
              const isSorted = sortedIndices.includes(idx);

              return (
                <motion.div
                  key={idx}
                  layout
                  className={cn(
                    "w-full rounded-t-sm transition-colors",
                    isSwapping ? "bg-red-500" : 
                    isComparing ? "bg-yellow-400" : 
                    isSorted ? "bg-green-500" : "bg-primary/40"
                  )}
                  style={{ height: `${value}%` }}
                />
              );
            })}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">The Agony of Sorting</h4>
              <p className="text-sm leading-relaxed">
                As a list grows, the cost of sorting it increases quadratically. 
                Sorting 100 books takes 4x longer than sorting 50 books, not 2x.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Search vs. Sort</h4>
              <p className="text-sm leading-relaxed">
                "Err on the side of messiness." If you're only looking for a book once, 
                don't spend hours alphabetizing your shelf.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Race vs. Fight</h4>
              <p className="text-sm leading-relaxed">
                A marathon (cardinal sort) is O(n), while a boxing tournament (ordinal sort) 
                is O(n log n). Measuring is faster than comparing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
