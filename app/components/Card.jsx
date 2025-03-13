//app/components/Card.jsx


import Link from "next/link";
import { useRouter } from "next/navigation";


const Card = ({ store }) => {
  const { id, name, image } = store;


  // Format the store name for display (capitalize and replace hyphens with spaces)
  const formattedName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Link 
      href={`stores/${encodeURIComponent(name)}`}
      className="block group rounded-lg overflow-hidden shadow-md w-full sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px] hover:scale-105 transition-transform duration-300 "
    >
      <div className="aspect-[1.2] relative">
        <img
          src={image}
          alt={`${formattedName} store`}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 160px, (max-width: 1024px) 180px, (max-width: 1280px) 200px, 220px"
          className="object-cover w-full h-full absolute inset-0 transition-transform duration-300"
        />
      </div>
      <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-600 to-purple-600">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
          {formattedName}
          
        </h3>
        <p className="mt-0.5 text-xs text-white-500 hidden sm:block">
          View items →
        </p>
      </div>
    </Link>
  );
};

export default Card;
