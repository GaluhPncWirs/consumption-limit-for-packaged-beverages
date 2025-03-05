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
  const sugarConsume = (sugarProduk / volumeProduk) * sugarProduk;

  useEffect(() => {
    const sugarRatio = Math.round(sugarConsume / getYourMaxSugars);
    let calculateRiskObesity = 0;
    let calculateRiskDiabetes = 0;

    if (sugarRatio <= 1) {
      // ≤ 100% batas harian (≤ 1x) → Risiko rendah.
      calculateRiskObesity = 5;
      calculateRiskDiabetes = 10;
    } else if (sugarRatio > 1 && sugarRatio <= 1.5) {
      // 101% - 150% dari batas harian (1 - 1.5x) → Risiko sedang.
      calculateRiskObesity = 20;
      calculateRiskDiabetes = 30;
    } else if (sugarRatio > 1.5 && sugarRatio <= 2) {
      // 151% - 200% dari batas harian (1.5 - 2x) → Risiko tinggi.
      calculateRiskObesity = 45;
      calculateRiskDiabetes = 55;
    } else if (sugarRatio >= 2) {
      // > 200% dari batas harian (>2x) → Risiko sangat tinggi.
      calculateRiskObesity = 80;
      calculateRiskDiabetes = 90;
    } else {
      calculateRiskObesity = 0;
      calculateRiskDiabetes = 0;
    }

    // if (sugarRatio <= 1) {
    //   calculateRiskDiabetes = 20;
    // } else if (sugarRatio > 1 && sugarRatio <= 1.5) {
    //   calculateRiskDiabetes = 40;
    // } else if (sugarRatio > 1.5 && sugarRatio <= 2) {
    //   calculateRiskDiabetes = 60;
    // } else if (sugarRatio >= 2) {
    //   calculateRiskDiabetes = 80;
    // } else {
    //   calculateRiskDiabetes = 0;
    // }

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
      <p className="mt-3 mx-5 text-justify max-[640px]:text-sm sm:text-sm md:text-lg">
        Anda berisiko mengalami obesitas dan diabetes jika terus mengonsumsi
        minuman ini sebanyak {volumeProduk} ml.
      </p>
      <p>
        Estimasi risiko ini didasarkan pada konsumsi gula harian pengguna dan
        bukan merupakan diagnosis medis. Untuk informasi lebih lanjut,
        konsultasikan dengan tenaga medis profesional.
      </p>
    </div>
  );
}
