import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Share2, Wifi, WifiOff, RefreshCcw, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Networking() {
  const [isTransmitting, setIsTransmitting] = React.useState(false);
  const [collision, setCollision] = React.useState(false);
  const [backoff, setBackoff] = React.useState(0);

  React.useEffect(() => {
    if (backoff > 0) {
      const timer = setTimeout(() => {
        setBackoff(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [backoff]);

  const transmit = async () => {
    if (isTransmitting) return;
    
    setIsTransmitting(true);
    setCollision(false);
    
    // Simulate a 30% chance of collision
    const hasCollision = Math.random() < 0.4;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (hasCollision) {
      setCollision(true);
      setIsTransmitting(false);
      // Exponential Backoff simulation
      const nextBackoff = backoff === 0 ? 1 : backoff * 2;
      setBackoff(nextBackoff);
      
      // Hide collision icon after 1.5 seconds
      setTimeout(() => setCollision(false), 1500);
    } else {
      setIsTransmitting(false);
      setBackoff(0);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Networking</h2>
        <p className="text-lg leading-relaxed italic text-muted-foreground">
          "How do we connect and communicate when everyone is talking at once?"
        </p>
        <p className="text-lg leading-relaxed">
          The internet is built on <strong>Protocols</strong>—rules for how to handle silence, noise, and collisions. 
          When two people (or computers) talk at the same time, they use <strong>Exponential Backoff</strong> to decide when to try again.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 book-shadow border-none bg-card/50">
          <CardHeader>
            <CardTitle>Exponential Backoff Simulator</CardTitle>
            <CardDescription>Try to send a message. If it 'collides', wait and try again.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="relative h-48 bg-accent/5 rounded-2xl border-2 border-dashed border-accent/20 flex items-center justify-center">
              <div className="flex items-center gap-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Wifi className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase">You</span>
                </div>

                <div className="relative flex-1 w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <AnimatePresence>
                    {isTransmitting && (
                      <motion.div
                        initial={{ left: "-10%" }}
                        animate={{ left: "110%" }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="absolute top-0 h-full w-8 bg-primary blur-sm"
                      />
                    )}
                  </AnimatePresence>
                  {collision && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="p-2 rounded-full bg-red-500 text-white">
                        <Activity className="h-6 w-6" />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Share2 className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase">Server</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {backoff > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  Collision! Backing off for {backoff}s...
                </Badge>
              )}
              <Button 
                size="lg" 
                className="w-full max-w-xs h-14 text-lg rounded-full"
                onClick={transmit}
                disabled={isTransmitting || backoff > 0}
              >
                {isTransmitting ? "Transmitting..." : backoff > 0 ? `Waiting (${backoff}s)` : "Send Message"}
                <RefreshCcw className={cn("ml-2 h-5 w-5", isTransmitting && "animate-spin")} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="book-shadow border-none bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Protocol Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  <WifiOff className="h-4 w-4 text-accent" />
                  Packet Loss
                </h4>
                <p className="text-xs opacity-80 leading-relaxed">
                  In conversation, we say "What?" or "Excuse me?". In TCP, the server just stays silent 
                  until the sender realizes the message was lost.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent" />
                  Additive Increase
                </h4>
                <p className="text-xs opacity-80 leading-relaxed">
                  Start slow, then speed up. If everything is working, talk faster. 
                  If a collision happens, cut your speed in half immediately.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-accent/10 rounded-2xl border border-accent/20">
            <h4 className="font-bold text-primary mb-2">The Social Protocol</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              "Forgiveness is better than permission." Many networking protocols assume 
              everyone is trying their best, rather than trying to cheat the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
