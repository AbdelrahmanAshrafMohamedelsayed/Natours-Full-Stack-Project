import * as Yup from "yup";
const ForgetPass = Yup.object({
  email: Yup.string().email("Email is invalid").required("Email is required"),
});
export default ForgetPass;
