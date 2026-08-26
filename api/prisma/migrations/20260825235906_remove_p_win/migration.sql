/*
  Warnings:

  - You are about to drop the column `pWin` on the `User` table. All the data in the column will be lost.

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
    "pWinBalance" INTEGER,
    "houseEdge" INTEGER NOT NULL DEFAULT 6,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "deleteAt" DATETIME
);
INSERT INTO "new_User" ("balance", "cpf", "createAt", "deleteAt", "houseEdge", "id", "isActive", "pWinBalance", "password", "role", "updateAt", "username") SELECT "balance", "cpf", "createAt", "deleteAt", "houseEdge", "id", "isActive", "pWinBalance", "password", "role", "updateAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
