import { app } from "./support/setupExpress.js";
import { query } from "./support/db.js";
// import { setupARouteHandlerDemonstratingValidationWithZod } from "./zodDemo/setupARouteHandlerDemonstratingValidationWithZod.js";

app.get("/", (req, res) => {
    res.json({
        outcome: "success",
        message: "hello world!  Try /fictional_sayings",
    });
});

app.get("/fictional_sayings", async (req, res) => {
    try {
        const dbResult = await query("select * from fictional_characters");
        console.log(dbResult.rows);
        res.json(dbResult.rows);
    } catch (error) {
        console.error("error handling db-check: ", error);
    }
});

app.post("/fictional_sayings", async (req, res) => {
    const data = req.body;
    console.log(req.body);
    try {
        const dbResult = await query(
            "INSERT INTO fictional_characters (character_name, quote) VALUES ($1, $2) RETURNING *",
            [data.character_name, data.quote]
        );
        res.json(dbResult.rows);
    } catch (error) {
        console.error("error adding row: ", error);
    }
});

// use the environment variable PORT, or 4000 as a fallback
const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
    console.log(
        `Your express app started listening on ${PORT}, at ${new Date()}`
    );
});
