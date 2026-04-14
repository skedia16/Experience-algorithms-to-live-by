import React from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import OptimalStopping from './components/chapters/OptimalStopping';
import ExploreExploit from './components/chapters/ExploreExploit';
import Sorting from './components/chapters/Sorting';
import Caching from './components/chapters/Caching';
import Scheduling from './components/chapters/Scheduling';
import BayesRule from './components/chapters/BayesRule';
import Overfitting from './components/chapters/Overfitting';
import GameTheory from './components/chapters/GameTheory';
import Relaxation from './components/chapters/Relaxation';
import Networking from './components/chapters/Networking';
import Randomness from './components/chapters/Randomness';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function App() {
  const [currentChapter, setCurrentChapter] = React.useState('home');

  const renderContent = () => {
    switch (currentChapter) {
      case 'home':
        return <Home onStart={() => setCurrentChapter('optimal-stopping')} onChapterSelect={setCurrentChapter} />;
      case 'optimal-stopping':
        return <OptimalStopping />;
      case 'explore-exploit':
        return <ExploreExploit />;
      case 'sorting':
        return <Sorting />;
      case 'caching':
        return <Caching />;
      case 'scheduling':
        return <Scheduling />;
      case 'bayes-rule':
        return <BayesRule />;
      case 'overfitting':
        return <Overfitting />;
      case 'game-theory':
        return <GameTheory />;
      case 'relaxation':
        return <Relaxation />;
      case 'networking':
        return <Networking />;
      case 'randomness':
        return <Randomness />;
      default:
        return (
          <Card className="book-shadow border-none bg-card/50 py-12">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <Construction className="h-12 w-12 text-muted-foreground" />
              <CardTitle>Chapter Under Construction</CardTitle>
              <p className="text-muted-foreground">This visual module is coming soon!</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Layout currentChapter={currentChapter} onChapterChange={setCurrentChapter}>
      {renderContent()}
    </Layout>
  );
}
