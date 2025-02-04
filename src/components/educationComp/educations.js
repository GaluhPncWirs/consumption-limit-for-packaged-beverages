import { getDataFunFact } from "@/getDataFromApi/getFunFact";
import { getVideoEducations } from "@/getDataFromApi/getVideoEdu";
import { useEffect, useState } from "react";

export default function Educations({ educations }) {
  const [funFactSugar, setFunFactSugar] = useState([]);
  const [randVideo, setRandVideo] = useState([]);

  useEffect(() => {
    getDataFunFact((data) => {
      const randomFunFact = data
        .map((a) => a.funFact)
        .sort(() => Math.random() - 0.5);

      setFunFactSugar(randomFunFact);
    });
  }, []);

  useEffect(() => {
    getVideoEducations((data) => {
      const randomVideos = data
        .map((video) => video.linkVideo)
        .sort(() => Math.random() - 0.5);
      setRandVideo(randomVideos);
    });
  }, []);

  return (
    <div className="flex mt-7 px-3 gap-8 justify-center max-[640px]:flex-col sm:flex-col md:flex-row">
      {educations === true && (
        <>
          <div className="basis-1/2">
            <div>
              <h1 className="font-semibold text-lg">Fun Fact Tentang Gula</h1>
              <div className="font-medium text-sm text-justify">
                {funFactSugar[0]}
              </div>
            </div>
          </div>
          <div className="basis-1/2 w-full">
            <iframe
              title="YouTube Shorts And Facebook Short"
              src={randVideo[0]}
              width={500}
              height={300}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="rounded-xl w-full"
              allowFullScreen={true}
            />
          </div>
        </>
      )}
    </div>
  );
}
