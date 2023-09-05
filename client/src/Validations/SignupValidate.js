import * as Yup from "yup";
const SignupValidate = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Must be at least 3 characters")
    .max(15, "Must be 15 characters or less")
    .required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 charaters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password must match")
    .required("Confirm password is required"),
});
export default SignupValidate;
