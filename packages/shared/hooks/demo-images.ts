const THEMES = ['space', 'ocean', 'forest', 'castle', 'dinosaur', 'fairy', 'pirate', 'robot', 'animal', 'superhero'] as const;

export function getThemeImages(theme: string, count: number): string[] {
  const t = THEMES.includes(theme as typeof THEMES[number]) ? theme : 'space';
  return Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${t}${i + 1}/1024/1024`
  );
}

export function getCoverImage(theme: string): string {
  const t = THEMES.includes(theme as typeof THEMES[number]) ? theme : 'space';
  return `https://picsum.photos/seed/${t}cover/1024/1024`;
}
