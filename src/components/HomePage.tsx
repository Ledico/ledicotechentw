import Hero from './Hero';
import About from './About';
import CareerTimeline from './CareerTimeline';
import Certifications from './Certifications';
import Portfolio from './Portfolio';
import Contact from './Contact';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <About />
      <CareerTimeline />
      <Certifications />
      <Portfolio />
      <Contact />
    </main>
  );
};

export default HomePage;
