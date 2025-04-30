CREATE TYPE "public"."order_status" AS ENUM('process', 'completed', 'accepted', 'canceled');--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "status" "order_status" DEFAULT 'process' NOT NULL;