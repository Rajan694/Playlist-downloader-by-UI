import { motion } from "framer-motion";

export const ProgressBar = ({ progress, status }) => {
  let color = "bg-accent-main";
  if (status === "failed" || status === "error") color = "bg-red-500";
  if (status === "complete") color = "bg-green-500";

  return (
    <div className="w-full bg-base-strong rounded-full h-2.5 overflow-hidden">
      <motion.div
        className={`h-2.5 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "linear", duration: 0.3 }}
      />
    </div>
  );
};
