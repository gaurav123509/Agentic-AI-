export const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const getPriorityClassName = (priority) => {
  if (priority === "Urgent") {
    return "bg-coral/10 text-coral";
  }

  if (priority === "Requires Action") {
    return "bg-sun/30 text-ink";
  }

  return "bg-sea/10 text-sea";
};

export const buildPriorityChartData = (emails = []) => {
  const priorityMap = emails.reduce(
    (accumulator, email) => {
      const key = email.priority || "FYI";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    },
    {
      Urgent: 0,
      "Requires Action": 0,
      FYI: 0,
    }
  );

  return Object.entries(priorityMap).map(([name, count]) => ({
    name,
    count,
  }));
};
