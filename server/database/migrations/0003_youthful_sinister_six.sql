CREATE TABLE "adoptionRequests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"tel" varchar(20) NOT NULL,
	"animalId" uuid
);
--> statement-breakpoint
ALTER TABLE "adoptionRequests" ADD CONSTRAINT "adoptionRequests_animalId_adoptions_id_fk" FOREIGN KEY ("animalId") REFERENCES "public"."adoptions"("id") ON DELETE cascade ON UPDATE no action;