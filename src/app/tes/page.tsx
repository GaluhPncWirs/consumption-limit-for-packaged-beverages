"use client";
import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Hapus spasi di awal & akhir
    const trimmedValue = newValue.trim();

    // Jika string kosong setelah trim (hanya spasi), tidak valid
    if (trimmedValue === "") {
      setIsValid(false);
      return;
    }

    // Periksa apakah seluruh string hanya mengandung huruf & spasi
    const isMatching = /^[A-Za-z ]*$/.test(trimmedValue);
    setIsValid(isMatching);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Masukkan hanya huruf"
      />
      <p>{isValid ? "✅ Valid" : "❌ Tidak Valid"}</p>
    </div>
  );
}

export default App;
