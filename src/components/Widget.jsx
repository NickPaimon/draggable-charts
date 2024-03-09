import React from "react";
import { useDrag } from "react-dnd";

const Widget = ({ id, children, removeWidget, index }) => {
  // Destructure the isDragging property from the object returned by the collect function
  const [{ isDragging }, dragRef, preview] = useDrag({
    type: "WIDGET",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className="m-4 p-2 h-[200px] bg-white shadow rounded-lg relative"
      style={{ opacity: isDragging ? 0.5 : 1 }} // Now `isDragging` is defined
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
