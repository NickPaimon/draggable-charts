import React, { useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import Widget from "./Widget";
import Sidebar from "./Sidebar";
import HorizontalBarChart from "./HorizontalBarChartWidget";
import PieChart from "./PieChartWidget";
import DonutChart from "./DonutChartWidget";

const Dashboard = () => {
  const [widgets, setWidgets] = useState([]);

  const addWidget = useCallback((widgetType) => {
    const newWidget = {
      id: Date.now(), // Unique ID for key prop
      type: widgetType, // Type to determine which widget to render
      content: `Content for ${widgetType}`, // Placeholder content
    };
    setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
  }, []);

  const removeWidget = useCallback((widgetId) => {
    setWidgets((prevWidgets) =>
      prevWidgets.filter((widget) => widget.id !== widgetId)
    );
  }, []);

  const moveWidget = useCallback((draggedId, hoverId) => {
    setWidgets((prevWidgets) => {
      const draggedIndex = prevWidgets.findIndex((w) => w.id === draggedId);
      const hoverIndex = prevWidgets.findIndex((w) => w.id === hoverId);

      if (draggedIndex === hoverIndex) return prevWidgets; // No move needed

      const result = Array.from(prevWidgets);
      const [removed] = result.splice(draggedIndex, 1);
      result.splice(hoverIndex, 0, removed);

      return result;
    });
  }, []);

  const [, drop] = useDrop({
    accept: "WIDGET",
    hover(item, monitor) {
      const dragIndex = item.index;
      const hoverIndex = widgets.findIndex(
        (w) => w.id === monitor.getItem().id
      );

      // Ensure dragIndex is updated during the drag operation
      if (dragIndex === hoverIndex) {
        return;
      }

      // Perform the swap
      moveWidget(dragIndex, hoverIndex);

      // Update the dragging item's index to reflect new position
      item.index = hoverIndex;
    },
  });

  const renderWidget = (widget, index) => {
    let Component;
    switch (widget.type) {
      case "pieChart":
        Component = PieChart;
        break;
      case "donutChart":
        Component = DonutChart;
        break;
      case "horizontalBarChart":
        Component = HorizontalBarChart;
        break;
      default:
        Component = () => <div key={index}>{widget.content}</div>;
    }

    return (
      <Widget
        key={widget.id}
        id={widget.id}
        type="WIDGET"
        removeWidget={removeWidget}
        index={index} // Ensure this index is used correctly in Widget for drag logic
        moveWidget={moveWidget}
      >
        <Component {...widget} />
      </Widget>
    );
  };

  return (
    <div className="flex">
      <Sidebar addWidget={addWidget} />
      <div ref={drop} className="flex-1 flex flex-wrap">
        {widgets.map((widget, index) => renderWidget(widget, index))}
      </div>
    </div>
  );
};

export default Dashboard;
