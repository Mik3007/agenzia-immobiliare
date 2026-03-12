import { HomeIcon } from "@heroicons/react/24/solid";

export default function Loader() {
  return (
    <div className="flex justify-center items-center py-20">
      <HomeIcon className="w-14 h-14 text-[#44442c] animate-pulse" />
    </div>
  );
}