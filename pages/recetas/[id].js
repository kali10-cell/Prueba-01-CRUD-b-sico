import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return isOnline;
}

function formatText(value) {
  if (Array.isArray(value)) {
    return value.join('\n');
  }

  return value || '';
}

export default function RecipeDetail() {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRecipe() {
      if (!router.query.id) return;

      if (!supabase) {
        setError('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('recetas')
        .select('*')
        .eq('id', router.query.id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setRecipe(data);
      }

      setLoading(false);
    }

    loadRecipe();
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>{recipe ? `${recipe.titulo} | Recetas offline` : 'Receta offline'}</title>
        <meta name="theme-color" content="#e470f3" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </Head>

      <main style={styles.page}>
        <header style={styles.header}>
          <Link href="/" style={styles.back}>
            Volver
          </Link>
          <span style={{ ...styles.status, background: isOnline ? '#dcfce7' : '#fee2e2' }}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </header>

        {loading && <p style={styles.message}>Cargando receta...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {recipe && (
          <article>
            {recipe.imagen_url && (
              <img src={recipe.imagen_url} alt={recipe.titulo} style={styles.heroImage} />
            )}
            <h1 style={styles.title}>{recipe.titulo}</h1>
            {recipe.descripcion && <p style={styles.description}>{recipe.descripcion}</p>}

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Ingredientes</h2>
              <pre style={styles.pre}>{formatText(recipe.ingredientes)}</pre>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Preparacion</h2>
              <pre style={styles.pre}>{formatText(recipe.instrucciones)}</pre>
            </section>
          </article>
        )}
      </main>
    </>
  );
}

const styles = {
  page: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '32px 20px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
    marginBottom: 24
  },
  back: {
    color: '#b560e6',
    fontWeight: 700
  },
  status: {
    borderRadius: 999,
    color: '#111827',
    fontWeight: 700,
    padding: '8px 12px'
  },
  message: {
    color: '#475569'
  },
  error: {
    background: '#fee2e2',
    borderRadius: 8,
    color: '#991b1b',
    padding: 12
  },
  heroImage: {
    width: '100%',
    maxHeight: 360,
    objectFit: 'cover',
    borderRadius: 8
  },
  title: {
    margin: '24px 0 8px',
    fontSize: 40
  },
  description: {
    color: '#475569',
    fontSize: 18,
    lineHeight: 1.6
  },
  section: {
    marginTop: 28
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 10
  },
  pre: {
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    lineHeight: 1.6,
    padding: 16,
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit'
  }
};

