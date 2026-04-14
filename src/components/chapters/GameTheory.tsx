import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Users, Shield, ShieldAlert, TrendingDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function GameTheory() {
  const [playerChoice, setPlayerChoice] = React.useState<'cooperate' | 'defect' | null>(null);
  const [opponentChoice, setOpponentChoice] = React.useState<'cooperate' | 'defect' | null>(null);
  const [result, setResult] = React.useState<{ player: number, opponent: number } | null>(null);

  const play = (choice: 'cooperate' | 'defect') => {
    setPlayerChoice(choice);
    // Opponent strategy: Always defect (Dominant strategy)
    const opp = 'defect' as 'cooperate' | 'defect';
    setOpponentChoice(opp);

    let pScore = 0;
    let oScore = 0;

    if (choice === 'cooperate' && opp === 'cooperate') {
      pScore = 1; oScore = 1; // Both walk free
    } else if (choice === 'cooperate' && opp === 'defect') {
      pScore = 10; oScore = 0; // Player gets 10 years, Opponent goes free
    } else if (choice === 'defect' && opp === 'cooperate') {
      pScore = 0; oScore = 10; // Player goes free, Opponent gets 10 years
    } else {
      pScore = 5; oScore = 5; // Both get 5 years
    }

    setResult({ player: pScore, opponent: oScore });
  };

  const reset = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-primary">Game Theory</h2>
        <p className="text-lg leading-relaxed">
          Understanding the <strong>Minds of Others</strong>. 
          In many situations, the best choice for you depends on what others choose.
        </p>
      </div>

      <Card className="book-shadow border-none bg-card/50 overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/10">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl">The Prisoner's Dilemma</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                You and an accomplice are arrested. Do you stay silent (Cooperate) or betray them (Defect)?
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {!playerChoice ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button 
                variant="outline" 
                className="h-32 text-xl font-heading flex flex-col gap-2 rounded-2xl border-2 hover:bg-green-50 hover:border-green-200"
                onClick={() => play('cooperate')}
              >
                <Shield className="h-8 w-8 text-green-600" />
                Cooperate
                <span className="text-xs font-sans text-muted-foreground">Stay Silent</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-32 text-xl font-heading flex flex-col gap-2 rounded-2xl border-2 hover:bg-red-50 hover:border-red-200"
                onClick={() => play('defect')}
              >
                <ShieldAlert className="h-8 w-8 text-red-600" />
                Defect
                <span className="text-xs font-sans text-muted-foreground">Betray Partner</span>
              </Button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center space-y-4">
                  <div className="text-sm uppercase tracking-widest font-bold text-muted-foreground">Your Choice</div>
                  <div className={cn(
                    "p-6 rounded-2xl border-2 font-heading text-2xl",
                    playerChoice === 'cooperate' ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
                  )}>
                    {playerChoice === 'cooperate' ? "Cooperated" : "Defected"}
                  </div>
                  <div className="text-4xl font-bold">{result?.player} <span className="text-lg font-normal text-muted-foreground">years</span></div>
                </div>
                <div className="text-center space-y-4">
                  <div className="text-sm uppercase tracking-widest font-bold text-muted-foreground">Partner's Choice</div>
                  <div className="p-6 rounded-2xl border-2 bg-red-50 border-red-200 text-red-700 font-heading text-2xl">
                    Defected
                  </div>
                  <div className="text-4xl font-bold">{result?.opponent} <span className="text-lg font-normal text-muted-foreground">years</span></div>
                </div>
              </div>

              <div className="p-6 bg-accent/10 rounded-2xl border border-accent/20 space-y-4">
                <h4 className="font-bold text-primary flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  The Paradox
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  No matter what your partner does, it is <strong>always better for you to defect</strong>. 
                  If they cooperate, you go free (0 vs 1 year). If they defect, you get 5 years instead of 10. 
                  But if you both follow this "rational" logic, you both get 5 years, whereas you could have 
                  both gotten only 1 year if you cooperated.
                </p>
                <Button onClick={reset} variant="secondary" className="w-full">Try Again</Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="book-shadow border-none bg-orange-50 border-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-900">Tragedy of the Commons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-orange-800 leading-relaxed">
            <p>
              When everyone uses a public resource (like a lawn or the climate) just a little bit more 
              than they should, the resource is destroyed for everyone.
            </p>
            <div className="flex items-center gap-2 font-bold">
              <TrendingDown className="h-4 w-4" />
              <span>The Nash Equilibrium is a race to the bottom.</span>
            </div>
          </CardContent>
        </Card>

        <Card className="book-shadow border-none bg-blue-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Mechanism Design</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-blue-800 leading-relaxed">
            <p>
              "Don't hate the player, hate the game." If the rules force a bad strategy, 
              change the rules. 
            </p>
            <p>
              <strong>The Godfather Effect</strong>: By making betrayal extremely costly (death), 
              the Don forces cooperation, making both thieves better off.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
