// app/page.jsx

import Navbar from "@/app/components/Navbar";
import Carousel from "@/app/components/Carousel";
import Popularitems from "@/app/components/Popularitems";
import TypewriterEffectSmooth from "@/app/components/Typewriter";
import CardsGrid from "@/app/components/CardsGrid";
import Vortex from "@/app/components/Vortex";
import Footer from "@/app/components/Footer";
import ImageGallery from "@/app/components/ImageGallery";


export default function Home() {
  const words = [
    {
      text: "In-game",
    },
    {
      text: "currency",
    },
    {
      text: "now",
    },
    {
      text: "available",
    },
    {
      text: "at",
    },
    {
      text: "discounted",
    },
    {
      text: "prices",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <>
      <Navbar></Navbar>
      <div className="bg-white dark:bg-black pt-20 transition-colors duration-300">
        <Vortex>
          <div className="flex flex-col items-center justify-center h-[30rem]">
            <TypewriterEffectSmooth words={words} />
          </div>
        </Vortex>
      </div>
      <div className="bg-gray-100 dark:bg-black py-8 transition-colors duration-300">
        <Carousel></Carousel>
        <Popularitems></Popularitems>
        <ImageGallery />
      </div>
      {/* <CardsGrid></CardsGrid> */}
      {/* <ImageGallery></ImageGallery> */}
      <Footer></Footer>
    </>
  );
}
