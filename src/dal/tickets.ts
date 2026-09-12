import { db, Ticket, NewTicket } from '../db/database.js';

export interface GetTicketsOptions {
  limit?: number;
  offset?: number;
  status?: string;
}

export async function getAllTickets(
  optionsOrLimit?: GetTicketsOptions | number,
  offset?: number,
  status?: string,
): Promise<Ticket[]> {
  let limitValue: number | undefined;
  let offsetValue: number | undefined;
  let statusValue: string | undefined;

  if (typeof optionsOrLimit === 'object' && optionsOrLimit !== null) {
    limitValue = optionsOrLimit.limit;
    offsetValue = optionsOrLimit.offset;
    statusValue = optionsOrLimit.status;
  } else {
    limitValue = optionsOrLimit;
    offsetValue = offset;
    statusValue = status;
  }

  let query = db.selectFrom('tickets').selectAll();

  if (statusValue) {
    query = query.where('status', '=', statusValue);
  }
  if (limitValue !== undefined) {
    query = query.limit(limitValue);
  }
  if (offsetValue !== undefined) {
    query = query.offset(offsetValue);
  }

  return await query.orderBy('id', 'asc').execute();
}

export async function getTicketById(id: number): Promise<Ticket | undefined> {
  return await db
    .selectFrom('tickets')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
}

export async function createTicket(ticket: NewTicket): Promise<Ticket> {
  return await db
    .insertInto('tickets')
    .values(ticket)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateTicketStatus(
  id: number,
  status: string,
): Promise<Ticket | undefined> {
  return await db
    .updateTable('tickets')
    .set({ status, updated_at: new Date() })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
}
