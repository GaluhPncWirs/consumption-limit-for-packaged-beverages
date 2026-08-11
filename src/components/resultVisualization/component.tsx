import Image from "next/image";

type VisualizationProps = {
  percentage: number;
  index: number;
  typeBeverage: "Siap Minum" | "Harus Dilarutkan";
};

const configTypeBeverageClassName = {
  "Harus Dilarutkan": {
    fillImage: "glassFill",
    srcImage: "glass_new",
  },
  "Siap Minum": {
    fillImage: "bottleFill",
    srcImage: "plastic-bottle-water",
  },
};

export default function ResultVisualization({
  index,
  percentage,
  typeBeverage,
}: VisualizationProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  const configClassName = configTypeBeverageClassName[typeBeverage];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="imageVisualization">
        {/* Fill */}
        <div
          className={configClassName.fillImage}
          style={
            {
              "--fill-height": `${safePercentage}%`,
            } as React.CSSProperties
          }
        />

        {/* Visualization Image */}
        <Image
          src={`/images/pageCalculateBeverage/${configClassName.srcImage}.png`}
          alt="Visualization Image"
          height={300}
          width={300}
          className="imageConfiguration"
        />
      </div>

      <span className="text-xs font-semibold text-slate-500">
        {Math.round(safePercentage)}%
      </span>
    </div>
  );
}
