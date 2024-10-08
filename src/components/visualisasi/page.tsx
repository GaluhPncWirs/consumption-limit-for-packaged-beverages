import { useEffect, useState } from "react";

export default function Visualization({
  sugarProduk,
  volumeProduk,
  yourMaxSugar,
}: {
  sugarProduk: number;
  volumeProduk: number;
  yourMaxSugar: number;
}) {
  const [riskLevel, setRiskLevel] = useState(0);
  const sugarConsume = (sugarProduk / volumeProduk) * volumeProduk;

  useEffect(() => {
    const sugarRatio = Math.floor(sugarConsume / yourMaxSugar);
    let calculateRisk;
    if (sugarRatio <= 1) {
      calculateRisk = 10;
    } else if (sugarRatio > 1 && sugarRatio <= 1.5) {
      calculateRisk = 25;
    } else if (sugarRatio > 1.5 && sugarRatio <= 2) {
      calculateRisk = 50;
    } else if (sugarRatio >= 2) {
      calculateRisk = 75;
    } else {
      calculateRisk = 0;
    }

    setRiskLevel(calculateRisk);
  }, [sugarConsume, yourMaxSugar]);

  return (
    <div>
      <div>
        <div className="mt-6">
          <h2>Resiko Kesehatan Berdasarkan Konsumsi Gula Anda</h2>
          <div className="bg-gray-200 w-full h-6 rounded-lg mt-3">
            <div
              className="progress-fill rounded-l-lg"
              style={{ width: `${riskLevel}%` }}
            ></div>
          </div>
          <p className="mt-2">
            Anda berisiko {riskLevel}% lebih tinggi mengalami obesitas,
            diabetes, atau penyakit jantung jika terus mengonsumsi minuman ini
            sebanyak {volumeProduk} ml.
          </p>
        </div>
      </div>
    </div>
  );
}
