import React from "react";

export default function HeroSection() {
    return (
        <section className=" min-h-screen flex items-center justify-center text-black relative overflow-hidden">
            {/* Background decorative shapes */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full animate-pulse blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full animate-ping blur-3xl"></div>

            {/* <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center relative z-10"> */}
            {/* Heading */}
            <div className="absolute animate-fade-in-up delay-600">
                <h1 className="text-5xl p md:text-6xl lg:text-7xl font-serif font-bold leading-tight ">
                    Welcome to the MMESA Short Course Survey
                </h1>

                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                    Phase 2 aims to offer additional information and gather more precise facts about
                    course choice. This form is organized into two main sections to streamline your
                    selection process.
                </p>


                <div className="card mb-2">
                    <h2 className="font-semibold text-xl">Section 1: Module Selection</h2>
                    <p className="text-sm md:text-base">
                        Choose from a list of available modules. Select the ones that align with your
                        academic interests or field of study.
                    </p>
                </div>

                <div className="card">
                    <h2 className="font-semibold text-xl">Section 2: Engineering Software</h2>
                    <p className="text-sm md:text-base">
                        Focuses on software applications commonly used in engineering. Select your
                        preferred software or areas you’d like practical exposure in.
                    </p>
                </div>

                <p className="mt-6 text-sm md:text-base card ">
                    Note: Courses are not free, but the Kumah-Mensah Led Administration is working to
                    reduce fees so every participant can afford them.
                </p>
            </div>






            {/* Tailwind animation keyframes */}
            <style>
                {`
          @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down { animation: fade-in-down 1s forwards; }
          .animate-fade-in-up { animation: fade-in-up 1s forwards; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-600 { animation-delay: 0.6s; }
        `}
            </style>
        </section>
    );
}



