CREATE TYPE "public"."chat_type" AS ENUM('direct', 'group');--> statement-breakpoint
CREATE TYPE "public"."participant_role" AS ENUM('admin', 'participant');--> statement-breakpoint
CREATE TYPE "public"."message_state" AS ENUM('sent', 'delivered', 'seen');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('text', 'image', 'video', 'file');--> statement-breakpoint
CREATE TABLE "chat_participants" (
	"chat_id" uuid NOT NULL,
	"participant_id" uuid NOT NULL,
	"role" "participant_role" DEFAULT 'participant',
	"joined_at" timestamp DEFAULT now(),
	CONSTRAINT "pk_chat_participant" PRIMARY KEY("chat_id","participant_id")
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"admin_id" uuid,
	"group_icon" text,
	"type" "chat_type" DEFAULT 'group',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "message_status" (
	"message_id" bigint NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "message_state" DEFAULT 'sent',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"chat_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text,
	"attachment_url" text,
	"message_type" "message_type" DEFAULT 'text',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_details" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"bio" text,
	"status" boolean DEFAULT false,
	"profile_url" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chat_participants" ADD CONSTRAINT "fk_participant" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_participants" ADD CONSTRAINT "fk_chat" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "fk_admin" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_status" ADD CONSTRAINT "fk_message" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_status" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_group" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_sender" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_details" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_name_idx" ON "chats" USING btree ("name");--> statement-breakpoint
CREATE INDEX "token_idx" ON "refresh_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");