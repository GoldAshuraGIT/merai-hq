import AuthGuard from '@/components/AuthGuard';
import Board from '@/components/Board';

export default function HomePage() {
  return (
    <AuthGuard>
      <Board />
    </AuthGuard>
  );
}
