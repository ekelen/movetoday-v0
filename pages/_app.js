import "../styles/globals.css";
// import "../styles/mvp.css";

let n = 0;

function MyApp({ Component, pageProps }) {
  n++;
  console.log("My app: ", n);
  return <Component {...pageProps} />;
}

export default MyApp;
