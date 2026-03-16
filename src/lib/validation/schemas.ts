import { z } from 'zod';

// ─── Push Notifications ───────────────────────────────────────────────────────

export const PushSubscriptionSchema = z.object({
  endpoint: z.string().url('endpoint deve ser uma URL válida'),
  keys: z.object({
    p256dh: z.string().min(1, 'p256dh é obrigatório'),
    auth: z.string().min(1, 'auth é obrigatório'),
  }),
});

export const PushSubscribeBodySchema = z.object({
  subscription: PushSubscriptionSchema,
  userId: z.string().uuid().optional(),
});

export const PushUnsubscribeBodySchema = z.object({
  endpoint: z.string().url('endpoint deve ser uma URL válida'),
});

export const AdminPushBodySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  body: z.string().min(1, 'Corpo é obrigatório').max(1000),
});

export const AdminPushTestBodySchema = z.object({
  subscription: PushSubscriptionSchema,
  title: z.string().max(200).optional(),
  body: z.string().max(1000).optional(),
});

// ─── Support Tickets ──────────────────────────────────────────────────────────

const TICKET_CATEGORIES = ['tecnico', 'cobranca', 'conteudo', 'sugestao', 'outro'] as const;
const TICKET_STATUSES = ['aberto', 'aguardando', 'resolvido', 'fechado'] as const;

export const CreateTicketBodySchema = z.object({
  subject: z.string().min(1, 'Assunto é obrigatório').max(300),
  category: z.enum(TICKET_CATEGORIES).default('outro'),
  message: z.string().min(1, 'Mensagem é obrigatória').max(5000),
});

export const AddTicketMessageBodySchema = z.object({
  message: z.string().min(1, 'Mensagem não pode estar vazia').max(5000),
});

export const UpdateTicketStatusBodySchema = z.object({
  status: z.enum(TICKET_STATUSES),
});

// ─── Hotmart Webhook ──────────────────────────────────────────────────────────

export const HotmartWebhookPayloadSchema = z.object({
  id: z.string(),
  creation_date: z.number(),
  event: z.string(),
  version: z.string(),
  data: z.object({
    product: z.object({
      id: z.union([z.string(), z.number()]),
      name: z.string(),
    }).optional(),
    purchase: z.object({
      transaction: z.string(),
      order_date: z.string().optional(),
      approved_date: z.string().optional(),
      status: z.string(),
      payment: z.object({
        value: z.number(),
        currency_value: z.string(),
        type: z.string(),
      }).optional(),
    }).optional(),
    buyer: z.object({
      name: z.string(),
      email: z.string().email(),
    }).optional(),
    subscription: z.object({
      subscriber: z.object({
        code: z.string(),
      }).optional(),
      plan: z.object({
        name: z.string(),
      }).optional(),
      status: z.string().optional(),
    }).optional(),
  }),
});

export type HotmartWebhookPayload = z.infer<typeof HotmartWebhookPayloadSchema>;

// ─── Helper: resposta padronizada de erro de validação ────────────────────────

export function zodErrorResponse(error: z.ZodError) {
  const messages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
  return { error: 'Dados inválidos', details: messages };
}
