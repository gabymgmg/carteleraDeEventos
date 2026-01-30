import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold">Cartelera de Eventos - Cerca de ti</h1>
          <p className="mt-4">Developing..</p>
        </div>
      } />
    </Routes>
  );
}

export default App;