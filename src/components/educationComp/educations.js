export default function Educations({ funFactSugar, video, artikel }) {
  function getVideoEducations() {
    if (video[0].sumber === "Youtube") {
      return (
        <iframe
          title="YouTube Shorts And Facebook Short"
          src={`https://www.youtube.com/embed/${video[0].linkVideo}`}
          width={500}
          height={300}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="rounded-xl w-full"
        />
      );
    } else if (video[0].sumber === "Instagram") {
      return (
        <div className="h-[500px] overflow-hidden bg-white">
          <blockquote
            className="instagram-media m-auto"
            data-instgrm-permalink={video[0].linkVideo}
            data-instgrm-version="14"
          ></blockquote>
          <script async src="https://www.instagram.com/embed.js"></script>
        </div>
      );
    }
    // else {
    //   return (
    //     <iframe
    //       src={video[0].linkVideo}
    //       width={500}
    //       height={300}
    //       allowFullScreen="true"
    //       allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    //     ></iframe>
    //   );
    // }
  }

  return (
    <div className="flex mt-7 px-5 gap-8 justify-center items-center max-[640px]:flex-col sm:flex-col md:flex-row">
      <div className="basis-1/2">
        <div className="mb-4">
          <h1 className="font-semibold text-lg mb-2">Fun Fact Gula</h1>
          <p className="font-medium text-justify">{funFactSugar[0]}</p>
        </div>
        <div>
          <h1 className="font-semibold text-lg mb-2">
            Berdasarkan Sumber Artikel
          </h1>
          <p className="font-medium text-justify">
            {artikel[0].kalimatEdukasi}
          </p>
          <p>
            — Sumber:{" "}
            <a href={artikel[0].linkEdukasi}>{artikel[0].sumberReferensi}</a>
          </p>
        </div>
      </div>
      <div className="basis-1/2 w-full flex justify-center items-center">
        {getVideoEducations()}
      </div>
    </div>
  );
}
