export default function Educations({ educations, funFactSugar, randomVideo }) {
  return (
    <div className="flex mt-7 px-3 gap-8 justify-center max-[640px]:flex-col sm:flex-col md:flex-row">
      {educations === true && (
        <>
          <div className="basis-1/2">
            <div className="mb-4">
              <h1 className="font-semibold text-lg mb-2">
                Fun Fact Tentang Gula
              </h1>
              <p className="font-medium text-justify">{funFactSugar[0]}</p>
            </div>
            <div>
              <h1 className="font-semibold text-lg mb-2">
                Jurnal Yang Terkait
              </h1>
              <p className="font-medium text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt facere iure eum temporibus nobis, corporis id amet
                alias obcaecati dolorem. Quisquam voluptates veritatis quasi in
                dolor iusto earum. Pariatur, eligendi!
              </p>
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
