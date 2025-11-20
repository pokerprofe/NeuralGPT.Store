(function () {
  function qs(id) {
    return document.getElementById(id);
  }

  function setMessage(id, text, isError) {
    const el = qs(id);
    if (!el) return;
    el.textContent = text || "";
    el.className = "auth-message" + (isError ? " error" : " ok");
  }

  function getRecaptchaToken() {
    const el = document.querySelector('textarea[name="g-recaptcha-response"]');
    if (!el) return null;
    const value = String(el.value || "").trim();
    return value || null;
  }

  async function api(path, body) {
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    };

    const res = await fetch(path, opts);
    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      throw new Error("Invalid response from server");
    }
    if (!res.ok || !data || data.ok === false) {
      throw new Error((data && data.message) || "Request failed");
    }
    return data;
  }

  async function handleRegister(e) {
    e.preventDefault();

    const email = (qs("regEmail") && qs("regEmail").value || "").trim();
    const nick = (qs("regNick") && qs("regNick").value || "").trim();

    if (!email || !nick) {
      setMessage("registerMessage", "Email and nickname are required.", true);
      return;
    }

    const recaptchaToken = getRecaptchaToken();
    if (!recaptchaToken) {
      setMessage("registerMessage", "Please complete the reCAPTCHA.", true);
      return;
    }

    try {
      const payload = { email, nick, recaptchaToken };
      const data = await api("/api/auth/register", payload);
      console.log("Register:", data);
      setMessage("registerMessage", "Account created. You can now login.", false);
    } catch (err) {
      setMessage("registerMessage", err.message, true);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    const email = (qs("loginEmail") && qs("loginEmail").value || "").trim();

    if (!email) {
      setMessage("loginMessage", "Email is required.", true);
      return;
    }

    const recaptchaToken = getRecaptchaToken();
    if (!recaptchaToken) {
      setMessage("loginMessage", "Please complete the reCAPTCHA.", true);
      return;
    }

    try {
      const payload = { email, recaptchaToken };
      const data = await api("/api/auth/login", payload);

      const token = data.token;
      const user = data.user;

      if (token) {
        window.localStorage.setItem("neural_user_token", token);
      }
      if (user) {
        window.localStorage.setItem("neural_user_email", user.email || "");
        window.localStorage.setItem("neural_user_nick", user.nick || "");
      }

      setMessage("loginMessage", "Logged in. Session started.", false);
      renderStatus();
    } catch (err) {
      setMessage("loginMessage", err.message, true);
    }
  }

  async function fetchMe() {
    const token = window.localStorage.getItem("neural_user_token");
    if (!token) return null;

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "x-user-token": token }
      });
      const data = await res.json();
      if (!res.ok || !data || !data.ok) {
        return null;
      }
      return data.user || null;
    } catch (err) {
      return null;
    }
  }

  async function renderStatus() {
    const box = qs("userStatus");
    if (!box) return;

    const user = await fetchMe();
    if (!user) {
      box.textContent = "No active session.";
      return;
    }

    box.textContent =
      "Logged as " +
      (user.nick || user.email) +
      " (" +
      (user.role || "user") +
      ")";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const regForm = qs("registerForm");
    if (regForm) {
      regForm.addEventListener("submit", handleRegister);
    }

    const loginForm = qs("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin);
    }

    renderStatus();
  });
})();
