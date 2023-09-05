import * as Yup from "yup";
const validFileExtensions = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp"],
};

function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
}
const UserUpdateValidate = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Must be at least 3 characters")
    .max(15, "Must be 15 characters or less"),
  email: Yup.string().email("Email is invalid"),
});
export default UserUpdateValidate;
