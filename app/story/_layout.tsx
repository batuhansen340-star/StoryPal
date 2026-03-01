import { Stack } from 'expo-router';
import { COLORS } from '../../packages/shared/types';

export default function StoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
