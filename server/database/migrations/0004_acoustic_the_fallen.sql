ALTER TABLE "adoptions" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "adoptions" ADD COLUMN "updated_at" timestamp DEFAULT now();