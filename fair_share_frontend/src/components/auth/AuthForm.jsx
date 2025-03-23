import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ToastProperty } from "../../lib/config";
import { login, signUp } from "../../api/authApi";

export const AuthForm = () => {
  const [mode, setMode] = useState("signin");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: mode === "signup" ? Yup.string().required("Name is required") : Yup.string(),
    contactNumber: mode === "signup" ? Yup.string().required("Contact Number is required") : Yup.string(),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", contactNumber: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (mode === "signin") {
          response = await login(values);
          if (response.success) {
            formik.resetForm();
            localStorage.setItem('loginData', JSON.stringify(response.userData));
            toast.success(response.message, ToastProperty)
            navigate("/dashboard");
          } else {
            toast.error(response.message, ToastProperty)
          }
        } else {
          response = await signUp(values);
          if (response.success) {
            formik.resetForm();
            toast.success(response.message, ToastProperty)
            setMode("signin")
          } else {
            toast.error(response.message, ToastProperty)
          }
        }
      } catch (error) {
        console.log("Error in signUp/login");
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="space-y-6 bg-card shadow-sm rounded-lg p-8 border">
        <div className="space-y-2 text-center">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto bg-primary text-primary-foreground p-2 rounded-md w-12 h-12 flex items-center justify-center mb-4"
          >
            <span className="text-xl font-bold">FS</span>
          </motion.div>

          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signin"
              ? "Enter your email to sign in to your account"
              : "Enter your information to create an account"}
          </p>
        </div>

        {/* Form using Formik */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === "signup" && (
              <>
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    {...formik.getFieldProps("name")}
                    className="focus-ring"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                  )}
                </motion.div>
                <motion.div
                  key="contact-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    placeholder="Enter Contact Number"
                    {...formik.getFieldProps("contactNumber")}
                    className="focus-ring"
                  />
                  {formik.touched.contactNumber && formik.errors.contactNumber && (
                    <p className="text-red-500 text-sm">{formik.errors.contactNumber}</p>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
              className="focus-ring"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "signin" && (
                <Button type="button" variant="link" className="px-0 h-auto font-normal text-xs">
                  Forgot password?
                </Button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder={mode === "signin" ? "Enter Password" : "Create a password"}
              {...formik.getFieldProps("password")}
              className="focus-ring"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              <>{mode === "signin" ? "Sign in" : "Create account"}</>
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <Button
            type="button"
            variant="link"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="p-0 h-auto font-normal"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
