import React from "react";
import { ErrorMessage, useField } from "formik";
import { Alert } from "@mui/material";
import { MdOutlineError } from "react-icons/md";
const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="w-full">
      <label
        htmlFor={field.name}
        className="max-sm:text-[1.4rem] text-[1.6rem] font-[700] text-[#4F4F4F] mb-[0.75rem] block"
      >
        {label}
      </label>
      <input
        className={`max-sm:py-[.75rem]  focus:border-b-[3px] focus:border-solid  outline-none border-none w-full bg-[#f2f2f2] py-[1.25rem] px-[1.75rem] rounded-[4px] text-[1.5rem] font-[300] duration-[.1s] transition-all text-inherit ${
          meta.touched && meta.error && "errorInput"
        } ${!meta.error && "focus:border-b-primary"}`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && (
        <div className=" flex items-center text-[red]">
          <span className="text-[2.2rem]">
            <MdOutlineError />
          </span>
          <ErrorMessage component="div" name={field.name} className="err" />
        </div>
      )}
    </div>
  );
};

export default TextField;
