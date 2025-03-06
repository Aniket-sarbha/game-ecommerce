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
      <div className="bg-black pt-20">
        <Vortex>
          <div className="flex flex-col items-center justify-center h-[30rem]">
            <TypewriterEffectSmooth words={words} />
          </div>
        </Vortex>
      </div>
      <div className="bg-black py-8">
        <Carousel></Carousel>
        <Popularitems></Popularitems>
        <ImageGallery />
        <div className="bg-red-800 h-1 mx-auto max-w-7xl rounded-full justify-center"></div>
      </div>
      {/* <ImageGallery></ImageGallery> */}
      <Footer></Footer>
    </>
  );
}
