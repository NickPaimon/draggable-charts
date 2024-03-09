import React, { useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import Widget from "./Widget";
import Sidebar from "./Sidebar";
import HorizontalBarChart from "./HorizontalBarChartWidget";
import PieChart from "./PieChartWidget";
import DonutChart from "./DonutChartWidget";

const Dashboard = () => {
  const [widgets, setWidgets] = useState([]);
  const [hoveredWidgetId, setHoveredWidgetId] = useState(null);

  const addWidget = useCallback((widgetType) => {
    const newWidget = {
      id: Date.now(),
      type: widgetType,
      content: `Content for ${widgetType}`,
    };
    setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
  }, []);

  const removeWidget = useCallback((widgetId) => {
    setWidgets((prevWidgets) =>
      prevWidgets.filter((widget) => widget.id !== widgetId)
    );
  }, []);

  const moveWidget = useCallback((dragId, hoverId) => {
    setWidgets((prevWidgets) => {
      const dragIndex = prevWidgets.findIndex((w) => w.id === dragId);
      const hoverIndex = prevWidgets.findIndex((w) => w.id === hoverId);
      if (dragIndex === -1 || hoverIndex === -1) {
        return prevWidgets; // Invalid drag or hover index
      }

      // Swapping widgets
      const result = Array.from(prevWidgets);
      const temp = result[dragIndex];
      result[dragIndex] = result[hoverIndex];
      result[hoverIndex] = temp;

      return result;
    });
  }, []);

  const [, drop] = useDrop({
    accept: "widget",
    hover: (item, monitor) => {
      const dragIndex = widgets.findIndex((w) => w.id === item.id);
      const hoverIndex = widgets.findIndex((w) => w.id === hoveredWidgetId);

      // Set the hovered widget ID for potential drop
      if (monitor.isOver()) {
        const hoverId = monitor.getItem().id;
        setHoveredWidgetId(hoverId); // Update state with currently hovered widget's ID
      }
    },
    drop: (item, monitor) => {
      if (!monitor.didDrop() && hoveredWidgetId !== null) {
        moveWidget(item.id, hoveredWidgetId);
      }
      setHoveredWidgetId(null); // Reset hovered widget ID after drop
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
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
        Component = () => <div>{widget.content}</div>;
    }

    return (
      <Widget
        key={widget.id}
        id={widget.id}
        removeWidget={removeWidget}
        index={index}
        type={widget.type}
      >
        <Component {...widget} />
      </Widget>
    );
  };

  return (
    <div className="flex">
      <Sidebar addWidget={addWidget} />
      <div
        ref={drop}
        className="widget-area w-full h-full"
        style={
          {
            // backgroundColor: isOver && canDrop ? "lightgreen" : "lightgrey",
          }
        }
      >
        {widgets.map((widget, index) => renderWidget(widget, index))}
      </div>
    </div>
  );
};

export default Dashboard;
