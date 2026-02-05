-- Create characters table for managing personas
CREATE TABLE public.characters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    country TEXT,
    hair TEXT,
    eyes TEXT,
    style TEXT,
    description TEXT,
    prompt_base TEXT,
    image_url TEXT,
    is_premium BOOLEAN DEFAULT false,
    rules TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Anyone can view characters
CREATE POLICY "Anyone can view characters" 
ON public.characters 
FOR SELECT 
USING (true);

-- Premium characters visible only to subscribers/admins
CREATE POLICY "Premium characters for subscribers" 
ON public.characters 
FOR SELECT 
USING (
    is_premium = false 
    OR has_active_subscription(auth.uid()) 
    OR has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can manage characters
CREATE POLICY "Admins can manage characters" 
ON public.characters 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create site_settings table for dynamic configuration
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read site settings
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
('primary_color', '#9b59b6'),
('secondary_color', '#8e44ad'),
('logo_url', ''),
('hero_title', 'KAIZEN PROMPTS'),
('hero_subtitle', 'Crie prompts profissionais para IA com facilidade'),
('site_name', 'KAIZEN PROMPTS');

-- Create updated_at triggers
CREATE TRIGGER update_characters_updated_at
BEFORE UPDATE ON public.characters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();