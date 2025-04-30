// app/page.jsx

import Navbar from "@/app/components/Navbar";
import Carousel from "@/app/components/Carousel";
import Popularitems from "@/app/components/Popularitems";
import Footer from "@/app/components/Footer";
import ImageGallery from "@/app/components/ImageGallery";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";


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
      <div>
      <HeroGeometric
        title1="Discounted Game Currency  "
        title2=" for Every Gamer."
      />
      </div>
      <div className=" bg-[#030303] py-8 ">
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
