import Image from "next/image";

type VisualizationProps = {
  percentage: number;
  index: number;
  srcImage: string;
};

export default function ResultVisualization({
  index,
  percentage,
  srcImage,
}: VisualizationProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bottleVisualization">
        {/* Fill */}
        <div
          className="bottleFill"
          style={
            {
              "--fill-height": `${safePercentage}%`,
            } as React.CSSProperties
          }
        />

        {/* Visualization Image */}
        <Image
          src={srcImage}
          alt="Visualization Image"
          className="bottleImage"
        />
      </div>

      <span className="text-xs font-semibold text-slate-500">
        {Math.round(safePercentage)}%
      </span>
    </div>
  );
}
