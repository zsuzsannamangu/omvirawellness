// src/app/providers/page.tsx
import ProviderNavbar from "@/components/Providers/ProviderNavbar";
import Footer from "@/components/Footer";
import styles from "@/styles/Providers/Providers.module.scss";
import Image from "next/image";

export default function ProvidersPage() {
    return (
        <div>
            <ProviderNavbar />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <h1>Step Into Your Premium Era as a Wellness Leader</h1>
                            <p>
                                Omvira connects you with your ideal clients and the tools you need to thrive as an independent wellness professional.
                            </p>
                            <a href="/join" className={styles.ctaButton}>
                                Join Omvira
                            </a>
                        </div>
                        <div className={styles.heroImage}>
                            <Image
                                src="/images/yogasunrise.jpg"
                                alt="A yoga sunrise"
                                width={600}
                                height={400}
                                className={styles.heroImg}
                                priority
                            />
                            <div className={styles.playButton}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Sections - Alternating Layout */}
                <section className={styles.mainSections}>
                    <div className={styles.container}>
                        <div className={styles.sectionsContainer}>

                            {/* Section 1: Who Is Omvira For? (Text left, Image right) */}
                            <div id="who-is-omvira-for" className={styles.section}>
                                <div className={styles.content}>
                                    <h2>Who Is Omvira For?</h2>
                                    <p className={styles.sectionDescription}>
                                        Omvira is designed for independent wellness professionals who want the freedom to build their practice on their own terms.
                                    </p>
                                    <div className={styles.listContainer}>
                                        <div className={styles.listItem}>
                                            <strong>Yoga Teachers & Yoga Therapists</strong>
                                            <p>Bring personalized yoga sessions to clients' homes, hotels, or studios</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Massage Therapists</strong>
                                            <p>Offer therapeutic bodywork in the comfort of clients' preferred locations</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Estheticians</strong>
                                            <p>Provide skincare and facial treatments at home or in rented studio spaces</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Reiki Practitioners</strong>
                                            <p>Share healing energy work in peaceful, client-chosen environments</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Doulas</strong>
                                            <p>Support families through birth and postpartum journeys wherever they need you</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Other Wellness Pros</strong>
                                            <p>Acupuncturists, personal trainers, and holistic healers ready to go mobile</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.imageContainer}>
                                    <Image
                                        src="/images/massage5.jpg"
                                        alt="Wellness professional at work"
                                        width={500}
                                        height={400}
                                        className={styles.image}
                                    />
                                </div>
                            </div>

                            {/* Section 2: Work Where Your Clients Need You (Image left, Text right) */}
                            <div id="work-where-clients-need-you" className={`${styles.section} ${styles.reverse}`}>
                                <div className={styles.content}>
                                    <h2>Work Where Your Clients Need You</h2>
                                    <p className={styles.sectionDescription}>
                                        Bring your wellness practice directly to your clients, wherever they feel most comfortable and relaxed.
                                    </p>
                                    <div className={styles.listContainer}>
                                        <div className={styles.listItem}>
                                            <strong>Client Homes</strong>
                                            <p>Provide services in the comfort and privacy of your client's own space</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Hotels & Vacation Rentals</strong>
                                            <p>Perfect for travelers seeking wellness services during their stay</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Rented Studios</strong>
                                            <p>Professional spaces when you need a dedicated wellness environment</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Outdoor Spaces</strong>
                                            <p>Nature-based sessions for those who prefer fresh air and natural settings</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Corporate Offices</strong>
                                            <p>Workplace wellness programs to support employee health and productivity</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.imageContainer}>
                                    <Image
                                        src="/images/massageplace.jpg"
                                        alt="Thai massage place"
                                        width={500}
                                        height={400}
                                        className={styles.image}
                                    />
                                </div>
                            </div>

                            {/* Section 3: Everything you need to grow your practice (Text left, Image right) */}
                            <div id="everything-you-need" className={styles.section}>
                                <div className={styles.content}>
                                    <h2>Everything you need to grow your practice</h2>
                                    <p className={styles.sectionDescription}>
                                        Professional tools designed specifically for independent wellness providers.
                                    </p>
                                    <div className={styles.listContainer}>
                                        <div className={styles.listItem}>
                                            <strong>Smart Scheduling</strong>
                                            <p>Calendar slots and client bookings with Google Calendar sync (Professional+ plans)</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Secure Payments</strong>
                                            <p>Stripe integration for seamless payment processing and automatic payouts</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Professional Profile</strong>
                                            <p>Showcase your services with client reviews and admin-approved provider signup</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Growth Tools</strong>
                                            <p>Tag suggestions, promo codes, and featured provider opportunities</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Analytics & Insights</strong>
                                            <p>Track visits, favorites, and earnings through your provider dashboard</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Your Terms</strong>
                                            <p>Set your own rates, availability, and service offerings. You're in complete control.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.imageContainer}>
                                    <Image
                                        src="/images/computer2.jpg"
                                        alt="Professional working on a computer"
                                        width={500}
                                        height={400}
                                        className={styles.image}
                                    />
                                </div>
                            </div>

                            {/* Section 4: Built for wellness professionals (Image left, Text right) */}
                            <div className={`${styles.section} ${styles.reverse}`}>
                                <div className={styles.content}>
                                    <h2>Built for wellness professionals, by wellness professionals</h2>
                                    <p className={styles.sectionDescription}>
                                        We understand your unique needs because we've been in your shoes.
                                    </p>
                                    <div className={styles.listContainer}>
                                        <div className={styles.listItem}>
                                            <strong>Transparent pricing</strong>
                                            <p>Clear monthly plans with no hidden fees or surprise deductions</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Complete independence</strong>
                                            <p>Work when you want, where you want, with clients you choose</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Admin-approved quality</strong>
                                            <p>Curated network of professional providers with verified client reviews</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Growing platform</strong>
                                            <p>Join us in the early stages and help shape the future of wellness services</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Future-ready features</strong>
                                            <p>In-app messaging, advanced analytics, and more features coming soon</p>
                                        </div>
                                        <div className={styles.listItem}>
                                            <strong>Your success, our mission</strong>
                                            <p>Every feature we build is designed to help your practice thrive</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.imageContainer}>
                                    <Image
                                        src="/images/smilereal.jpg"
                                        alt="Happy wellness professional"
                                        width={500}
                                        height={400}
                                        className={styles.image}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Mission/Vision Section */}
                <section id="our-mission" className={styles.missionSection}>
                    <div className={styles.container}>
                        <div className={styles.missionContent}>
                            <h2>Our Mission</h2>
                            <p className={styles.missionStatement}>
                                We're building the future of wellness services - connecting independent practitioners with clients who value quality, convenience, and authentic care.
                                Every feature we create is designed with your success in mind.
                            </p>

                            <div className={styles.valuesGrid}>
                                <div className={styles.valueItem}>
                                    <h3>Authenticity</h3>
                                    <p>Real connections between providers and clients, built on trust and transparency</p>
                                </div>
                                <div className={styles.valueItem}>
                                    <h3>Independence</h3>
                                    <p>Your practice, your rules - we provide the tools, you maintain full control</p>
                                </div>
                                <div className={styles.valueItem}>
                                    <h3>Growth</h3>
                                    <p>Supporting your journey from solo practitioner to thriving wellness business</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.ctaSection}>
                    <div className={styles.container}>
                        <h2>Ready to transform your wellness practice?</h2>
                        <p>Join hundreds of providers who are already growing their businesses with Omvira.</p>
                        <a href="/join" className={styles.ctaButtonLarge}>
                            Start Your Journey
                        </a>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className={styles.pricingSection}>
                    <div className={styles.container}>
                        <div className={styles.pricingHeader}>
                            <h2>Choose Your Plan</h2>
                        </div>

                        <div className={styles.pricingGrid}>
                            <div className={styles.pricingCard}>
                                <div className={styles.tierHeader}>
                                    <h3>Essential</h3>
                                    <div className={styles.price}>
                                        <span className={styles.currency}>$</span>
                                        <span className={styles.amount}>29</span>
                                        <span className={styles.period}>/mo</span>
                                    </div>
                                    <p className={styles.tierDescription}>New providers testing the platform</p>
                                </div>
                                <div className={styles.featuresList}>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Add/Edit Services</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Public Profile & Reviews</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Calendar + Client Bookings</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Stripe Payments + Payouts</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Provider Dashboard</span>
                                    </div>
                                </div>
                                <div className={styles.chooseButton}>
                                    <a href="/join" className={styles.chooseBtn}>
                                        Choose Essential
                                    </a>
                                </div>
                            </div>

                            <div className={`${styles.pricingCard} ${styles.popular}`}>
                                <div className={styles.tierHeader}>
                                    <h3>Professional</h3>
                                    <div className={styles.price}>
                                        <span className={styles.currency}>$</span>
                                        <span className={styles.amount}>49</span>
                                        <span className={styles.period}>/mo</span>
                                    </div>
                                    <p className={styles.tierDescription}>Active practitioners building their client base</p>
                                </div>
                                <div className={styles.featuresList}>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Add/Edit Services</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Public Profile & Reviews</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Calendar + Client Bookings</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Stripe Payments + Payouts</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Provider Dashboard</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Promo Codes</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Statistics (visits, favorites)</span>
                                    </div>
                                </div>
                                <div className={styles.chooseButton}>
                                    <a href="/join" className={styles.chooseBtn}>
                                        Choose Professional
                                    </a>
                                </div>
                            </div>

                            <div className={styles.pricingCard}>
                                <div className={styles.tierHeader}>
                                    <h3>Growth+</h3>
                                    <div className={styles.price}>
                                        <span className={styles.currency}>$</span>
                                        <span className={styles.amount}>89</span>
                                        <span className={styles.period}>/mo</span>
                                    </div>
                                    <p className={styles.tierDescription}>Full-time wellness entrepreneurs</p>
                                </div>
                                <div className={styles.featuresList}>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Add/Edit Services</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Public Profile & Reviews</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Calendar + Client Bookings</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Stripe Payments + Payouts</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Provider Dashboard</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Promo Codes</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Stats (visit, favorites)</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Featured Provider (occasional)</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>Google Calendar Sync</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <span className={styles.checkmark}>✅</span>
                                        <span>In-app Messaging (coming soon)</span>
                                    </div>
                                </div>
                                <div className={styles.chooseButton}>
                                    <a href="/join" className={styles.chooseBtn}>
                                        Choose Growth+
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className={styles.aboutSection}>
                    <div className={styles.container}>
                        <div className={styles.aboutHeader}>
                            <h2>Meet The Founders</h2>
                        </div>

                        <div className={styles.foundersGrid}>
                            <div className={styles.founderCard}>
                                <div className={styles.founderImage}>
                                    <Image
                                        src="/images/Jenn.png"
                                        alt="Jennifer Duffin - Founder & CEO"
                                        width={400}
                                        height={500}
                                        className={styles.founderImg}
                                    />
                                </div>
                                <div className={styles.founderContent}>
                                    <h3>Jennifer Duffin</h3>
                                    <p className={styles.founderTitle}>Founder & CEO</p>
                                    <p className={styles.founderBio}>
                                        Hi! My name is Jenn, I've been on both sides of the system - an overworked and stressed traveler spending hours online
                                        looking for a local massage therapist to show up at my Airbnb for some much needed relief AND a yoga teacher and therapist
                                        trying to build a sustainable business. That's why I'm building Omvira. I started selling friendship bracelets in middle school
                                        and I never stopped dreaming up ways to make more meaningful connections more accessible.
                                    </p>
                                </div>
                            </div>
                            <div className={styles.founderCard}>
                                <div className={styles.founderImage}>
                                    <Image
                                        src="/images/Zsuzsi.jpg"
                                        alt="Zsuzsanna Mangu - Lead Software Developer and Technical Product Manager"
                                        width={400}
                                        height={500}
                                        className={styles.founderImg}
                                    />
                                </div>
                                <div className={styles.founderContent}>
                                    <h3>Zsuzsanna Mangu</h3>
                                    <p className={styles.founderTitle}>Lead Software Developer and Technical Product Manager</p>
                                    <p className={styles.founderBio}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}