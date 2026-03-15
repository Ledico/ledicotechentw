import { Routes, Route } from 'react-router-dom';
import Portfolio from './components/Portfolio';
import ProjectsManager from './components/ProjectsManager';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin/projects" element={<ProjectsManager />} />
    </Routes>
  );
}

export default App;
