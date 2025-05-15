CREATE TABLE "groomin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "order_status" DEFAULT 'process' NOT NULL,
	"name" varchar NOT NULL,
	"tel" varchar(20) NOT NULL,
	"animalType" varchar NOT NULL,
	"breed" varchar NOT NULL,
	"age" varchar NOT NULL,
	"comment" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "grooming_Reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"rating" integer NOT NULL,
	"description" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "grooming_Reviews" ADD CONSTRAINT "grooming_Reviews_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;