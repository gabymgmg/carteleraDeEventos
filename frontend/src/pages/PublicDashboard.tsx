import type { Event } from '../types/event';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Input from '../components/Input';
import Button from '../components/Buttons';

interface PublicDashboardProps {
  allEvents: Event[];
  loading: boolean;
}

const PublicDashboard = ({ allEvents, loading }: PublicDashboardProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Obtenemos los valores actuales de la URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const date = searchParams.get('date') || '';

  // Filtramos lo que tenemos en memoria según los parámetros de búsqueda
  const filteredEvents = allEvents.filter((event) => {
    const matchesCategory = !category || event.category === category;
    const matchesSearch =
      !search || event.title.toLowerCase().includes(search.toLowerCase());
    const matchesLocation =
      !location ||
      event.location.toLowerCase().includes(location.toLowerCase());

    // Comparación simple de fecha (YYYY-MM-DD)
    const matchesDate = !date || event.date.startsWith(date);

    return matchesCategory && matchesSearch && matchesLocation && matchesDate;
  });

  // Función para actualizar los filtros en la URL
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  if (loading && allEvents.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Descubre Eventos
      </h1>

      {/* Filtros de Categoría */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {['', 'Concierto', 'Teatro', 'Deportes', 'Feria'].map((cat) => (
          <Button
            key={cat}
            onClick={() => updateFilter('category', cat)}
            variant={category === cat ? 'primary' : 'secondary'}
            className="rounded-full px-6 py-1 text-sm whitespace-nowrap w-fit"
          >
            {cat === '' ? 'Todos' : cat}
          </Button>
        ))}
      </div>

      {/* Barra de Búsqueda y Filtros Avanzados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 items-end bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <Input
          name="search"
          label="¿Qué buscas?"
          placeholder="Ej: Rock, Jazz..."
          value={search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="md:col-span-1"
        />

        <Input
          name="location"
          label="¿Dónde?"
          placeholder="Ciudad..."
          value={location}
          onChange={(e) => updateFilter('location', e.target.value)}
        />

        <Input
          name="date"
          label="¿Cuándo?"
          type="date"
          value={date}
          onChange={(e) => updateFilter('date', e.target.value)}
        />

        <div className="flex flex-col justify-end">
          {/* Simula el espacio del label de los otros inputs */}
          <div className="hidden md:block h-5 mb-1"></div>

          {(category || search || location || date) && (
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-red-500 hover:text-red-700 font-semibold py-2 transition-colors"
            >
              Limpiar filtros ×
            </button>
          )}
        </div>
      </div>

      {/* Renderizado de resultados filtrados */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg mb-4">
            No hay eventos que coincidan.
          </p>
          <Button onClick={() => setSearchParams({})} variant="secondary">
            Ver todos
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              actions={
                <Button
                  to={`/event/${event._id}`}
                  variant="primary"
                  className="w-full"
                >
                  Ver Detalles
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicDashboard;
