import { motion } from "framer-motion";
import Illustration from "./Illustration.js";

interface Props {
  size?: number;
  className?: string;
}

export default function RobotMascot({ size = 120, className }: Props) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      <Illustration name="robot" width={size} height={size} />
    </motion.div>
  );
}
