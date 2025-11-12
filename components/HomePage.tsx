import React from 'react';
import {
  ArrowUpTrayIcon,
  ChevronRightIcon,
  HeartIconSolid,
  LightBulbIcon,
  SparklesIcon,
  WandSparklesIcon
} from './icons';

interface HomePageProps {
  onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{children}</p>
  </div>
);

const StepCard: React.FC<{ number: string; title: string; children: React.ReactNode; icon: React.ReactNode; }> = ({ number, title, children, icon }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 border-2 border-indigo-500 text-indigo-500 rounded-full">
                {icon}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-slate-600 mt-1">{children}</p>
        </div>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4 tracking-tight">
          Your Personal <span className="text-indigo-600">AI</span> Stylist
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-8">
          Transform your look with personalized outfit suggestions. Upload a full-body photo and discover styles tailored just for you by our world-class fashion AI.
        </p>
        <button 
            onClick={onGetStarted} 
            className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-transform hover:scale-105 transform shadow-lg flex items-center justify-center mx-auto"
        >
          Get Started Now
          <ChevronRightIcon className="w-6 h-6 ml-2" />
        </button>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-slate-50 rounded-2xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">How It Works</h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mt-2">
            Get your personalized style in four simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard number="1" title="Upload Your Photo" icon={<ArrowUpTrayIcon className="w-6 h-6"/>}>
                Start by uploading a clear, full-body photograph of yourself.
            </StepCard>
            <StepCard number="2" title="Select Preferences" icon={<LightBulbIcon className="w-6 h-6"/>}>
                Choose the season and occasion to help our AI tailor the perfect look.
            </StepCard>
            <StepCard number="3" title="Discover Your Styles" icon={<SparklesIcon className="w-6 h-6"/>}>
                Receive three unique outfit suggestions: Formal, Casual, and Stylish.
            </StepCard>
            <StepCard number="4" title="Virtual Try-On" icon={<WandSparklesIcon className="w-6 h-6"/>}>
                See how the outfits look on you with our realistic virtual try-on feature.
            </StepCard>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Powerful Features</h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mt-2">
            Everything you need to redefine your style and express yourself with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<WandSparklesIcon className="w-6 h-6" />} title="Expert AI Stylist">
            Our AI analyzes your photo to provide bespoke fashion advice, just like a professional couturier.
          </FeatureCard>
          <FeatureCard icon={<SparklesIcon className="w-6 h-6" />} title="Realistic Virtual Try-On">
            Visualize outfits on your own photo with stunning accuracy, preserving your look and feel.
          </FeatureCard>
          <FeatureCard icon={<HeartIconSolid className="w-6 h-6" />} title="Save Your Favorites">
            Keep a gallery of your favorite generated looks to inspire your next shopping trip or event.
          </FeatureCard>
        </div>
      </section>
    </div>
  );
};

export default HomePage;