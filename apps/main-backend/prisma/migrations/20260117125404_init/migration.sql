-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('APPLIED', 'APPROVED', 'DISBURSED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Loans" (
    "loanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "approvedAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "LoanStatusHistory" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'APPLIED',
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Loans_loanId_key" ON "Loans"("loanId");

-- CreateIndex
CREATE INDEX "Loans_userId_idx" ON "Loans"("userId");

-- CreateIndex
CREATE INDEX "Loans_createdAt_idx" ON "Loans"("createdAt");

-- CreateIndex
CREATE INDEX "LoanStatusHistory_loanId_idx" ON "LoanStatusHistory"("loanId");

-- CreateIndex
CREATE INDEX "LoanStatusHistory_status_idx" ON "LoanStatusHistory"("status");

-- CreateIndex
CREATE INDEX "LoanStatusHistory_changedAt_idx" ON "LoanStatusHistory"("changedAt");

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanStatusHistory" ADD CONSTRAINT "LoanStatusHistory_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loans"("loanId") ON DELETE RESTRICT ON UPDATE CASCADE;
