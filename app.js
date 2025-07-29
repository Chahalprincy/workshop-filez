import express from "express";
const app = express();
export default app;
import db from "#db/client";

const router = express.Router();
app.use(express.json());

app.use("/", router);

router.route("/files").get(async (req, res) => {
    const sql = `SELECT files.*, folders.name as folder_name FROM files JOIN folders on folders.id = files.folder_id`;
    const { rows: files } = await db.query(sql);
    res.send(files);
});

router.route("/folders").get(async (req, res) => {
    const sql = `SELECT * FROM folders`;
    const { rows: folders } = await db.query(sql);
    res.send(folders);
});

router.route("/folders/:id").get(async (req, res) => {
    const {id} = req.params;

    const sql = `SELECT folders.* ,(SELECT json_agg(files) from files WHERE files.folder_id = folders.id ) as files FROM folders WHERE folders.id = $1`;
    const { rows: [folder] } = await db.query(sql,[id]);

    if (!folder) return res.status(404).send("folder does n't exist");

    res.send(folder);
});

router.route("/folders/:id/files").post(async (req, res) => {
    const {id} = req.params;

    const folderCheck = await db.query("SELECT 1 FROM folders WHERE id = $1", [id]);
    if (folderCheck.rows.length === 0) { return res.status(404).send("folder doesn't exist");}

    if (!req.body) return res.status(400).send("Request body required.");

    const {name, size} = req.body;

    if (!name || !size) {
      return res
        .status(400)
        .send("Missing required fields: name, size ");
    }

    const sql = `INSERT INTO files (name,size,folder_id) VALUES ($1,$2,$3) RETURNING *`;
    const {rows : [file] } = await db.query(sql, [name, size ,id]);

    res.status(201).json(file);
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong :(");
});
