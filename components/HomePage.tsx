import React from 'react';
import {
  ArrowUpTrayIcon,
  ChevronRightIcon,
  DevicePhoneMobileIcon,
  LightBulbIcon,
  PaintBrushIcon,
  SparklesIcon,
  WandSparklesIcon
} from './icons';

interface HomePageProps {
  onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{children}</p>
  </div>
);

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="flex">
        <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600 text-white">
                {icon}
            </div>
        </div>
        <div className="ml-4">
            <h3 className="text-lg font-medium leading-6 text-slate-900">{title}</h3>
            <p className="mt-2 text-base text-slate-500">{description}</p>
        </div>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full animate-fade-in bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
                Your Personal AI Stylist Awaits
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-slate-600 mb-8">
                Stop guessing, start knowing. Upload a photo and let our advanced AI curate perfect outfits for any occasion, tailored just for you.
              </p>
              <button
                onClick={onGetStarted}
                className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-transform hover:scale-105 transform shadow-lg flex items-center justify-center mx-auto lg:mx-0"
              >
                Find My Style
                <ChevronRightIcon className="w-6 h-6 ml-2" />
              </button>
            </div>
            <div className="relative h-96 lg:h-auto">
                <div className="absolute -top-8 -left-8 w-48 h-48 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative flex justify-center items-center gap-4">
                <div className="bg-slate-800 p-2 rounded-2xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                    <img src="https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg" alt="Try-on example 1" className="w-48 h-auto rounded-lg object-cover" />
                </div>
                <div className="bg-slate-800 p-2 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 z-10 scale-110">
                    <img src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg" alt="Try-on example 2" className="w-48 h-auto rounded-lg object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-24 bg-slate-50/70 rounded-3xl">
          <div className="text-center mb-12 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Why Choose Couture AI?</h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 mt-2">
              Go beyond generic advice. Get a truly personalized fashion experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <FeatureCard icon={<WandSparklesIcon className="w-6 h-6" />} title="Instant Style Makeover">
              Receive three complete, head-to-toe outfit suggestions—Formal, Casual, and Stylish—in seconds.
            </FeatureCard>
            <FeatureCard icon={<DevicePhoneMobileIcon className="w-6 h-6" />} title="Hyper-Realistic Try-On">
              See how new styles look on you with our groundbreaking virtual try-on technology that respects your unique features.
            </FeatureCard>
            <FeatureCard icon={<PaintBrushIcon className="w-6 h-6" />} title="Personalized For You">
              Our AI considers your physique, occasion, and season to create looks that are uniquely yours.
            </FeatureCard>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Get Dressed in 4 Easy Steps</h2>
                    <p className="mt-4 text-lg text-slate-600">From photo upload to virtual try-on, your new wardrobe is just a few clicks away.</p>
                </div>
                <div className="space-y-10">
                    <Step icon={<ArrowUpTrayIcon className="w-6 h-6"/>} title="1. Upload Your Photo" description="Select a clear, full-body photo to begin your style analysis."/>
                    <Step icon={<LightBulbIcon className="w-6 h-6"/>} title="2. Set Your Scene" description="Tell our AI the season and occasion you're dressing for."/>
                    <Step icon={<SparklesIcon className="w-6 h-6"/>} title="3. Review Your Looks" description="Explore three distinct style portfolios curated by the AI stylist."/>
                    <Step icon={<WandSparklesIcon className="w-6 h-6"/>} title="4. Try It On" description="Visualize any outfit on your photo with our realistic virtual try-on."/>
                </div>
            </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20">
          <div className="bg-indigo-600 rounded-2xl p-12 text-center shadow-xl">
             <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Ready to Discover Your Style?</h2>
             <p className="max-w-2xl mx-auto text-lg text-indigo-100 mt-4 mb-8">
               Unlock a world of fashion possibilities. Your next favorite outfit is waiting.
             </p>
             <button 
                onClick={onGetStarted} 
                className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-slate-100 transition-transform hover:scale-105 transform shadow-lg"
            >
              Start My Transformation
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;