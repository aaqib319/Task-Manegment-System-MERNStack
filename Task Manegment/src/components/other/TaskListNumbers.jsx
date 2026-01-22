import React from "react";

const TaskListNumbers = () => {
  const stats = [
    {
      label: "New Tasks",
      count: 0,
      color: "bg-blue-600",
      icon: "M12 4.5v15m7.5-7.5h-15", // Plus icon (example SVG path)
      gradient: "from-blue-500 to-blue-700",
    },
    {
      label: "Completed",
      count: 3,
      color: "bg-lime-600",
      icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // Checkmark in circle (example SVG path)
      gradient: "from-lime-500 to-lime-700",
    },
    {
      label: "Accepted",
      count: 0,
      color: "bg-yellow-500",
      icon: "M9 12h6m-6 4h6m2-12H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z", // Document icon (example SVG path)
      gradient: "from-yellow-400 to-yellow-600",
      textColor: "text-gray-900", // For better contrast on yellow
    },
    {
      label: "Failed",
      count: 1,
      color: "bg-orange-600",
      icon: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // X in circle (example SVG path)
      gradient: "from-orange-500 to-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative p-6 rounded-3xl shadow-xl transform transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-2xl cursor-pointer
                      ${
                        stat.gradient
                          ? `bg-gradient-to-br ${stat.gradient}`
                          : stat.color
                      }
                      ${stat.textColor || "text-white"}
                      overflow-hidden group
                      `}
        >
          {/* Background pattern/element (optional, for extra premium feel) */}
          <div className="absolute inset-0 bg-pattern-dots opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h2 className="text-6xl font-extrabold leading-none">
                {stat.count}
              </h2>
              <h3 className="text-2xl font-semibold mt-2 opacity-90">
                {stat.label}
              </h3>
            </div>
            {stat.icon && (
              <div className="text-white text-opacity-70 group-hover:text-opacity-100 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 sm:w-20 sm:h-20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={stat.icon}
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Small decorative element (optional) */}
          <div
            className={`absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-20
                        ${
                          stat.gradient
                            ? `bg-${stat.gradient.split("-")[1]}-800`
                            : `bg-${stat.color.split("-")[1]}-800`
                        }
                        transform translate-x-1/3 translate-y-1/3 blur-sm
                        group-hover:w-32 group-hover:h-32 transition-all duration-300 ease-out`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default TaskListNumbers;
