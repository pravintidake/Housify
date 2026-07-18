ALTER TABLE "Customer" ADD COLUMN "propertyId" TEXT;
CREATE INDEX "Customer_propertyId_idx" ON "Customer"("propertyId");
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
