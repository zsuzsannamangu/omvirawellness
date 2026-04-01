import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Refactored homepage sections
import Hero from '@/components/Home/Hero';
import AudiencePaths from '@/components/Home/AudiencePaths';
import FAQ from '@/components/Home/FAQ';
// import RecommendedProviders from '@/components/Home/RecommendedProviders'; // TODO: restore when ready
import HowItWorks from '@/components/Home/HowItWorks';
import WellnessNotOneSize from '@/components/Home/WellnessNotOneSize';
import Testimonials from '@/components/Home/Testimonials';

import ServiceCategories from '@/components/Home/ServiceCategories';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <AudiencePaths />
        <HowItWorks />
        <WellnessNotOneSize />
        {/* <RecommendedProviders /> */}
        <Testimonials />
        <ServiceCategories />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default Home;
