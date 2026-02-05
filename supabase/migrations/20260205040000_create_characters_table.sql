-- Create characters table
create table public.characters (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  age int,
  country text,
  hair text,
  eyes text,
  style text,
  description text,
  prompt_base text,
  image_url text,
  is_premium boolean default false,
  rules text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.characters enable row level security;

-- Policies
create policy "Public characters are viewable by everyone"
  on public.characters for select
  to public
  using (true);

create policy "Admins can insert characters"
  on public.characters for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'service_role' OR
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin'
  );

create policy "Admins can update characters"
  on public.characters for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'service_role' OR
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin'
  );

create policy "Admins can delete characters"
  on public.characters for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    ) OR
    auth.jwt() ->> 'role' = 'service_role' OR
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin'
  );

-- Seed Data (Migrating form src/data/characters.ts)
INSERT INTO public.characters (name, age, country, hair, eyes, style, description, is_premium, rules) VALUES
('Kaizen', 24, 'Brasil', 'Dark brown, wavy, shoulder-length', 'Deep brown, almond-shaped', 'Casual chic, earth tones', 'Energetic and bold, perfect for lifestyle content', false, ARRAY['Natural lighting preferred', 'Warm color palette', 'Authentic expressions']),
('Aiko', 22, 'Japão', 'Straight black, long with bangs', 'Dark brown, soft gaze', 'Minimalist Japanese aesthetic', 'Elegant and serene with delicate features', false, ARRAY['Soft diffused light', 'Clean backgrounds', 'Subtle expressions']),
('Luna', 26, 'Espanha', 'Dark auburn, thick curls', 'Hazel with golden flecks', 'Mediterranean bohemian', 'Passionate and expressive Mediterranean beauty', false, ARRAY['Golden hour lighting', 'Warm tones', 'Expressive poses']),
('Maya', 25, 'Índia', 'Jet black, long and silky', 'Dark brown, intense', 'Traditional meets modern', 'Graceful with striking traditional aesthetics', false, ARRAY['Rich jewel tones', 'Ornate details welcome', 'Regal posture']),
('Sofia', 23, 'Itália', 'Chestnut brown, loose waves', 'Green-gray, expressive', 'Italian elegance', 'Classic beauty with modern flair', false, ARRAY['Natural beauty emphasis', 'Effortless style', 'Confident expressions']),
('Irina', 28, 'Rússia', 'Platinum blonde, sleek', 'Ice blue, piercing', 'High fashion editorial', 'Sophisticated and mysterious allure', true, ARRAY['Dramatic lighting', 'Cool color palette', 'Strong angular poses']),
('Yara', 27, 'Líbano', 'Dark brown, voluminous', 'Deep green, captivating', 'Middle Eastern glamour', 'Exotic beauty with captivating eyes', true, ARRAY['Gold accents welcome', 'Smoky eye makeup', 'Luxurious settings']),
('Helena', 35, 'Alemanha', 'Ash blonde, bob cut', 'Steel gray, confident', 'Sophisticated minimalist', 'Mature elegance and refined style', true, ARRAY['Clean lines', 'Neutral palette', 'Professional settings']),
('Camila', 32, 'Colômbia', 'Dark brown, long layers', 'Warm brown, friendly', 'Vibrant and colorful', 'Vibrant and full of life energy', true, ARRAY['Bold colors welcome', 'Dynamic poses', 'Joyful expressions']),
('Nina', 41, 'França', 'Salt and pepper, chic bob', 'Brown, wise', 'Parisian sophistication', 'Timeless Parisian sophistication', true, ARRAY['Classic French aesthetic', 'Understated elegance', 'Confident presence']),
('Akemi', 50, 'Japão', 'Silver-streaked black, elegant updo', 'Dark brown, serene', 'Traditional Japanese elegance', 'Ageless beauty with wisdom', true, ARRAY['Graceful poses', 'Traditional elements', 'Serene expressions']),
('Rosa', 48, 'Bolívia', 'Gray-streaked brown, natural', 'Warm brown, nurturing', 'Earth mother aesthetic', 'Warm and nurturing presence', true, ARRAY['Natural textures', 'Earthy colors', 'Genuine warmth']),
('Tatiana', 45, 'Rússia', 'Dark red, sophisticated style', 'Gray-green, commanding', 'Power elegance', 'Commanding presence with grace', true, ARRAY['Strong silhouettes', 'Rich colors', 'Authoritative poses']),
('Liu', 38, 'China', 'Black, sleek and shiny', 'Dark brown, mysterious', 'Modern Asian fusion', 'Ethereal and poised beauty', true, ARRAY['Soft lighting', 'Flowing fabrics', 'Graceful movements']),
('Amara', 42, 'Nigéria', 'Natural coils, regal crown', 'Deep brown, powerful', 'African queen aesthetic', 'Radiant queen with powerful aura', true, ARRAY['Bold patterns', 'Vibrant colors', 'Regal presence']);
