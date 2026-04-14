import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Menu, X, ChevronRight, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentChapter: string;
  onChapterChange: (chapter: string) => void;
}

export const chapters = [
  { id: 'home', title: 'Introduction', icon: HomeIcon },
  { id: 'optimal-stopping', title: '1. Optimal Stopping', subtitle: 'When to Stop Looking' },
  { id: 'explore-exploit', title: '2. Explore/Exploit', subtitle: 'The Latest vs. The Greatest' },
  { id: 'sorting', title: '3. Sorting', subtitle: 'Making Order' },
  { id: 'caching', title: '4. Caching', subtitle: 'Forget About It' },
  { id: 'scheduling', title: '5. Scheduling', subtitle: 'First Things First' },
  { id: 'bayes-rule', title: "6. Bayes's Rule", subtitle: 'Predicting the Future' },
  { id: 'overfitting', title: '7. Overfitting', subtitle: 'When to Think Less' },
  { id: 'relaxation', title: '8. Relaxation', subtitle: 'Let It Slide' },
  { id: 'randomness', title: '9. Randomness', subtitle: 'When to Leave It to Chance' },
  { id: 'networking', title: '10. Networking', subtitle: 'How We Connect' },
  { id: 'game-theory', title: '11. Game Theory', subtitle: 'The Minds of Others' },
];

export default function Layout({ children, currentChapter, onChapterChange }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col paper-texture">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onChapterChange('home')}>
            <Book className="h-6 w-6 text-primary" />
            <span className="text-xl font-heading font-bold tracking-tight">AlgoLife</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" onClick={() => setIsSidebarOpen(true)} aria-label="Open chapters menu">
              <Menu className="h-5 w-5 mr-2" />
              Chapters
            </Button>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle mobile menu">
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / Navigation Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r shadow-xl md:relative md:translate-x-0 md:shadow-none"
              >
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-lg font-heading font-bold">Contents</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-1">
                      {chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          onClick={() => {
                            onChapterChange(chapter.id);
                            setIsSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group",
                            currentChapter === chapter.id 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-secondary"
                          )}
                        >
                          <div>
                            <div className="font-medium text-sm">{chapter.title}</div>
                            {chapter.subtitle && (
                              <div className={cn(
                                "text-xs italic",
                                currentChapter === chapter.id ? "text-primary-foreground/80" : "text-muted-foreground"
                              )}>
                                {chapter.subtitle}
                              </div>
                            )}
                          </div>
                          <ChevronRight className={cn(
                            "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity",
                            currentChapter === chapter.id ? "text-primary-foreground" : "text-muted-foreground"
                          )} />
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-5xl mx-auto py-12 px-4 md:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
