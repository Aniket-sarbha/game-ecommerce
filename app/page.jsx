import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Popularitems from "@/components/Popularitems";
import TypewriterEffectSmooth from "@/components/Typewriter";
import Image from "next/image";
import Tabs from "@/components/Tabs";
import Vortex from "@/components/Vortex";
import Footer from "@/components/Footer";
import Card from "@/components/Card";

export default function Home() {
  const DummyContent = () => {
    return <Card id={1} />;
  };

  const tabs = [
    {
      title: "Games",
      value: "Games",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Voucher",
      value: "Voucher",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          
        </div>
      ),
    },
    {
      title: "PLN",
      value: "PLN",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          
        </div>
      ),
    },
    {
      title: "Live Apps",
      value: "Live Apps",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          
        </div>
      ),
    },
  ];

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
        <Tabs className="" tabs={tabs}></Tabs>
       
        <div className="bg-red-800 h-1 mx-auto max-w-7xl rounded-full justify-center"></div>
      </div>
      <Footer></Footer>
    </>
  );
}
