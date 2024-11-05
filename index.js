const express = require("express");
const koneksi = require("./database/db");
const expressLayouts = require("express-ejs-layouts");
const util = require("util");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.set("views", "views");

// show all data
app.get("/get", (req, res) => {
  const sql = "select * from mahasiswa";
  koneksi.query(sql, (error, result) => {
    if (error) console.error(err);
    res.render("index", { results: result });
  });
});

// add new data
// app.post("/add", (req, res) => {
//   const { name, nim, prodi } = req.body;
//   const sql = `insert into mahasiswa (name,nim,prodi) values ('${name}',${nim},'${prodi}');`;
//   koneksi.query(sql, (err, result) => {
//     if (err) {
//       console.error("ada error nih:", err);
//       res.status(500);
//     }
//     console.log("insert data success ...");
//     res.status(200).redirect("/get");
//   });
// });

app.post("/add", async (req, res) => {
  const qwery = util.promisify(koneksi.query).bind(koneksi);
  const { nama, nim, prodi } = req.body;
  try {
    // Insert data ke database
    await qwery("INSERT INTO mahasiswa (nama, nim, prodi) VALUES (?, ?, ?)", [nama, nim, prodi]);

    // Kirim respons sukses jika berhasil
    // res.status(201).json({ message: "Data berhasil ditambahkan" });
    res.redirect("/get");
  } catch (error) {
    // Tangani error duplikasi NIM
    if (error.code === "ER_DUP_ENTRY") {
      // Kirim respons khusus jika NIM sudah ada
      return res.status(409).json({ message: "NIM sudah digunakan" });
    }
    // Tangani error lainnya
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// update data use nim
app.post("/update/:id", (req, res) => {
  const { nama, prodi, nim } = req.body;
  const id = req.params.id;
  const sql = `update mahasiswa set nama= ? ,nim= ?,prodi= ?  where mahasiswa.id =${id} `;
  koneksi.query(sql, [nama, nim, prodi], (err, result) => {
    if (err) console.log(err);
    console.log("update data berhasil");
    res.redirect("/get");
  });
});

// delete data
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from mahasiswa where mahasiswa.id= ?;";
  koneksi.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
    }
    console.log("delete data success ...");
    res.redirect("/get");
  });
});

const port = 6789;
app.listen(port, () => {
  console.log(`http://localhost:${port}/get`);
});
