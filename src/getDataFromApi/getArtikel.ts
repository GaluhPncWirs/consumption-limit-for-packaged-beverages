export async function getDataArtikel(artikel:any) {
    try{
        const response = await fetch("/api/getDataArtikel")

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json().then((data) => artikel(data.data))
        return data
    }catch (error) {
        console.error("Error fetching data:", error);
      }
}