export async function getVideoEducations(video:any) {
    try{
        const responseApi = await fetch("/api/getDataVideo")
        if(!responseApi.ok){
            throw new Error(`HTTP error! status: ${responseApi.status}`);
        }
        const getDataVideo = await responseApi.json().then((dataDb) => video(dataDb.data))
        return getDataVideo
    }catch(error){
        console.error("Error fetching data:", error);
    }
}