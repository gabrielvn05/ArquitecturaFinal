/*
  Warnings:

  - You are about to drop the column `isActive` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionType` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `type` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "isActive",
DROP COLUMN "subscriptionType",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" "SubscriptionType" NOT NULL;
