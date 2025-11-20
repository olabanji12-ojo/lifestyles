import { Link } from 'react-router-dom';
import { Leaf, Award, Heart, Factory, ArrowRight } from 'lucide-react';

// Define the core values of the brand
const CORE_VALUES = [
    {
        icon: Award,
        title: 'Uncompromising Quality',
        description: 'Every piece is meticulously inspected, ensuring only the finest materials and flawless execution meet your hands.',
    },
    {
        icon: Factory,
        title: 'Artisanal Craftsmanship',
        description: 'We honor time-tested techniques, collaborating with skilled artisans who pour passion into every stitch and detail.',
    },
    {
        icon: Leaf,
        title: 'Conscious Sourcing',
        description: 'Our commitment extends beyond beauty. We prioritize ethical and sustainable sourcing for a better planet.',
    },
    {
        icon: Heart,
        title: 'Client-Centric Design',
        description: 'Your vision is our blueprint. We offer personalized services to create unique pieces that truly resonate with your style.',
    },
];

export default function About() {
    return (
        <div className="bg-white pt-20">

            {/* A. Hero Section: Elegant & Statement */}
            <section className="relative h-[65vh] flex items-center justify-center overflow-hidden bg-gray-50 border-b border-gray-200">
                {/* Background Visual (Placeholder: Replace with a high-quality brand image) */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    // Use a stylish, slightly blurred background image that represents quality/craftsmanship
                    style={{ backgroundImage: 'url(/craft_background.jpg)' }} 
                >
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 text-center max-w-4xl mx-auto px-6 text-white">
                    <nav className="flex justify-center items-center gap-2 text-sm text-gray-200 mb-8">
                        <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
                        <span>/</span>
                        <span className="text-yellow-400 font-medium">About Us</span>
                    </nav>

                    <h1 className="font-serif text-6xl sm:text-8xl tracking-[0.1em] mb-4">
                        OUR LEGACY
                    </h1>
                    <p className="font-handwritten text-4xl text-yellow-400 mb-6">
                        Where Craft Meets Conscience
                    </p>
                    <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                        We are dedicated to timeless elegance, exceptional quality, and designs that enrich your everyday life.
                    </p>
                </div>
            </section>

            {/* B. Our Story: Detailed Narrative */}
            <section className="py-24 max-w-screen-lg mx-auto px-6 sm:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Image Block */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                        {/* Placeholder: Use an image of the founder or a signature product */}
                        <img
                            src="/founder_portrait.jpg" 
                            alt="Company Founder"
                            className="w-full h-full object-cover shadow-2xl"
                        />
                        <div className="absolute bottom-0 left-0 bg-yellow-600 text-white px-6 py-3 text-sm tracking-widest font-bold">
                            EST. 2018
                        </div>
                    </div>

                    {/* Text Block */}
                    <div className="space-y-6 lg:pt-8">
                        <span className="text-sm font-sans-serif tracking-[0.3em] uppercase text-yellow-600">The Beginning</span>
                        <h2 className="font-serif text-5xl text-gray-900 tracking-wide leading-tight">
                            A Passion For Enduring Design
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            Inspired by the need for products that last beyond a single season, our journey began with a simple philosophy: **quality over quantity.** We believe that true luxury lies in the durability of materials and the artistry of creation.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            What started as a small workshop focused on bespoke tailoring has grown into a destination for beautifully crafted goods across fashion and home decor. Our commitment remains unwavering: to source ethically, support local expertise, and deliver excellence with every order. We are not just selling products; we are sharing a piece of our history and dedication.
                        </p>
                        <p className="font-handwritten text-3xl text-gray-900 pt-4">
                            — Adaeze Chukwu, Founder
                        </p>
                    </div>
                </div>
            </section>

            {/* C. Core Values: The Pillars of Our Brand */}
            <section className="bg-[#FAF9F6] py-24 border-t border-b border-gray-100">
                <div className="max-w-screen-xl mx-auto px-6 sm:px-10">
                    <h2 className="text-center font-serif text-5xl text-gray-900 mb-16 tracking-wide">
                        Our Guiding Principles
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {CORE_VALUES.map((value, index) => (
                            <div 
                                key={index} 
                                className="text-center p-8 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 space-y-4"
                            >
                                <value.icon className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                                <h3 className="font-sans-serif text-xl font-bold tracking-wide text-gray-900 uppercase">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* D. CTA: Final Action */}
            <section className="py-32 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="font-serif text-5xl sm:text-6xl tracking-[0.1em] text-gray-900 mb-8">
                        Ready to Experience the Difference?
                    </h2>
                    <p className="text-gray-700 text-xl max-w-3xl mx-auto mb-10">
                        Explore our current collections or start creating your own unique piece with our custom design service.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-3 bg-yellow-600 text-white px-10 py-4 text-sm tracking-[0.3em] font-bold hover:bg-gray-900 transition-all duration-300 uppercase shadow-lg"
                        >
                            Shop Collections <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/personalize"
                            className="inline-flex items-center gap-3 border-2 border-gray-900 text-gray-900 px-10 py-4 text-sm tracking-[0.3em] font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 uppercase shadow-lg"
                        >
                            Start Custom Order 
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}