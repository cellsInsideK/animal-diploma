ALTER TABLE "order_items" ALTER COLUMN "order_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "order_id" SET NOT NULL;