import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ArrowRight, Brain, Zap, Clock, Users, ListOrdered, Calendar, Calculator, AlertTriangle, Coffee, Share2, Dice5 } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
  onChapterSelect: (id: string) => void;
}

export default function Home({ onStart, onChapterSelect }: HomeProps) {
  const features = [
    {
      id: "optimal-stopping",
      icon: Clock,
      title: "Optimal Stopping",
      description: "When should you stop looking for an apartment or a partner? The 37% rule has the answer."
    },
    {
      id: "explore-exploit",
      icon: Zap,
      title: "Explore vs Exploit",
      description: "Should you go to your favorite restaurant or try the new one? Balance novelty and tradition."
    },
    {
      id: "sorting",
      icon: ListOrdered,
      title: "Sorting",
      description: "Making order has a cost. Learn the search-sort tradeoff and the agony of O(n²)."
    },
    {
      id: "caching",
      icon: Brain,
      title: "Memory & Caching",
      description: "How to organize your closet and your mind using the principles of computer memory."
    },
    {
      id: "scheduling",
      icon: Calendar,
      title: "Scheduling",
      description: "How to decide what to do first. Minimize wait time or maximize your reputation."
    },
    {
      id: "bayes-rule",
      icon: Calculator,
      title: "Bayes's Rule",
      description: "Predicting the future from small data. How to be a good Bayesian in a noisy world."
    },
    {
      id: "overfitting",
      icon: AlertTriangle,
      title: "Overfitting",
      description: "When to think less. Why simple models often outperform complex ones in the real world."
    },
    {
      id: "relaxation",
      icon: Coffee,
      title: "Relaxation",
      description: "Let it slide. When the perfect solution is impossible, look for a 'good enough' one."
    },
    {
      id: "randomness",
      icon: Dice5,
      title: "Randomness",
      description: "When to leave it to chance. Using the power of the dice to solve impossible problems."
    },
    {
      id: "networking",
      icon: Share2,
      title: "Networking",
      description: "How we connect. The protocols that keep the internet—and our conversations—running."
    },
    {
      id: "game-theory",
      icon: Users,
      title: "Game Theory",
      description: "Understanding the minds of others and the complex dynamics of social cooperation."
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block p-3 rounded-2xl bg-accent/20 mb-4"
        >
          <BookOpen className="h-12 w-12 text-primary" />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-primary">
            Algorithms to Live By
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-serif italic max-w-2xl mx-auto">
            The Computer Science of Human Decisions
          </p>
        </div>

        <p className="text-lg max-w-3xl mx-auto leading-relaxed">
          Explore the fascinating intersection of computer science and daily life. 
          Based on the bestseller by Brian Christian and Tom Griffiths, this interactive guide 
          visualizes the algorithms that can help us solve common human dilemmas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" className="text-lg px-8 py-6 h-auto rounded-full" onClick={onStart}>
            Begin the Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card 
              className="h-full border-none bg-card/50 backdrop-blur-sm book-shadow hover:translate-y-[-4px] transition-transform cursor-pointer hover:bg-card/80"
              onClick={() => onChapterSelect(feature.id)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="p-3 rounded-xl bg-primary/10 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Quote Section */}
      <section className="py-12 border-y border-primary/10">
        <blockquote className="text-center space-y-6">
          <p className="text-2xl md:text-3xl font-heading italic text-primary leading-snug max-w-4xl mx-auto">
            "Science is a way of thinking much more than it is a body of knowledge."
          </p>
          <footer className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
            — Carl Sagan
          </footer>
        </blockquote>
      </section>
    </div>
  );
}
