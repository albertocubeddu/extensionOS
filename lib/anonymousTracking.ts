export const insertStatisticsRow = async (table: string, data: any) => {
   // If you want to add tracking, provide two keys from SUPABASE;
   // DO NOT TRACK USER EMAIL WITHOUT CONSENT.
   // Use the getOrCreateClientUUID if you want an anonymous but consisted UUID.
   const supabaseUrl = process.env.PLASMO_PUBLIC_SUPABASE_URL;
   const supabaseKey = process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY; // This key is safe to use in a browser if you have enabled Row Level Security for your tables and configured policies.

   if (!supabaseUrl || !supabaseKey) {
      return { success: false, error: "no key spec" };
   }

   try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
         },
         body: JSON.stringify(data),
      });

      if (!response.ok) {
         const errorData = await response.json();
         console.error("Error inserting row:", errorData);
         return {
            success: false,
            error: `Error inserting row: ${response.status} ${response.statusText}`,
         };
      }
      return { success: true }; // Indicate success
   } catch (error) {
      return { success: false, error: String(error) }; // Handle unexpected errors
   }
};
