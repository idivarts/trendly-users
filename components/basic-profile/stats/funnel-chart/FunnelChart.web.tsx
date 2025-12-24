import React from "react";
//@ts-ignore
import CanvasJSReact from "@canvasjs/react-charts"; // Ensure this is the correct import path

const CanvasJSChart = CanvasJSReact.CanvasJSChart; // Use the correct chart component

interface FunnelChartProps {
    dataPoints: { label: string; y: number }[]; // Define the correct type for data points
}

const FunnelChartWeb: React.FC<FunnelChartProps> = ({ dataPoints }) => {
    const options = {
        title: {
            text: "Application Overview",
        },
        height: 300,
        data: [
            {
                type: "funnel",
                dataPoints: dataPoints,
            },
        ],
    };

    return (
        <div>
            <CanvasJSChart options={options} /> {/* Use the correct component */}
        </div>
    );
};

export default FunnelChartWeb;
