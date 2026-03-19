import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export const ProgressBar = ({ progress, status }) => {
  const { themeConfig } = useTheme();
  let color = themeConfig.progressBarFill;
  if (status === "failed" || status === "error") color = themeConfig.progressBarError;
  if (status === "complete") color = themeConfig.progressBarSuccess;

  return (
    <div className={`w-full rounded-full h-2.5 overflow-hidden ${themeConfig.progressBarBase}`}>
      <motion.div
        className={`h-2.5 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "linear", duration: 0.3 }}
      />
    </div>
  );
};
