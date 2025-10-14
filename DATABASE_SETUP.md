# Database Setup Instructions

## To fix the "Attended" button issue:

1. **Open PowerShell** in your project directory:
   ```
   cd "C:\Users\Nima Sami\Desktop\cursor-tutorial"
   ```

2. **Update the database schema**:
   ```
   npx prisma db push
   ```

3. **If that doesn't work, try generating Prisma client**:
   ```
   npx prisma generate
   ```

4. **Then try the database push again**:
   ```
   npx prisma db push
   ```

## What this does:
- Adds the `attended` field to the `Booking` table
- Updates the database schema to match your Prisma schema
- Enables the attendance tracking system

## After running the migration:
1. Try clicking the "Attended" button again
2. Check the browser console (F12) for any error messages
3. The balances should update correctly

## If you still have issues:
1. Open browser console (F12)
2. Go to the students page
3. Look for console logs showing the data
4. Check if the `attended` field is present in the booking data
