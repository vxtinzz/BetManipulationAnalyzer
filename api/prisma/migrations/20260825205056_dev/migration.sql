/*
  Warnings:

  - You are about to drop the column `UpdateAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `updateAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "pWin" INTEGER,
    "pWinBalance" INTEGER,
    "houseEdge" INTEGER NOT NULL DEFAULT 6,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "deleteAt" DATETIME
);
INSERT INTO "new_User" ("balance", "cpf", "createAt", "houseEdge", "id", "isActive", "pWin", "pWinBalance", "password", "role", "username") SELECT "balance", "cpf", "createAt", "houseEdge", "id", "isActive", "pWin", "pWinBalance", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
