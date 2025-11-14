"use client";

import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface CategoryCardProps {
  title?: string;
  isAddCard?: boolean;
  onClick?: () => void;
}

export function CategoryCard({ title, isAddCard = false, onClick }: CategoryCardProps) {
  if (isAddCard) {
    return (
      <Card 
        className="
          min-h-[120px] 
          border-2 
          border-dashed 
          border-gray-300 
          dark:border-gray-600 
          bg-transparent 
          hover:border-blue-400 
          dark:hover:border-blue-400 
          hover:shadow-lg 
          hover:shadow-blue-400/25 
          dark:hover:shadow-blue-400/25 
          transition-all 
          duration-300 
          cursor-pointer 
          group 
          flex 
          items-center 
          justify-center
        "
        onClick={onClick}
      >
        <div className="text-center">
          <Plus 
            className="
              w-8 
              h-8 
              mx-auto 
              mb-2 
              text-gray-400 
              group-hover:text-blue-400 
              transition-colors 
              duration-300
            " 
          />
          <span 
            className="
              text-sm 
              font-medium 
              text-gray-500 
              group-hover:text-blue-400 
              transition-colors 
              duration-300
            "
          >
            Criar categoria
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="
        min-h-[120px] 
        border 
        border-gray-200 
        dark:border-gray-700 
        bg-white 
        dark:bg-gray-800 
        hover:shadow-lg 
        hover:shadow-blue-400/25 
        dark:hover:shadow-blue-400/25 
        transition-all 
        duration-300 
        cursor-pointer 
        group 
        flex 
        items-center 
        justify-center
      "
      onClick={onClick}
    >
      <div className="text-center p-4">
        <h3 
          className="
            text-lg 
            font-semibold 
            text-gray-800 
            dark:text-gray-200 
            group-hover:text-blue-600 
            dark:group-hover:text-blue-400 
            transition-colors 
            duration-300
          "
        >
          {title}
        </h3>
      </div>
    </Card>
  );
}