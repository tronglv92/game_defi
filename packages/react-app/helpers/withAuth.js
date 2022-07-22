import { useRouter } from "next/router";
import { LOGIN_PATH } from "../constants/path";
import { getAuth } from "./local";
const withAuth = WrappedComponent => {
  return props => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const auth = getAuth();
      // const accessToken = localStorage.getItem("accessToken");

      // // If there is no access token we redirect to "/" page.
      if (!auth) {
        return (
          <div className="flex h-12 bg-red-500">
            <span className="text-white text-3xl mx-auto">401 UnAuthen</span>
          </div>
        );
      }

      // If this is an accessToken we just render the component that was passed with all its props

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default withAuth;
