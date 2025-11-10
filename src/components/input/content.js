import Image from "next/image";

export default function ComponentInput(props) {
  const { children, titleInput, srcImg, altImg } = props;
  return (
    <div className="relative pt-6 font-semibold group">
      {children}
      <label
        htmlFor="age"
        className="labelText flex flex-row-reverse gap-3 items-center"
      >
        <span>{titleInput}</span>
        <Image
          width={200}
          height={200}
          src={srcImg}
          alt={altImg}
          className="size-8 transition-all duration-200 ease-in-out group-focus-within:size-7"
        />
      </label>
    </div>
  );
}
