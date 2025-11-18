import Image from "next/image";

export default function ComponentInput(props) {
  const { children, titleInput, srcImg, altImg, htmlFor } = props;
  return (
    <div className="relative pt-6 font-semibold group w-full">
      {children}
      <label htmlFor={htmlFor} className="labelText flex gap-3 items-center">
        <Image
          width={200}
          height={200}
          src={srcImg}
          alt={altImg}
          className="size-8 transition-all duration-200 ease-in-out group-focus-within:size-7"
        />
        <span>{titleInput}</span>
      </label>
    </div>
  );
}
