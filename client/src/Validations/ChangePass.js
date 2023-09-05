import * as Yup from "yup";
const ChangePassValidate = Yup.object({
  Currentpassword: Yup.string()
    .min(6, "Current Password must be at least 6 charaters")
    .required("Current Password is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 charaters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Confirm Password must match New Password"
    )
    .required("Confirm password is required"),
});
export default ChangePassValidate;
