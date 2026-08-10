import Image from "next/image";

type VisualizationProps = {
  percentage: number;
  index: number;
  typeBeverage: "Siap Minum" | "Harus Dilarutkan";
};

export default function ResultVisualization({
  index,
  percentage,
  typeBeverage,
}: VisualizationProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bottleVisualization">
        {/* Fill */}
        <div
          className={`${typeBeverage === "Harus Dilarutkan" ? "glassFill" : "bottleFill"}`}
          style={
            {
              "--fill-height": `${safePercentage}%`,
            } as React.CSSProperties
          }
        />

        {/* Visualization Image */}
        <Image
          src={`/images/pageCalculateBeverage/${typeBeverage === "Harus Dilarutkan" ? "glass_new.png" : "plastic-bottle-water.png"}`}
          alt="Visualization Image"
          height={300}
          width={300}
          className={`${typeBeverage === "Harus Dilarutkan" ? "glassImage" : "bottleImage"}`}
        />
      </div>

      <span className="text-xs font-semibold text-slate-500">
        {Math.round(safePercentage)}%
      </span>
    </div>
  );
}
