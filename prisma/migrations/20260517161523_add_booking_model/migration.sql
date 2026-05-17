/*
  Warnings:

  - You are about to drop the column `checkIn` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `guestName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `city` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dates` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_roomId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "checkIn",
DROP COLUMN "checkOut",
DROP COLUMN "email",
DROP COLUMN "guestName",
DROP COLUMN "phone",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "dates" TEXT NOT NULL,
ADD COLUMN     "hotelName" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "roomName" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
