import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["helper", "client"] }).notNull(),
  bio: text("bio"),
  skills: text("skills").array(),
  isOnline: boolean("is_online").default(false),
  rating: integer("rating").default(0),
  verified: boolean("verified").default(false),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", { 
    enum: ["hardware", "software", "network", "mobile", "other"] 
  }).notNull(),
  price: integer("price").notNull(),
  helperId: integer("helper_id").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  serviceId: integer("service_id").notNull(),
  status: text("status", { 
    enum: ["pending", "accepted", "completed", "cancelled"] 
  }).notNull().default("pending"),
  date: timestamp("date").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  isOnline: true,
  rating: true,
  verified: true 
});

export const insertServiceSchema = createInsertSchema(services).omit({ 
  id: true 
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ 
  id: true,
  status: true 
});

export const insertReviewSchema = createInsertSchema(reviews).omit({ 
  id: true 
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
