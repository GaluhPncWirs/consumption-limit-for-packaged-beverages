export default function Educations({ educations, funFactSugar, randomVideo }) {
  return (
    <div className="flex mt-7 px-3 gap-8 justify-center max-[640px]:flex-col sm:flex-col md:flex-row">
      {educations === true && (
        <>
          <div className="basis-1/2">
            <div>
              <h1 className="font-semibold text-lg mb-3">
                Fun Fact Tentang Gula
              </h1>
              <div className="font-medium text-sm text-justify">
                {funFactSugar[0]}
              </div>
            </div>
          </div>
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
        </>
      )}
    </div>
  );
}
