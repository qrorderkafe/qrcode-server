import type { ReportWhereInput } from "../../types";
import * as respository from "../repository/report";

export async function getReports(
  startDate?: string,
  endDate?: string,
  sortBy?: string,
  sortReport?: string
) {
  const where: ReportWhereInput = {
    AND: [],
  };

  if (startDate && endDate) {
    where.AND?.push({
      created_at: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    });
  }

  const reports = await respository.findReports(
    where,
    sortBy,
    sortReport as "asc" | "desc"
  );

  return reports;
}
