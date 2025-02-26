import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Popularitems from "@/components/Popularitems";
import TypewriterEffectSmooth from "@/components/Typewriter";
import Image from "next/image"
import Tabs from "@/components/Tabs";
import Vortex from "@/components/Vortex";
import Footer from "@/components/Footer";

export default function Home() {

  const DummyContent = () => {
    return (
      <Image
        src="/linear.webp"
        alt="dummy image"
        width="1000"
        height="1000"
        className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
      />
    )
  }

  const tabs = [
    {
      title: "Product",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Product Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Services",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Services tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Playground",
      value: "playground",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Playground tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Content",
      value: "content",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Content tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Random",
      value: "random",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Random tab</p>
          <DummyContent />
        </div>
      ),
    },
  ]

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
      text: "at"
    },
    {
      text: "discounted",
    },
    {
      text: "prices",
      className: "text-blue-500 dark:text-blue-500",
    }
  ]
  
  return (
    <><div className="bg-black pt-3">
      <Navbar></Navbar>
      <Vortex>
      <div className="flex flex-col items-center justify-center h-[30rem]">
      <TypewriterEffectSmooth words={words} />
      </div>
      </Vortex>
      </div>
      <div className="gradient-container py-8">
      <Carousel></Carousel>
      <Popularitems></Popularitems>
      <Tabs className = "" tabs={tabs} > </Tabs>
      <div className="bg-red-800 h-1 mx-auto max-w-7xl rounded-full justify-center"></div>
      </div>
      <Footer></Footer>
    </>
  );
}
