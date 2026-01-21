import { supabase } from "./lib/supabase";

async function checkSchema() {
    const { data, error } = await supabase
        .from("cases")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Error:", error);
    } else {
        if (data && data.length > 0) {
            console.log("Columns:", Object.keys(data[0]));
            // Log the full object to see types/values if needed
            console.log("Sample Data:", data[0]);
        } else {
            console.log("No data found in cases table. Cannot infer schema.");
        }
    }
}

checkSchema();
