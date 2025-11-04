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

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    const verifyOrLogin = async () => {
      try {
        const { data } = await users.current();

        if (userId && data.user._id === userId) {
          navigate(redirect, { replace: true });
          return;
        }
      } catch (err) {}

      if (token) {
        try {
          const { data } = await users.magicLogin({ key: token });
          login(data.user);
          navigate(redirect, { replace: true });
        } catch (err) {
          navigate("/", { replace: true });
        }
      } else {
        navigate("/", { replace: true });
      }
    };

    verifyOrLogin();
  }, [token, redirect, userId, login, navigate]);

  return <Loading message="Redirecting..." />;
};

export default MagicLogin;
