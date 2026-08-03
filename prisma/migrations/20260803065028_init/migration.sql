-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('SO', 'PO');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Processing', 'Shipped', 'Delivered', 'Delayed', 'Pending Sync');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('Synchronized', 'Pending Sync');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BSM', 'BSM Assistant', 'BSM Support', 'Procurement', 'Sales Operations', 'Account Manager', 'Group Head', 'President', 'Administrator');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('eta_update', 'sync_success', 'sync_error', 'delay_warning', 'access_request', 'system');

-- CreateEnum
CREATE TYPE "SyncLogStatus" AS ENUM ('Success', 'Failure');

-- CreateEnum
CREATE TYPE "SyncLogType" AS ENUM ('Sales Orders', 'Purchase Orders', 'All');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'Active',
    "last_active" TIMESTAMP(3),
    "allowed_modules" TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "type" "OrderType" NOT NULL,
    "customer_or_vendor" TEXT NOT NULL,
    "order_date" DATE NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'Processing',
    "assigned_to" TEXT,
    "department" TEXT,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'Pending Sync',
    "last_sync" TIMESTAMP(3),
    "supplier_risk" "RiskLevel",
    "sla_threshold_days" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_line_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "part_number" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "eta" DATE,

    CONSTRAINT "order_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eta_history" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "previous_eta" DATE,
    "new_eta" DATE NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "remarks" TEXT,

    CONSTRAINT "eta_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_notes" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "author" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,

    CONSTRAINT "order_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "order_id" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_logs" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SyncLogStatus" NOT NULL,
    "records_processed" INTEGER NOT NULL DEFAULT 0,
    "type" "SyncLogType" NOT NULL,
    "error_details" TEXT,

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line_items" ADD CONSTRAINT "order_line_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eta_history" ADD CONSTRAINT "eta_history_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "order_line_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eta_history" ADD CONSTRAINT "eta_history_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_notes" ADD CONSTRAINT "order_notes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_notes" ADD CONSTRAINT "order_notes_author_fkey" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
