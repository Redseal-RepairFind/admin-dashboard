"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IProps {
  percent: number[];
}

export const DoughnutChart: React.FC<IProps> = ({ percent }) => {
  const data = {
    datasets: [
      {
        data: percent,
        backgroundColor: ["#000000", "#7B7B7B", "#BBBBBB", "#F1F1F1"],
        borderWidth: 0,
        borderRaduis: {
          innerStart: 100,
          innerEnd: 100,
        },
        cutout: "80%",
        rotation: 300,
      },
    ],
  };

  const options = {
    animation: {
      delay: 0,
      duration: 1000,
      easeing: "linear",
    },
  };

  return (
    <>
      <div className="w-full max-w-[150px]">
        <Doughnut data={data} options={options} />
      </div>
    </>
  );
};
