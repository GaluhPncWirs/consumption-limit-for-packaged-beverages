export async function getDataFunFact(funFact:any) {
    try {
        const response = await fetch("/api/getDataFunFact");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json().then(data => funFact(data.data) );
        return data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
}