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
import ErrorBoundary from './components/ErrorBoundary';
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
      case 'relaxation':
        return <Relaxation />;
      case 'randomness':
        return <Randomness />;
      case 'networking':
        return <Networking />;
      case 'game-theory':
        return <GameTheory />;
      default:
        return <Home onStart={() => setCurrentChapter('optimal-stopping')} onChapterSelect={setCurrentChapter} />;
    }
  };

  return (
    <Layout currentChapter={currentChapter} onChapterChange={setCurrentChapter}>
      <ErrorBoundary>
        {renderContent()}
      </ErrorBoundary>
    </Layout>
  );
}
