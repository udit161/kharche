import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "";

export default function GoogleAuthButton() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const buttonContainerRef = useRef(null);
  const initialized = useRef(false);

  const handleCredentialResponse = useCallback(
    async (response) => {
      if (!response?.credential) return;

      setError("");

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken: response.credential }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Google sign-in failed");
        }

        localStorage.setItem("token", data.token);
        navigate("/");
      } catch (err) {
        setError(err.message || "Google sign-in failed. Please try again.");
      }
    },
    [navigate],
  );

  useEffect(() => {
    const initGoogleAuth = async () => {
      if (initialized.current) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/google-client-id`);
        const data = await res.json();

        if (data.clientId && window.google?.accounts?.id && buttonContainerRef.current) {
          window.google.accounts.id.initialize({
            client_id: data.clientId,
            callback: handleCredentialResponse,
          });
          
          window.google.accounts.id.renderButton(
            buttonContainerRef.current,
            { theme: "outline", size: "large", width: 400, text: "continue_with" }
          );
          initialized.current = true;
        }
      } catch (err) {
        setError("Google sign-in is unavailable right now.");
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleAuth();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleAuth;
    document.body.appendChild(script);

  }, [handleCredentialResponse]);

  return (
    <>
      {error && <div className="auth-error animate-in">{error}</div>}
      <div 
        ref={buttonContainerRef} 
        style={{ display: 'flex', justifyContent: 'center', width: '100%', minHeight: '44px' }}
      ></div>
    </>
  );
}
