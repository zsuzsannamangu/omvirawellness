import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import footerStyles from '@/styles/Footer.module.scss';
import homeStyles from './page.module.scss';

// Refactored homepage sections
import Hero from '@/components/Home/Hero';
import AudiencePaths from '@/components/Home/AudiencePaths';
import FAQ from '@/components/Home/FAQ';
// import RecommendedProviders from '@/components/Home/RecommendedProviders'; // TODO: restore when ready
import HowItWorks from '@/components/Home/HowItWorks';
import WellnessNotOneSize from '@/components/Home/WellnessNotOneSize';
import Testimonials from '@/components/Home/Testimonials';

import ServiceCategories from '@/components/Home/ServiceCategories';
import ProviderFinalCta from '@/components/Home/ProviderFinalCta';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main" className={homeStyles.homeMain}>
        <Hero />
        <AudiencePaths />
        <HowItWorks />
        <WellnessNotOneSize />
        {/* <RecommendedProviders /> */}
        <Testimonials />
        <ServiceCategories />
        <FAQ />
        <ProviderFinalCta />
      </main>
      <Footer className={footerStyles.flushAfterCta} />
    </>
  );
};

export default Home;
