import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Visualization({
  sugarProduk,
  volumeProduk,
  getYourMaxSugars,
}: {
  sugarProduk: number;
  volumeProduk: number;
  getYourMaxSugars: number;
}) {
  const [riskLevel, setRiskLevel] = useState([0, 0]);
  const sugarConsume = (sugarProduk / volumeProduk) * volumeProduk;

  useEffect(() => {
    const sugarRatio = Math.floor(sugarConsume / getYourMaxSugars);
    let calculateRiskObesity = 0;
    let calculateRiskDiabetes = 0;

    if (sugarRatio <= 1) {
      calculateRiskObesity = 10;
    } else if (sugarRatio > 1 && sugarRatio <= 1.5) {
      calculateRiskObesity = 25;
    } else if (sugarRatio > 1.5 && sugarRatio <= 2) {
      calculateRiskObesity = 50;
    } else if (sugarRatio >= 2) {
      calculateRiskObesity = 75;
    } else {
      calculateRiskObesity = 0;
    }

    if (sugarRatio <= 1) {
      calculateRiskDiabetes = 20;
    } else if (sugarRatio > 1 && sugarRatio <= 1.5) {
      calculateRiskDiabetes = 40;
    } else if (sugarRatio > 1.5 && sugarRatio <= 2) {
      calculateRiskDiabetes = 60;
    } else if (sugarRatio >= 2) {
      calculateRiskDiabetes = 80;
    } else {
      calculateRiskDiabetes = 0;
    }

    setRiskLevel([calculateRiskObesity, calculateRiskDiabetes]);
  }, [sugarConsume, getYourMaxSugars]);

  const data = {
    labels: ["Obesitas", "Diabetes"],
    datasets: [
      {
        label: "Tingkat Risiko (%)",
        data: riskLevel,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
        borderColor: ["#ff6384", "#36a2eb", "#ffce56"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Tingkat Resiko Penyakit Berdasarkan Konsumsi Gula",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="mt-6 flex flex-col justify-center items-center">
      <div className="w-11/12 h-64 max-[640px]:w-full sm:w-11/12 lg:w-3/4 xl:w-1/2">
        <Bar data={data} options={options} />
      </div>
      <p className="mt-3 mx-5 text-justify max-[640px]:text-sm sm:text-sm md:text-base">
        Anda berisiko mengalami obesitas dan diabetes jika terus mengonsumsi
        minuman ini sebanyak {volumeProduk} ml.
      </p>
    </div>
  );
}
