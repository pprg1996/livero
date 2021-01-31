import React from "react";

export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: Function) => {
  const handleClick = (e: MouseEvent) => {
    if (ref?.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};
