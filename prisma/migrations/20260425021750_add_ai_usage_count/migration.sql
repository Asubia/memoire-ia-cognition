-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TestSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "testType" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "aiUsageCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "TestSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TestSession" ("completedAt", "id", "score", "startedAt", "testType", "total", "userId") SELECT "completedAt", "id", "score", "startedAt", "testType", "total", "userId" FROM "TestSession";
DROP TABLE "TestSession";
ALTER TABLE "new_TestSession" RENAME TO "TestSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
