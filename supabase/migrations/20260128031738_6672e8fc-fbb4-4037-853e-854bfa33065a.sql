-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'canceled', 'past_due');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    stripe_customer_id TEXT,
    subscription_status public.subscription_status DEFAULT 'inactive',
    subscription_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create prompts table
CREATE TABLE public.prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    prompt_text TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    category TEXT DEFAULT 'geral',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = _user_id
          AND subscription_status = 'active'
    )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Prompts policies
CREATE POLICY "Anyone can view free prompts"
ON public.prompts FOR SELECT
USING (is_premium = false);

CREATE POLICY "Subscribers and admins can view premium prompts"
ON public.prompts FOR SELECT
TO authenticated
USING (
    is_premium = true 
    AND (
        public.has_active_subscription(auth.uid()) 
        OR public.has_role(auth.uid(), 'admin')
    )
);

CREATE POLICY "Admins can manage prompts"
ON public.prompts FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON public.prompts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample prompts
INSERT INTO public.prompts (title, description, prompt_text, is_premium, category) VALUES
('Retrato Profissional', 'Crie retratos profissionais impressionantes', 'Professional headshot portrait, studio lighting, neutral background, sharp focus, high resolution, professional attire, confident expression, 8K quality', false, 'retrato'),
('Paisagem Cinematográfica', 'Paisagens com visual de cinema', 'Cinematic landscape photography, golden hour lighting, dramatic clouds, vibrant colors, wide angle lens, high dynamic range, professional color grading', false, 'paisagem'),
('Arte Digital Fantasia', 'Crie mundos fantásticos', 'Digital fantasy art, magical atmosphere, ethereal lighting, intricate details, vibrant colors, professional illustration style, 4K resolution', false, 'arte'),
('Produto E-commerce', 'Fotos profissionais de produtos', 'Professional product photography, clean white background, soft shadows, commercial lighting, high detail, e-commerce style, crisp focus', true, 'produto'),
('Cidade Cyberpunk', 'Cenários futuristas cyberpunk', 'Cyberpunk cityscape, neon lights, rain-soaked streets, futuristic architecture, holographic advertisements, atmospheric fog, cinematic composition, ultra detailed', true, 'arte'),
('Modelo Fashion', 'Ensaios de moda profissionais', 'High fashion editorial photography, dramatic lighting, avant-garde styling, professional model pose, magazine quality, artistic composition, luxury aesthetic', true, 'moda'),
('Animação 3D Personagem', 'Personagens estilo Pixar/Disney', 'Pixar style 3D character, expressive features, smooth rendering, vibrant colors, professional animation quality, detailed textures, appealing design', true, 'animacao'),
('Vídeo Promocional', 'Prompts para vídeos promocionais', 'Cinematic promotional video style, smooth camera movement, professional color grading, dynamic transitions, engaging visuals, brand-focused composition, 4K quality', true, 'video');