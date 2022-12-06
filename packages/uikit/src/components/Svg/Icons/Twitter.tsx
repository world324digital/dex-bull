import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 32 32" {...props}>
      <circle cx="16" cy="16" r="16" fill="#282827" />
      <path d="M24.4798 11.92C23.9198 12.16 23.2798 12.32 22.6398 12.4C23.2798 12 23.8398 11.36 24.0798 10.64C23.4398 11.04 22.7998 11.28 21.9998 11.44C21.4398 10.8 20.5598 10.4 19.6798 10.4C17.9198 10.4 16.4798 11.84 16.4798 13.6C16.4798 13.84 16.4798 14.08 16.5598 14.32C13.9198 14.16 11.5198 12.88 9.9198 10.96C9.6798 11.44 9.5198 12 9.5198 12.56C9.5198 13.68 10.0798 14.64 10.9598 15.2C10.3998 15.2 9.9198 15.04 9.5198 14.8C9.5198 16.32 10.6398 17.68 12.0798 17.92C11.8398 18 11.5198 18 11.1998 18C10.9598 18 10.7998 18 10.5598 17.92C10.9598 19.2 12.1598 20.16 13.5998 20.16C12.4798 21.04 11.1198 21.52 9.5998 21.52C9.3598 21.52 9.1198 21.52 8.7998 21.44C10.2398 22.32 11.9198 22.88 13.7598 22.88C19.6798 22.88 22.8798 18 22.8798 13.76V13.36C23.5198 13.12 24.0798 12.56 24.4798 11.92Z" fill="#9E9C9C" />
    </Svg>
  );
};

export default Icon;
