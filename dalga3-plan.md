# Dalga 3 — Implementation Plan

## Mevcut Durum
- Wave 1: MVP (onboarding, auth, library, create, viewer)
- Wave 2: Backend (Supabase Auth, OpenAI, ElevenLabs TTS, usage limiter)
- Toplam: ~3700 satır, 17 ana dosya

---

## 3C — Çocuk Profil Sistemi

### Yeni Dosyalar
| Dosya | Tahmini Satır | Açıklama |
|-------|--------------|----------|
| `packages/shared/services/child-profiles.ts` | ~120 | CRUD: create, get, update, delete (Supabase + AsyncStorage) |
| `app/story/select-profile.tsx` | ~200 | Çocuk seçim ekranı (profil listesi + yeni ekle modal) |
| `supabase/migrations/003-child-profiles.sql` | ~15 | Tablo + RLS policy |

### Güncellenen Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `app/story/select-theme.tsx` | Çocuk profili param'ı al, yaş grubunu otomatik belirle |
| `packages/shared/services/story-storage.ts` | saveStory'ye child_profile_id ekle |
| `packages/shared/index.ts` | Yeni export'lar |

### Bağımlılıklar
- Yeni npm paketi yok
- Supabase: child_profiles tablosu

### Supabase SQL
```sql
CREATE TABLE IF NOT EXISTS child_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 12),
  avatar_id TEXT DEFAULT 'child1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own children" ON child_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
ALTER TABLE stories ADD COLUMN IF NOT EXISTS child_profile_id UUID REFERENCES child_profiles(id);
```

---

## 3E — Gelişmiş Hikaye Oluşturma (Karakter + Tema Seçimi)

### Güncellenen Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `apps/storypal/constants/themes.ts` | Yeni temalar: adventure, science, friendship, bedtime, nature |
| `app/story/select-character.tsx` | Yeni karakter tipleri: animal, princess, superhero, astronaut, pirate, wizard |
| `packages/shared/services/ai-gateway.ts` | Prompt'a çocuk ismi + karakter tipi bilgisi ekle |

### Bağımlılıklar
- Yeni npm paketi yok

---

## 3D — Hikaye İstatistikleri

### Yeni Dosyalar
| Dosya | Tahmini Satır | Açıklama |
|-------|--------------|----------|
| `packages/shared/hooks/useStats.ts` | ~80 | Toplam hikaye, bu ay, favori tema/karakter |
| `app/(tabs)/stats.tsx` | ~250 | İstatistik kartları + basit bar chart |

### Güncellenen Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `app/(tabs)/_layout.tsx` | 5. tab: Stats (📊) ekle |

### Bağımlılıklar
- Yeni npm paketi yok (View-based bar chart)

---

## 3B — Hikaye Paylaşım + PDF Export

### Yeni Dosyalar
| Dosya | Tahmini Satır | Açıklama |
|-------|--------------|----------|
| `packages/shared/services/story-export.ts` | ~100 | HTML template → PDF (expo-print) + share (expo-sharing) |

### Güncellenen Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `app/story/viewer.tsx` | Header'a Share butonu ekle |

### Bağımlılıklar
- `expo-print` (npm install)
- `expo-sharing` (npm install)

---

## 3A — Premium Paywall + RevenueCat

### Yeni Dosyalar
| Dosya | Tahmini Satır | Açıklama |
|-------|--------------|----------|
| `app/paywall.tsx` | ~50 | PaywallScreen wrapper (Expo Router screen) |

### Güncellenen Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `app/(tabs)/create.tsx` | Limit kontrolü, paywall'a yönlendirme |
| `packages/shared/services/usage-limiter.ts` | isPremium param entegrasyonu (zaten var) |
| `app/_layout.tsx` | Paywall screen route ekle |
| `app/(tabs)/settings.tsx` | Premium badge, manage subscription butonu |

### Bağımlılıklar
- `react-native-purchases` zaten kurulu
- RevenueCat API key gerekli (.env'ye EXPO_PUBLIC_REVENUECAT_IOS_KEY)

---

## Implementation Sırası

```
C1: Çocuk Profil Sistemi     → en az bağımlılık, temel özellik
C2: Gelişmiş Hikaye Oluşturma → mevcut dosya güncellemesi
C3: Hikaye İstatistikleri      → yeni tab + hook
C4: PDF Export + Paylaşım     → npm install gerekli
C5: Premium Paywall            → RevenueCat entegrasyonu
```

## Toplam Tahmin
- Yeni dosyalar: 6
- Güncellenen dosyalar: ~12
- Yeni satır: ~800-1000
- npm paketleri: expo-print, expo-sharing
- Supabase migration: 1 (child_profiles)
