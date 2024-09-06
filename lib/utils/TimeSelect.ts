import {
  format,
  subDays,
  startOfYear,
  subMonths,
  subHours,
  isBefore,
} from "date-fns";

// 定义时间范围
export const times = [
  { key: "D", label: "Last 24 hours" },
  { key: "W", label: "Last 7 days" },
  { key: "M", label: "Last 30 days" },
  { key: "T", label: "Last 3 months" },
  { key: "Y", label: "Year to Date" },
  { key: "L", label: "Last 12 months" },
  { key: "A", label: "All Time" },
] as const; // 使用 as const 以确保类型安全

// 获取当前日期
const now = new Date();

// 修正时间范围计算
const getDateRange = (interval: string) => {
  switch (interval) {
    case "D":
      return { startDate: subHours(now, 24), endDate: now };
    case "W":
      return { startDate: subDays(now, 7), endDate: now };
    case "M":
      return { startDate: subDays(now, 30), endDate: now };
    case "T":
      return { startDate: subDays(now, 90), endDate: now };
    case "Y":
      return { startDate: startOfYear(now), endDate: now };
    case "L":
      return { startDate: subMonths(now, 12), endDate: now };
    case "A":
      return { startDate: new Date(0), endDate: now };
    default:
      return { startDate: subHours(now, 24), endDate: now };
  }
};

// 修正日期格式化
export const formatDateRange = (value: string | number, interval: string) => {
  const date = new Date(value);
  const { startDate, endDate } = getDateRange(interval);

  // 验证日期是否在范围内
  if (!isBefore(date, endDate) || !isBefore(startDate, date)) {
    return "";
  }

  // 根据 interval 格式化日期
  switch (interval) {
    case "D":
      return format(date, "yyyy-MM-dd HH:mm"); // 显示小时和分钟
    case "W":
    case "M":
    case "T":
      return format(date, "yyyy-MM-dd"); // 显示日期
    case "Y":
      return format(date, "yyyy-MM"); // 显示年和月
    case "L":
    case "A":
      return format(date, "yyyy MM"); // 显示月份和年份
    default:
      return format(date, "yyyy-MM-dd HH:mm"); // 默认显示小时和分钟
  }
};
