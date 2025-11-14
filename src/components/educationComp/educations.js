export default function Educations({ funFactSugar, video, artikel }) {
  return (
    <div className="flex justify-center items-center flex-col mt-7 mx-3 gap-y-7">
      <div className="basis-1/2 flex flex-col gap-y-3">
        <div>
          <h1 className="font-semibold text-xl mb-1 tracking-wide">
            Fun Fact Gula
          </h1>
          <p className="font-medium text-justify">{funFactSugar[0]}</p>
        </div>
        <div>
          <h1 className="font-semibold text-xl mb-1 tracking-wide">
            Berdasarkan Sumber Artikel
          </h1>
          <p className="font-medium text-justify">
            {artikel[0]?.kalimatEdukasi}
          </p>
          <p className="mt-1">
            — Baca Selengkapnya di{" "}
            <a
              href={artikel[0]?.linkEdukasi}
              target="_blank"
              className="text-blue-600 hover:underline font-semibold"
            >
              {artikel[0]?.sumberReferensi}
            </a>
          </p>
        </div>
      </div>
      <div className="w-full md:w-10/12 flex justify-center items-center">
        {video[0]?.sumber === "Youtube" ? (
          <iframe
            title="YouTube Shorts And Facebook Short"
            src={`https://www.youtube.com/embed/${video[0]?.linkVideo}`}
            width={300}
            height={400}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="rounded-xl w-full"
          />
        ) : video[0]?.sumber === "Instagram" ? (
          <div className="h-[500px] overflow-hidden bg-white">
            <blockquote
              className="instagram-media m-auto"
              data-instgrm-permalink={video[0]?.linkVideo}
              data-instgrm-version="14"
            ></blockquote>
            <script async src="https://www.instagram.com/embed.js"></script>
          </div>
        ) : null}
      </div>
    </div>
  );
}
