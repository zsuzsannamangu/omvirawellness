import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Refactored homepage sections
import Hero from '@/components/Home/Hero';
// (Future additions)
import About from '@/components/Home/About';
import FAQ from '@/components/Home/FAQ';
import RecommendedProviders from '@/components/Home/RecommendedProviders';
import HowItWorks from '@/components/Home/HowItWorks';
import Testimonials from '@/components/Home/Testimonials';

import ServiceCategories from '@/components/Home/ServiceCategories';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServiceCategories />
        <HowItWorks />
        <RecommendedProviders />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default Home;
