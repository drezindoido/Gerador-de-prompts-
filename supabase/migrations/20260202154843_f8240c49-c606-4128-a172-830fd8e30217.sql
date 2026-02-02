-- Atualiza o trigger para dar PRO automaticamente aos emails da allowlist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    pro_emails TEXT[] := ARRAY['dreeziin20@gmail.com', 'teamsp2011.aa@gmail.com'];
    is_pro BOOLEAN := NEW.email = ANY(pro_emails);
BEGIN
    INSERT INTO public.profiles (id, email, full_name, subscription_status, subscription_end)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        CASE WHEN is_pro THEN 'active'::subscription_status ELSE 'inactive'::subscription_status END,
        CASE WHEN is_pro THEN '2099-12-31T23:59:59.000Z'::timestamptz ELSE NULL END
    );
    
    -- Adiciona role de admin para dreeziin20@gmail.com
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
        NEW.id, 
        CASE WHEN NEW.email = 'dreeziin20@gmail.com' THEN 'admin'::app_role ELSE 'user'::app_role END
    );
    
    RETURN NEW;
END;
$function$;