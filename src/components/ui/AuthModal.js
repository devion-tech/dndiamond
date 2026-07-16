import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import * as yup from "yup";
import { useStore } from "@/context/StoreContext";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function AuthModal() {
  const { loginUser, registerUser, authModalOpen, closeModal } = useStore();
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [fields, setFields] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = async (name, schema) => {
    try {
      await schema.validateAt(name, fields);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    try {
      await loginSchema.validate(fields, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fieldErrors = {};
      err.inner.forEach((e) => {
        fieldErrors[e.path] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setAuthLoading(true);
    try {
      const data = await loginUser(fields.email, fields.password);
      if (data && data.success) {
        setAuthSuccess("Vault access granted. Welcome.");
        setTimeout(() => {
          closeModal(false);
          setAuthSuccess("");
          setFields({ email: "", password: "", name: "", phone: "" });
        }, 1000);
      } else {
        setAuthError(data?.message || "Invalid email or password.");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    try {
      await registerSchema.validate(fields, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fieldErrors = {};
      err.inner.forEach((e) => {
        fieldErrors[e.path] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setAuthLoading(true);
    try {
      const data = await registerUser(
        fields.name,
        fields.email,
        fields.phone,
        fields.password,
      );
      if (data && data.success) {
        setAuthSuccess("Profile registered successfully. Please sign in.");
        setTimeout(() => {
          setAuthMode("login");
          setAuthSuccess("");
          setFields({ email: "", password: "", name: "", phone: "" });
        }, 1500);
      } else {
        setAuthError(
          data?.message || "Registration failed. Please check inputs.",
        );
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full border bg-neutral-50 px-3 py-2 text-xs focus:outline-none focus:ring-1 transition-all ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-neutral-200 focus:ring-neutral-950"
    }`;

  return (
    <>
      {authModalOpen && (
        <>
          <div
            onClick={() => closeModal(false)}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 transition-opacity duration-300"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md p-8 shadow-2xl z-50 rounded-xs border border-neutral-100 text-left animate-fade-in font-sans">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-6">
              <span className="text-xs font-bold tracking-[0.25em] text-neutral-800 uppercase">
                {authMode === "login" ? "Sign In" : "Register Profile"}
              </span>
              <button
                onClick={() => closeModal(false)}
                className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"
                aria-label="Close Auth Modal"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-xs">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded-xs">
                {authSuccess}
              </div>
            )}

            {authMode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={fields.email}
                    onChange={handleChange}
                    onBlur={() => validateField("email", loginSchema)}
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={fields.password}
                    onChange={handleChange}
                    onBlur={() => validateField("password", loginSchema)}
                    className={inputClass("password")}
                  />
                  {errors.password && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-neutral-950 hover:bg-neutral-900 text-white text-[10px] font-bold py-3 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? "Verifying..." : "Access Vault"}
                </button>
                <div className="text-center pt-3 border-t border-neutral-100">
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
                    New to Atelier?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setAuthError("");
                      setErrors({});
                    }}
                    className="ml-1 text-[9px] text-neutral-800 hover:underline uppercase tracking-wider font-extrabold"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={fields.name}
                    onChange={handleChange}
                    onBlur={() => validateField("name", registerSchema)}
                    className={inputClass("name")}
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={fields.email}
                    onChange={handleChange}
                    onBlur={() => validateField("email", registerSchema)}
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={fields.phone}
                    onChange={handleChange}
                    onBlur={() => validateField("phone", registerSchema)}
                    className={inputClass("phone")}
                  />
                  {errors.phone && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={fields.password}
                    onChange={handleChange}
                    onBlur={() => validateField("password", registerSchema)}
                    className={inputClass("password")}
                  />
                  {errors.password && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-neutral-950 hover:bg-neutral-900 text-white text-[10px] font-bold py-3 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? "Creating..." : "Register Vault"}
                </button>
                <div className="text-center pt-3 border-t border-neutral-100">
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
                    Already registered?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError("");
                      setErrors({});
                    }}
                    className="ml-1 text-[9px] text-neutral-800 hover:underline uppercase tracking-wider font-extrabold"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default AuthModal;
