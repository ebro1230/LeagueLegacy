//HomePage:
//async function handleGetNewToken() {
//   const tokens = await getCookie();
//   try {
//     const response = await fetch(
//       `http://localhost:8000/api/yahooAuth/token-reauth`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
//           client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
//           redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
//           refresh_token: tokens.refreshToken,
//           grant_type: "refresh_token",
//         }),
//       }
//     );
//     createCookie(await response.json());
//   } finally {
//   }
// }

// async function handleFetchUserData() {
//   const tokens = await getCookie();
//   try {
//     fetch(`http://localhost:8000/api/yahooAuth/user`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ accessToken: tokens.accessToken }),
//     })
//       .then((response) => {
//         return response.text();
//       })
//       .then((str) => {
//         const parser = new DOMParser();
//         const xml = parser.parseFromString(str, "application/xml");

//         // Print the XML
//         const xmlData = new XMLSerializer().serializeToString(xml);
//         parseString(xmlData, function (err, result) {
//           console.log(result);
//         });
//       });
//   } finally {
//   }
// }

// async function handleFetchUserInfo() {
//   const tokens = await getCookie();
//   try {
//     fetch(`http://localhost:8000/api/yahooAuth/user-info`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ accessToken: tokens.accessToken }),
//     }).then(async (response) => {
//       console.log(await response.json());
//     });
//   } finally {
//   }
// }

// async function handleFetchLeagueData() {
//   const tokens = await getCookie();
//   try {
//     fetch(`http://localhost:8000/api/yahooAuth/nfl-league`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         accessToken: tokens.accessToken,
//         leagueId: 210594,
//       }),
//     })
//       .then((response) => {
//         return response.text();
//       })
//       .then((str) => {
//         const parser = new DOMParser();
//         const xml = parser.parseFromString(str, "application/xml");

//         // Print the XML
//         const xmlData = new XMLSerializer().serializeToString(xml);
//         parseString(xmlData, function (err, result) {
//           console.log(result);
//         });
//       });
//   } finally {
//   }
// }
