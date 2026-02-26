import React, { useEffect, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Loading from "../components/Loading";
import { users } from "../utils/apiendpoints";
import { AuthContext } from "../store/AuthContext";

const MagicLogin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { token, userId } = useParams();
  const [searchParams] = useSearchParams();

  const rawRedirect = searchParams.get("redirect");
  const redirect =
    rawRedirect && rawRedirect.startsWith("/") ? rawRedirect : "/";

  useEffect(() => {
    let isMounted = true;

    const verifyOrLogin = async () => {
      try {
        const data = await users.current();

        if (!isMounted) return;

        if (userId && data?.user?._id === userId) {
          navigate(redirect, { replace: true });
          return;
        }
      } catch (error) {
        console.log(".....API ERROR.....", error);
      }

      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const data = await users.magicLogin({ key: token });

        if (!isMounted) return;

        login(data.user);
        navigate(redirect, { replace: true });
      } catch (error) {
        console.log(".....API ERROR.....", error);
        if (!isMounted) return;
        navigate("/", { replace: true });
      }
    };

    verifyOrLogin();

    return () => {
      isMounted = false;
    };
  }, [token, redirect, userId, login, navigate]);

  return <Loading message="Redirecting..." />;
};

export default MagicLogin;
