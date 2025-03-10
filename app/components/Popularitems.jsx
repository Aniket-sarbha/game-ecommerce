"use client";

import Card from "./Card";

const Popularitems = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-10 bg-white rounded-3xl p-4 bg-gradient-to-r from-black via-gray-900 to-red-900">
      <div className="relative">
        <div className="flex items-center mb-4 justify-center">
          <h2 className="text-xl font-bold text-white">Most Popular Items</h2>
        </div>

        <div className="overflow-hidden">
           {/* <Card/>  */}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button className="mx-1 w-3 h-3 rounded-full" />
      </div>
    </div>
  );
};

export default Popularitems;
