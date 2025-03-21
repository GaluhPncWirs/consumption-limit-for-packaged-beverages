export default function Educations({ funFactSugar, randomVideo, artikel }) {
  return (
    <div className="flex mt-7 px-5 gap-8 justify-center items-center max-[640px]:flex-col sm:flex-col md:flex-row">
      <div className="basis-1/2">
        <div className="mb-4">
          <h1 className="font-semibold text-lg mb-2">Fun Fact Tentang Gula</h1>
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
      {/* dari youtube */}
      <div className="basis-1/2 w-full">
        <iframe
          title="YouTube Shorts And Facebook Short"
          src={`https://www.youtube.com/embed/${randomVideo[0]}`}
          width={500}
          height={300}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="rounded-xl w-full"
        />
      </div>
      {/* dari instagram */}
      {/* <div>
            <blockquote
              class="instagram-media"
              data-instgrm-permalink="https://www.instagram.com/reel/DCBulGuyR39/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              data-instgrm-version="14"
            ></blockquote>
            <script async src="https://www.instagram.com/embed.js"></script>
          </div> */}
    </div>
  );
}
