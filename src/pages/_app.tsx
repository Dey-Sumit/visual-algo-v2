import Sidebar from "@components/layouts/Sidebar";
import "@styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex h-screen font-serif bg-gray-900 text-gray-50">
      <Sidebar />
      <div className="flex-1 h-full">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
