
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Character } from "@/types";
import { toast } from "sonner";
import { characters as fallbackCharacters } from "@/data/characters";

export const useCharacters = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const { data, error } = await supabase
                .from("characters")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) throw error;

            if (data && data.length > 0) {
                // Map Supabase snake_case to frontend camelCase if necessary.
                // Based on our migration, columns are: is_premium (snake).
                // Frontend expects: isPremium (camel). 
                // We need to map it.

                const mappedCharacters: Character[] = data.map((char: any) => ({
                    ...char,
                    isPremium: char.is_premium, // Map snake to camel
                    desc: char.description || "", // Map DB description to frontend desc
                    prompts: [], // Default empty array as it's not in DB yet
                    rules: char.rules || []
                }));

                setCharacters(mappedCharacters);
            } else {
                // If DB is empty (shouldn't happen with migration), fallback to static
                console.warn("No characters found in DB, using fallback");
                setCharacters(fallbackCharacters);
            }
        } catch (err) {
            console.error("Error fetching characters:", err);
            setError(err as Error);
            toast.error("Erro ao carregar personagens. Usando modo offline.");
            setCharacters(fallbackCharacters); // Fallback on error
        } finally {
            setLoading(false);
        }
    };

    return { characters, loading, error, refetch: fetchCharacters };
};
