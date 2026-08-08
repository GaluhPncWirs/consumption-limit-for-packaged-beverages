import {
  Accessibility,
  Armchair,
  Bike,
  Dumbbell,
  Footprints,
} from "lucide-react";

export const activityLevels = [
  {
    value: "sedentary",
    label: "Tidak Aktif",
    description: "tidak melakukan aktivitas berat",
    icon: Armchair,
  },
  {
    value: "lightlyActive",
    label: "Aktif Ringan",
    description: "olahraga 1-3 hari/minggu",
    icon: Footprints,
  },
  {
    value: "moderatelyActive",
    label: "Cukup Aktif",
    description: "olahraga 3-5 hari/minggu",
    icon: Accessibility,
  },
  {
    value: "veryActive",
    label: "Sangat Aktif",
    description: "olahraga 6-7 hari/minggu",
    icon: Bike,
  },
  {
    value: "extraActive",
    label: "Extra Aktif",
    description: "olahraga berat / pekerjaan fisik",
    icon: Dumbbell,
  },
];
