import { HomeForm } from '@/components/home-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3x3 } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-4 mb-2">
              <Grid3x3 className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-headline font-bold">
                Tic Tac Toe
              </h1>
            </div>
            <CardDescription>
              Create a room and share the code, or join a friend's game.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HomeForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
