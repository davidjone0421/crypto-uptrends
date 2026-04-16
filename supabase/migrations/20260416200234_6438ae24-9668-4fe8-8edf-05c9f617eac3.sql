-- 1. App role enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Authors
CREATE TABLE public.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  twitter_handle TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authors public read" ON public.authors FOR SELECT USING (true);
CREATE POLICY "admins write authors" ON public.authors
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Subcategories
CREATE TABLE public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subcategories public read" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "admins write subcategories" ON public.subcategories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'footer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read subscribers" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete subscribers" ON public.newsletter_subscribers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 5. Extend articles
ALTER TABLE public.articles
  ADD COLUMN author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  ADD COLUMN subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  ADD COLUMN disclaimer TEXT;

-- Admins can write articles (extends existing public read policy)
CREATE POLICY "admins write articles" ON public.articles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Auto-promote first user to admin
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_first_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_first_user_admin();

-- 7. Seed subcategories
INSERT INTO public.subcategories (category_id, slug, name)
SELECT c.id, s.slug, s.name FROM public.categories c
CROSS JOIN LATERAL (VALUES
  ('blockchain','Blockchain'),
  ('defi','DeFi'),
  ('meme-coins','Meme Coins')
) AS s(slug, name)
WHERE c.slug = 'altcoin-updates';

INSERT INTO public.subcategories (category_id, slug, name)
SELECT c.id, s.slug, s.name FROM public.categories c
CROSS JOIN LATERAL (VALUES
  ('investment','Investment'),
  ('market-analysis','Market Analysis'),
  ('exchange','Exchange'),
  ('trading','Trading')
) AS s(slug, name)
WHERE c.slug = 'price-predictions';

-- 8. Add Crypto News top-level category (shown in screenshots)
INSERT INTO public.categories (slug, name, description) VALUES
  ('crypto-news', 'Crypto News', 'Latest cryptocurrency news and market updates')
ON CONFLICT (slug) DO NOTHING;

-- 9. Seed default author
INSERT INTO public.authors (slug, name, title, bio, avatar_url, twitter_handle) VALUES
  ('cryptouptrend-editorial', 'CryptoUptrend Editorial', 'Editorial Team',
   'The CryptoUptrend Editorial team covers breaking cryptocurrency news, market analysis, and emerging Web3 trends. Our writers combine years of fintech reporting experience with deep on-chain research.',
   'https://api.dicebear.com/7.x/initials/svg?seed=CU&backgroundColor=0088ff',
   'CryptoUptrend');

-- Backfill existing articles with default author
UPDATE public.articles SET author_id = (SELECT id FROM public.authors WHERE slug = 'cryptouptrend-editorial');
