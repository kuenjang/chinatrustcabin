import React from 'react';

interface MenuCardProps {
  name: string;
  description: string;
  price: number;
  image?: string;
  onAdd: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ name, description, price, image, onAdd }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition hover:shadow-xl border border-pink-100">
      <div className="bg-gray-200 flex items-center justify-center h-60 text-3xl text-gray-400 select-none">
        {image ? (
          <img src={image} alt={name} className="object-cover w-full h-full" />
        ) : (
          '600 × 400'
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg mb-1 text-gray-800">{name}</h3>
          {description && <p className="text-gray-600 text-sm mb-2">{description}</p>}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-red-600 font-bold text-lg">NT${price}</span>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded flex items-center gap-1 text-sm font-semibold shadow transition" onClick={onAdd}>
            <span className="text-xl font-bold">＋</span> 加入訂單
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard; 