import React, { useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import Widget from "./Widget";
import Sidebar from "./Sidebar";
import HorizontalBarChart from "./HorizontalBarChartWidget";
import PieChart from "./PieChartWidget";
import DonutChart from "./DonutChartWidget";

const Dashboard = () => {
  const [widgets, setWidgets] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const addWidget = useCallback((widgetType) => {
    const newWidget = {
      id: Date.now(),
      type: "widget",
      name: widgetType,
      content: `Content for ${widgetType}`,
    };
    setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
  }, []);

  const removeWidget = useCallback((widgetId) => {
    setWidgets((prevWidgets) =>
      prevWidgets.filter((widget) => widget.id !== widgetId)
    );
  }, []);

  const moveWidget = useCallback((dragIndex, hoverIndex) => {
    if (dragIndex === hoverIndex) {
      return;
    }
    setWidgets((prevWidgets) => {
      const result = Array.from(prevWidgets);
      const [removed] = result.splice(dragIndex, 1);
      result.splice(hoverIndex, 0, removed);
      return result;
    });
  }, []);

  const [, drop] = useDrop({
    accept: "widget",
    hover: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = widgets.findIndex(
        (w, i) => monitor.isOver({ shallow: true }) && i === hoveredIndex
      );

      if (dragIndex !== hoverIndex) {
        setHoveredIndex(hoverIndex);
        moveWidget(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    drop: () => {
      setHoveredIndex(null);
    },
  });

  const renderWidget = (widget, index) => {
    let Component;
    switch (widget.name) {
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
      <div ref={drop} className="widget-area w-full h-full">
        {widgets.map((widget, index) => renderWidget(widget, index))}
      </div>
    </div>
  );
};

export default Dashboard;
