import { getPriorityClassName } from "../utils/formatters";

const PriorityBadge = ({ priority }) => {
  return <span className={`badge-pill ${getPriorityClassName(priority)}`}>{priority || "FYI"}</span>;
};

export default PriorityBadge;
