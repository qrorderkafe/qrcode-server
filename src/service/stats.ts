import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { id } from "date-fns/locale";
import {
  getCompletedOrdersCountByDate,
  getOrdersCountByDate,
  getTotalOrderCount,
  statusOrdersCount,
} from "../repository/order";
import {
  getSalesReportByDate,
  getSalesReportCount,
} from "../repository/report";

export const getStats = async () => {
  const today = new Date();
  const yesterday = subDays(today, 1);

  const processingOrders = await statusOrdersCount("PROCESSING");
  const totalSalesReport = await getSalesReportCount();
  const totalOrdersCount = await getTotalOrderCount();
  const completedOrders = await statusOrdersCount("COMPLETED");

  const todaySalesReport = await getSalesReportByDate(
    startOfDay(today),
    endOfDay(today)
  );
  const yesterdaySalesReport = await getSalesReportByDate(
    startOfDay(yesterday),
    endOfDay(yesterday)
  );

  const salesChangePercentage =
    yesterdaySalesReport?.income && todaySalesReport?.income
      ? (
          ((todaySalesReport.income - yesterdaySalesReport.income) /
            yesterdaySalesReport.income) *
          100
        ).toFixed(1)
      : 0;

  const todayOrders = await getOrdersCountByDate(
    startOfDay(today),
    endOfDay(today)
  );

  const yesterdayOrders = await getOrdersCountByDate(
    startOfDay(yesterday),
    endOfDay(yesterday)
  );

  const ordersChangePercentage =
    yesterdayOrders && todayOrders
      ? (((todayOrders - yesterdayOrders) / yesterdayOrders) * 100).toFixed(1)
      : 0;

  const todayCompletedOrders = await getCompletedOrdersCountByDate(
    startOfDay(today),
    endOfDay(today)
  );

  const yesterdayCompletedOrders = await getCompletedOrdersCountByDate(
    startOfDay(yesterday),
    endOfDay(yesterday)
  );

  const completedOrdersChangePercentage = yesterdayCompletedOrders
    ? (
        ((todayCompletedOrders - yesterdayCompletedOrders) /
          yesterdayCompletedOrders) *
        100
      ).toFixed(1)
    : 0;

  return {
    totalSales: totalSalesReport._sum.income || 0,
    salesChangePercentage,
    totalOrders: totalOrdersCount,
    ordersChangePercentage,
    completedOrders,
    completedOrdersChangePercentage,
    processingOrders,
  };
};

export const getWeeklySales = async () => {
  const today = new Date();
  const weeklyData = [];

  const dailyTranslate = {
    Sun: "Min",
    Mon: "Sen",
    Tue: "Sel",
    Wed: "Rab",
    Thu: "Kam",
    Fri: "Jum",
    Sat: "Sab",
  };

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const salesReport = await getSalesReportByDate(dayStart, dayEnd);

    const dayName = format(date, "EEE", {
      locale: id,
    });

    const localedDayName =
      dailyTranslate[dayName as keyof typeof dailyTranslate] || dayName;

    weeklyData.push({
      day: localedDayName,
      sales: salesReport?.income || 0,
    });
  }

  return weeklyData;
};
