export type LogStatus = 'SUCCESS' | 'FAILED';

export interface LogEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  module: string;
  details: string;
  ip: string;
  timestamp: Date;
  status: LogStatus;
}

export interface LogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export interface LogsResponse {
  success: boolean;
  data: {
    logs: LogEntry[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateLogRequest {
  action: string;
  module: string;
  details: string;
  userId: string;
  username: string;
  ip?: string;
  status?: LogStatus;
}

export interface CreateLogResponse {
  success: boolean;
  data: LogEntry & { id: string };
}
