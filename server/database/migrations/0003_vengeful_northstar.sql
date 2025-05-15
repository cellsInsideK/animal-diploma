CREATE TABLE "walking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "order_status" DEFAULT 'process' NOT NULL,
	"type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"tel" varchar(20) NOT NULL,
	"animalType" varchar NOT NULL,
	"date" varchar,
	"time" varchar,
	"comment" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
