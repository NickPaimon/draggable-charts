import React from "react";
import { useDrag } from "react-dnd";

const Widget = ({ id, children, removeWidget, index, type }) => {
  // Destructure the isDragging property from the object returned by the collect function
  const [{ isDragging }, drag, preview] = useDrag({
    type: "widget", // You might want to use a constant for types
    item: { id, index, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="widget m-4 p-2 h-[200px] bg-white shadow rounded-lg relative cursor-pointer"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
      <button
        onClick={() => removeWidget(id)}
        className="absolute bottom-0 right-0 m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Remove
      </button>
    </div>
  );
};

export default Widget;
