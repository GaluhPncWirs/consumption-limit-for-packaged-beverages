export async function getDataProduct(product:any) {
    try {
        const responseApi = await fetch("/api/getData");
        if (!responseApi.ok) {
          throw new Error(`HTTP error! status: ${responseApi.status}`);
        }
        const getDataProduct = await responseApi.json()
          .then((data) => product(data.data));
        return getDataProduct;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
}