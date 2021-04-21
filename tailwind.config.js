module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: "464px",
      sm: "640px",
      md: "720px",
      lg: "1024px",
      xl: "1280px",
    },
    height: {
      overflow: "1000px"
    },
    textColor: {
      "mg-10": "#12A400",
      "mg-9": "#14BB00",
      "mg-8": "#85D90C",
      "mg-7": "#A6E704",
      "mg-6": "#C8E602",
      "mg-5": "#ECED05",
      "mg-4": "#FFE31B",
      "mg-3": "#FFB902",
      "mg-2": "#FF7F02",
      "mg-1": "#FF4C02",
      "mg-0": "#FF1600",
    },
    fontSize: {
      fontSize: {
        '2xl': '1.75rem',
      },
    },
    extend: {
      zIndex: {
        "-10": "-10",
        "-9": "-9",
        "-8": "-8",
        "-7": "-7",
        "-6": "-6",
        "-5": "-5",
        "-4": "-4",
        "-3": "-3",
        "-2": "-2",
        "-1": "-1",
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
      },
      strokeWidth: {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "11": "11",
        "12": "12",
        "13": "13",
        "14": "14",
        "15": "15",
      },
    },
  },
  variants: {
    extend: {
      padding: ["hover"],
      margin: ["first"], 
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
}
