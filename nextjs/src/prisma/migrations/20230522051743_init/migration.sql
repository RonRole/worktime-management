-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "ProjectCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WorkTimeDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "projectCodeId" TEXT NOT NULL,
    "date" DATETIME,
    "minutes" INTEGER,
    "content" TEXT,
    CONSTRAINT "WorkTimeDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkTimeDetail_projectCodeId_fkey" FOREIGN KEY ("projectCodeId") REFERENCES "ProjectCode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WorkTimeDetail_userId_date_minutes_idx" ON "WorkTimeDetail"("userId", "date" DESC, "minutes" DESC);
