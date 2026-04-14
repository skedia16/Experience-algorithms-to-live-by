import * as React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full border-destructive/50 bg-destructive/5">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-destructive/10 p-3 rounded-full w-fit">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                An unexpected error occurred while rendering this chapter. 
                {this.state.error && (
                  <code className="block mt-2 p-2 bg-muted rounded text-xs text-left overflow-auto max-h-32">
                    {this.state.error.message}
                  </code>
                )}
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={this.handleReset}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
