import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Card = ({ store }) => {
  const { id, name, image } = store;
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Format the store name for display (capitalize and replace hyphens with spaces)
  const formattedName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleCardClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      // If user is logged in, navigate to store page
      router.push(`/stores/${encodeURIComponent(name)}`);
    } else {
      // If user is not logged in, redirect to login page
      router.push(`/login?callbackUrl=${encodeURIComponent(`/stores/${encodeURIComponent(name)}`)}`);
    }
  };

  return (
    <a
      onClick={handleCardClick}
      className="group relative block w-full sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px] cursor-pointer"
    >
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-70 blur group-hover:opacity-100 transition duration-300"></div>
      <div className="relative h-full rounded-xl bg-gray-900 p-1.5 overflow-hidden">
        <div className="aspect-[1.2] rounded-t-lg overflow-hidden">
          <div 
            style={{ backgroundImage: `url(${image})` }}
            aria-label={`${formattedName} store`}
            role="img"
            className="bg-cover bg-center w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-3 bg-gray-800 rounded-b-lg">
          <h3 className="font-medium text-gray-100 truncate">
            {formattedName}
          </h3>
          <div className="mt-2 flex items-center text-xs font-medium text-purple-400">
            <span>{isAuthenticated ? "Explore store" : "Login to view"}</span>
            <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default Card;