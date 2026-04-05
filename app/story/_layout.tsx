import { Stack } from 'expo-router';
import { COLORS } from '../../packages/shared/types';
import { ErrorBoundary } from '../../packages/shared/components/ErrorBoundary';

export default function StoryLayout() {
  return (
    <ErrorBoundary>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      />
    </ErrorBoundary>
  );
}
