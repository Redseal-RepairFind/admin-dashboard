// "use client";

// import { useState, useEffect } from "react";
// import { customers } from "../api/customers";

// function useTrx() {
//   const [data, setData] = useState();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     async function getTrx() {
//       try {
//         const data = await customers.getTrx({});

//         setData(data);
//       } catch (err: any) {
//         console.error(err);
//         // handle error here
//       } finally {
//         setLoading(false);
//       }
//     }

//     getTrx();
//   }, []);

//   return { data, loading };
// }

// export default useTrx;
