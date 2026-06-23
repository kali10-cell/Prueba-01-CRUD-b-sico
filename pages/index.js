import Head from 'next/head';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function cargarTareas() {
    if (!supabase) {
      setError('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('tareas')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        const message = fetchError.message.includes('Failed to fetch')
          ? 'No se pudo conectar con Supabase. Revisa las variables de entorno del deploy.'
          : fetchError.message;
        setError(message);
      } else {
        setTareas(data || []);
        setError('');
      }
    } catch {
      setError('No se pudo conectar con Supabase. Revisa las variables de entorno del deploy.');
    }

    setLoading(false);
  }

  useEffect(() => {
    cargarTareas();
  }, []);

  async function crearTarea(event) {
    event.preventDefault();

    if (!titulo.trim()) {
      setError('El titulo es obligatorio.');
      return;
    }

    setSaving(true);
    setError('');

    const { data, error: insertError } = await supabase
      .from('tareas')
      .insert({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
    } else {
      setTareas((current) => [data, ...current]);
      setTitulo('');
      setDescripcion('');
    }

    setSaving(false);
  }

  async function cambiarEstado(tarea) {
    setError('');

    const { error: updateError } = await supabase
      .from('tareas')
      .update({ completada: !tarea.completada })
      .eq('id', tarea.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setTareas((current) =>
      current.map((item) =>
        item.id === tarea.id ? { ...item, completada: !item.completada } : item
      )
    );
  }

  async function eliminarTarea(id) {
    setError('');

    const { error: deleteError } = await supabase.from('tareas').delete().eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setTareas((current) => current.filter((tarea) => tarea.id !== id));
  }

  const pendientes = tareas.filter((tarea) => !tarea.completada).length;

  return (
    <>
      <Head>
        <title>Gestor de tareas</title>
        <meta name="description" content="CRUD basico de tareas con Supabase." />
      </Head>

      <main style={styles.page}>
        <section style={styles.panel}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.kicker}>GESTOR DE TAREAS</h1>
            </div>
            <span style={styles.counter}>{pendientes} pendientes</span>
          </header>

          <form onSubmit={crearTarea} style={styles.form}>
            <input
              type="text"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Titulo de la tarea"
              style={styles.input}
            />
            <textarea
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              placeholder="Descripcion opcional"
              style={styles.textarea}
            />
            <button type="submit" disabled={saving} style={styles.primaryButton}>
              {saving ? 'Guardando...' : 'Crear tarea'}
            </button>
          </form>

          {loading && <p style={styles.message}>Cargando tareas...</p>}
          {error && <p style={styles.error}>{error}</p>}

          <section style={styles.list}>
            {!loading && tareas.length === 0 && (
              <div style={styles.empty}>
                <p style={styles.emptyTitle}>No hay tareas todavia</p>
                <p style={styles.emptyText}>Crea la primera para comprobar el CRUD.</p>
              </div>
            )}

            {tareas.map((tarea) => (
              <article key={tarea.id} style={styles.item}>
                <div style={styles.itemContent}>
                  <h2
                    style={{
                      ...styles.itemTitle,
                      color: tarea.completada ? '#64748b' : '#111827',
                      textDecoration: tarea.completada ? 'line-through' : 'none'
                    }}
                  >
                    {tarea.titulo}
                  </h2>
                  {tarea.descripcion && <p style={styles.description}>{tarea.descripcion}</p>}
                </div>

                <div style={styles.actions}>
                  <button type="button" onClick={() => cambiarEstado(tarea)} style={styles.button}>
                    {tarea.completada ? 'Pendiente' : 'Completar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarTarea(tarea.id)}
                    style={styles.dangerButton}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </section>
        </section>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f5f7',
    padding: '48px 20px 80px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
  },
  panel: {
    maxWidth: 820,
    margin: '0 auto',
    background: '#fff',
    border: '1px solid #e1e5ea',
    borderRadius: 10,
    boxShadow: '0 22px 60px rgba(15, 23, 42, 0.07)',
    padding: 28
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
    borderBottom: '1px solid #e9edf2',
    marginBottom: 24,
    paddingBottom: 20
  },
  kicker: {
    margin: 0,
    color: '#475569',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1,
    textTransform: 'uppercase'
  },
  counter: {
    borderRadius: 999,
    background: '#edf8f2',
    color: '#137547',
    fontSize: 13,
    fontWeight: 400,
    padding: '6px 12px',
    whiteSpace: 'nowrap'
  },
  form: {
    display: 'grid',
    gap: 12,
    marginBottom: 24
  },
  input: {
    background: '#fcfdff',
    border: '1px solid #d4dbe5',
    borderRadius: 8,
    color: '#0f172a',
    fontSize: 15,
    outline: 'none',
    padding: '12px 14px'
  },
  textarea: {
    background: '#fcfdff',
    border: '1px solid #d4dbe5',
    borderRadius: 8,
    color: '#0f172a',
    fontSize: 15,
    minHeight: 98,
    outline: 'none',
    padding: '12px 14px',
    resize: 'vertical'
  },
  primaryButton: {
    background: '#111827',
    border: 0,
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 400,
    padding: '12px 16px'
  },
  message: {
    color: '#475569'
  },
  error: {
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    color: '#991b1b',
    fontSize: 14,
    padding: '11px 12px'
  },
  list: {
    display: 'grid',
    gap: 12
  },
  empty: {
    background: '#fbfcfd',
    border: '1px dashed #cbd5e1',
    borderRadius: 10,
    padding: '17px 18px'
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 15,
    margin: '0 0 4px'
  },
  emptyText: {
    color: '#64748b',
    margin: 0
  },
  item: {
    alignItems: 'center',
    background: '#fcfdff',
    border: '1px solid #e6e8ec',
    borderRadius: 10,
    display: 'flex',
    gap: 16,
    justifyContent: 'space-between',
    padding: '15px 16px'
  },
  itemContent: {
    minWidth: 0
  },
  itemTitle: {
    margin: '0 0 5px',
    fontSize: 16,
    fontWeight: 400
  },
  description: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.5,
    margin: 0
  },
  actions: {
    display: 'flex',
    gap: 8
  },
  button: {
    background: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: 7,
    color: '#334155',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 400,
    padding: '7px 10px'
  },
  dangerButton: {
    background: '#fff1f1',
    border: '1px solid #fecaca',
    borderRadius: 7,
    color: '#991b1b',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 400,
    padding: '7px 10px'
  }
};
