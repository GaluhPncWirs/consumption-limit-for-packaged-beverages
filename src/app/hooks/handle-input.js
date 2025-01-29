import { useState } from "react";

export function useHandleInput(initState) {
  const [mustFilled, setMustFilled] = useState(initState);

  function handleValueInput(event) {
    const { id, value, type, checked } = event.target;
    if (type === "radio") {
      return setMustFilled({ ...mustFilled, [id]: checked ? value : "" });
    } else {
      return setMustFilled({ ...mustFilled, [id]: value });
    }
  }

  function isFormFilled() {
    return Object.values(mustFilled).every((str) => str !== "");
  }

  return { mustFilled, handleValueInput, isFormFilled, setMustFilled };
}
