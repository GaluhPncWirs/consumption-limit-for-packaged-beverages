import DisplayInputUser from "./inputUser/page";

export default function Home() {
  // async function getData() {
  //   const url = "https://oauth.fatsecret.com/connect/token";
  //   const header = new Headers({
  //     "Content-Type": "application/x-www-form-urlencoded",
  //     Authorization:
  //       "Basic " +
  //       btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET),
  //   });

  //   const body = new URLSearchParams({
  //     grant_type: "client_credentials",
  //     scope: "basic",
  //   });

  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: header,
  //       body: body,
  //     });

  //     if (!response.ok) {
  //       throw new Error("http error status" + response.status);
  //     }
  //     const data = await response.json();

  //     await callApi(data.access_token, "toast");
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }

  // async function callApi(accessToken: string, searchExpression: string) {
  //   const apiUrl = "https://platform.fatsecret.com/rest/server.api";

  //   const headers = new Headers({
  //     Authorization: `Bearer ${accessToken}`,
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   });

  //   const params = new URLSearchParams({
  //     method: "foods.search",
  //     search_expression: searchExpression,
  //     format: "json",
  //   });

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: headers,
  //       body: params.toString(),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Food Search Response:", data);
  //   } catch (error) {
  //     console.error("Error calling API:", error);
  //   }
  // }
  // getData();
  return (
    <div>
      <div className="bg-orange-300 ">
        <div className="h-screen max-w-2xl mx-auto flex flex-col items-center justify-center">
          <DisplayInputUser />
        </div>
      </div>
    </div>
  );
}
