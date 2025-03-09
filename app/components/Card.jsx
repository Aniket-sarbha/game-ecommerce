import Image from 'next/image';
import Link from 'next/link';

const Card = ({ store }) => {
  const { id, name, image } = store;

  // Format the store name for display (capitalize and replace hyphens with spaces)
  const formattedName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Link 
      href={`/stores/${id}`} 
      className="block group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px]"
    >
      <div className="aspect-[1.2] relative">
        <Image
          src={image}
          alt={`${formattedName} store`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 160px, (max-width: 1024px) 180px, (max-width: 1280px) 200px, 220px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
      </div>
      <div className="p-2 sm:p-3 bg-white">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{formattedName}</h3>
        <p className="mt-0.5 text-xs text-gray-500 hidden sm:block">View items →</p>
      </div>
    </Link>
  );
};

export default Card;