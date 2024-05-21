"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IProps {
  color: string;
  name: string;
  percent: number;
  detail: number;
}
interface HalfDoughnutProps {
  color: string;
  name: string;
  percent: number;
}

export const DoughnutChart: React.FC<IProps> = ({
  color,
  name,
  percent,
  detail,
}) => {
  const data = {
    datasets: [
      {
        label: name,
        data: [percent, 100 - percent],
        backgroundColor: [color, `${color}25`],
        borderWidth: 0,
        borderRaduis: {
          innerStart: 100,
          innerEnd: 100,
        },
        cutout: "90%",
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

  const doughnutLabel = {
    id: "doughnutLabel",
    beforeDatasetsDraw(chart: any) {
      const { ctx } = chart;
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;

      ctx.save();

      ctx.font = "16px roboto";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(`${detail}`, xCoor, yCoor);
    },
  };

  return (
    <>
      <div className="w-full max-w-[120px] mx-auto">
        <Doughnut data={data} options={options} plugins={[doughnutLabel]} />
        <p
          className={`mx-auto text-xs text-['${color}'] text-center pt-4`}
          style={{ color: color }}
        >
          {name}
        </p>
      </div>
    </>
  );
};

export const HalfDoughnutChart: React.FC<HalfDoughnutProps> = ({
  color,
  name,
  percent,
}) => {
  const data = {
    datasets: [
      {
        label: name,
        data: [percent, 100 - percent],
        backgroundColor: [color, `${color}25`],
        borderWidth: 0,
        cutout: "75%",
        circumference: 180,
        rotation: 270,
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

  const doughnutLabel = {
    id: "doughnutLabel",
    beforeDatasetsDraw(chart: any) {
      const { ctx, data } = chart;
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;

      ctx.save();

      ctx.font = "20px roboto";
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText(`${data.datasets[0].data[0]}`, xCoor, yCoor - 33);

      ctx.font = "14px roboto";
      ctx.fillStyle = "#333";
      ctx.fillText("TOTAL JOBS", xCoor, yCoor - 3);
    },
  };

  return (
    <>
      <div className="w-[220px] mx-auto">
        <Doughnut data={data} options={options} plugins={[doughnutLabel]} />
      </div>
    </>
  );
};
