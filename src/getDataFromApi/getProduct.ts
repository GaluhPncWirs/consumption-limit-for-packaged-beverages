export async function getDataProduct(callback: any) {
    try {
        const responseApi = await fetch("/api/getData");
        if (!responseApi.ok) {
          throw new Error(`HTTP error! status: ${responseApi.status}`);
        }
        const getDataProduct = await responseApi.json()
          .then((data) => callback(data.data));
        return getDataProduct;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
}