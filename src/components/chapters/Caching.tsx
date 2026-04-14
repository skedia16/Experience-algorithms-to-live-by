import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Database, HardDrive, Cpu, Search, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function Caching() {
  const [cache, setCache] = React.useState<string[]>([]);
  const [mainMemory, setMainMemory] = React.useState<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
  const [cacheSize] = React.useState(4);
  const [hits, setHits] = React.useState(0);
  const [misses, setMisses] = React.useState(0);
  const [lastAction, setLastAction] = React.useState<{ type: 'hit' | 'miss', item: string } | null>(null);

  const accessItem = (item: string) => {
    const itemIndex = cache.indexOf(item);
    
    if (itemIndex !== -1) {
      // HIT: Move to front (LRU)
      const newCache = [item, ...cache.filter(i => i !== item)];
      setCache(newCache);
      setHits(hits + 1);
      setLastAction({ type: 'hit', item });
    } else {
      // MISS: Add to front, evict last if full
      const newCache = [item, ...cache.slice(0, cacheSize - 1)];
      setCache(newCache);
      setMisses(misses + 1);
      setLastAction({ type: 'miss', item });
    }
  };

  const reset = () => {
    setCache([]);
    setHits(0);
    setMisses(0);
    setLastAction(null);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Caching</h2>
        <p className="text-lg leading-relaxed italic text-muted-foreground">
          "Where did I put my keys? Why is my favorite sweater always at the top of the pile?"
        </p>
        <p className="text-lg leading-relaxed">
          Caching is the art of keeping what you need close at hand. 
          The <strong>Memory Hierarchy</strong> balances speed and size: small and fast (like your desk) 
          vs. large and slow (like the library stacks).
        </p>
        <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <Info className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm italic">
            <strong>LRU (Least Recently Used)</strong>: This is the most effective strategy for deciding what to keep. 
            Keep the items you used recently; discard the ones you haven't touched in a while. 
            It's why a "pile" of papers on a desk is actually a very efficient filing system!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="book-shadow border-none bg-card/50">
            <CardHeader>
              <CardTitle>Interactive Cache Simulation</CardTitle>
              <CardDescription>Click items in Main Memory to access them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  L1 Cache (Size: {cacheSize})
                </h4>
                <div className="flex gap-2 h-20">
                  <AnimatePresence mode="popLayout">
                    {cache.map((item, idx) => (
                      <motion.div
                        key={item}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={cn(
                          "w-16 h-16 flex items-center justify-center rounded-xl font-bold text-xl book-shadow border-2",
                          idx === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card border-muted"
                        )}
                      >
                        {item}
                      </motion.div>
                    ))}
                    {Array.from({ length: cacheSize - cache.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-16 h-16 border-2 border-dashed border-muted rounded-xl flex items-center justify-center text-muted-foreground italic text-xs">
                        Empty
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Main Memory
                </h4>
                <div className="flex flex-wrap gap-2">
                  {mainMemory.map((item) => (
                    <Button
                      key={item}
                      variant="outline"
                      className="w-12 h-12 rounded-lg font-bold"
                      onClick={() => accessItem(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-green-600 uppercase font-bold">Hits</div>
                <div className="text-3xl font-bold text-green-700">{hits}</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-red-600 uppercase font-bold">Misses</div>
                <div className="text-3xl font-bold text-red-700">{misses}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="book-shadow border-none bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Last Action</CardTitle>
            </CardHeader>
            <CardContent>
              {lastAction ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      lastAction.type === 'hit' ? "bg-green-500" : "bg-red-500"
                    )}>
                      <Search className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold">Item {lastAction.item}</div>
                      <div className="text-sm opacity-80">
                        {lastAction.type === 'hit' ? "Cache Hit! Found in L1." : "Cache Miss. Fetched from Disk."}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed opacity-70 italic">
                    {lastAction.type === 'hit' 
                      ? "Because you used this recently, it was already in the cache. This saved time!"
                      : "This item wasn't in the cache. It was added to the front, potentially evicting the oldest item."}
                  </p>
                </div>
              ) : (
                <p className="text-sm opacity-60 italic text-center py-8">No actions yet.</p>
              )}
              <Button variant="outline" className="w-full mt-6 bg-transparent border-white/20 hover:bg-white/10" onClick={reset}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
            </CardContent>
          </Card>

          <Card className="book-shadow border-none">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-bold">Real World Caching</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>The Library</strong>: Your desk is the cache, the stacks are the main memory.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>The Closet</strong>: Your most-worn clothes should be in the front (LRU).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>The Pile</strong>: A pile of papers on your desk is a self-organizing cache.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
