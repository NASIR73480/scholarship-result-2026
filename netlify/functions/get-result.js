const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const { registration_no } = JSON.parse(event.body || "{}");

    if (!registration_no) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Registration No. is required." })
      };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const cleanRegNo = registration_no.trim().replace(/\s+/g, "").toUpperCase();

    const { data, error } = await supabase
      .from("scholarship_results")
      .select("*")
      .eq("registration_no_clean", cleanRegNo)
      .single();

    if (error || !data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invalid Registration No." })
      };
    }

    const obtainedMarks = data["MARKS OBT."] || "-";

    return {
      statusCode: 200,
      body: JSON.stringify({
        registration_no: data["R.NO"],
        student_name: data["NAME"],
        father_name: data["FATHER NAME"],
        ninth_marks: data["9TH MARKS"],
        school: data["SCHOOL"],
        address: data["ADDRESS"],
        obtained_marks: obtainedMarks,
        gender: data.gender || "-"
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};