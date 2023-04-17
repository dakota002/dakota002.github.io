import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Main from "./pages/Main";
import Music from "./pages/Music";

const ROUTE = process.env.REACT_APP_LIBRARY;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/music",
    element: <Music />,
    loader: async ({ params, request }) => {
      const requestParams = new URL(request.url).searchParams.get("songName");
      if (requestParams) {
        const ctx = new AudioContext();
        let audio;
        await fetch(`http://${ROUTE}/audio/${requestParams}`)
          .then((data) => data.arrayBuffer())
          .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
          .then((decodedAudio) => {
            audio = decodedAudio;
          });
        console.log("Returning Data:");
        return audio;
      } else {
        return fetch(`http://${ROUTE}/lookup/AudioOptions/`);
      }
    },
  },
]);

function App() {
  return (
    <div className="App">
      <Header />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
