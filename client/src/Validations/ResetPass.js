import * as Yup from "yup";
const ResetPass = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 charaters")
    .required("Password is required"),
  passwordConfirm: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Confirm Password must match New Password"
    )
    .required("Confirm password is required"),
});
export default ResetPass;
