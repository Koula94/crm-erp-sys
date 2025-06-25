export const ContactCategory = {
  PARTNER: 'PARTNER',
  CLIENT: 'CLIENT',
  PROSPECT: 'PROSPECT',
  VENDOR: 'VENDOR',
} as const;

export const ContactStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PROSPECT: 'PROSPECT',
} as const;

export const LeadStage = {
  PROSPECT: 'PROSPECT',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  CLOSED_WON: 'CLOSED_WON',
  CLOSED_LOST: 'CLOSED_LOST',
} as const;

export const CommunicationType = {
    CALL: 'CALL',
    EMAIL: 'EMAIL',
    MEETING: 'MEETING',
    NOTE: 'NOTE',
} as const;

export const ProjectStatus = {
    PLANNING: 'PLANNING',
    IN_PROGRESS: 'IN_PROGRESS',
    ON_HOLD: 'ON_HOLD',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const;

export const QuoteStatus = {
    DRAFT: 'DRAFT',
    SENT: 'SENT',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
} as const;