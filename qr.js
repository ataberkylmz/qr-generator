/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
const mysql = require('mysql');
const axios = require('axios');
const fs = require('fs');
const args = require('optimist')
  .usage('Usage: node qr.js -u www.example.com -n testfile')
  .demand(['u'])
  .alias('u', 'url')
  .alias('b', 'barcode')
  .alias('n', 'name')
  .describe('u', 'Url to convert QR code.')
  .describe('b', 'Barcode for the product')
  .describe('n', 'Specify name for generated QR file')
  .argv;
const conf = require('./config.json');

let response;
const targetUrl = conf.apiUrl + args.u + conf.apiExt;

async function download() {
  try {
    response = await axios({
      responseType: 'arraybuffer',
      method: 'GET',
      url: targetUrl,
      headers: {
        'Content-Type': 'image/png',
      },
    });

    try {
      if (args.n) {
        fs.writeFileSync(`${args.n}.png`, response.data);
      } else {
        fs.writeFileSync('qr.png', response.data);
      }
      console.log('Convertion successful, you can find the image in the same directory with this file under the name of');
    } catch (err) {
      console.log(`Error while writing the file. Error: ${err}`);
      process.exit(1);
    }
  } catch (error) {
    console.log(`Error while accessing the api. Error: ${error}`);
    process.exit(1);
  }
}

async function handleSQL() {
  let conn;
  if (args.b) {
    conn = mysql.createConnection({
      host: conf.host,
      user: conf.user,
      password: conf.pass,
      database: conf.db,
    });
    try {
      conn.connect((error) => {
        if (error) {
          console.log(error);
          process.exit(1);
        }
        let imageBin;
        if (!args.n) {
          imageBin = fs.readFileSync('qr.png').toString('base64');
        } else {
          imageBin = fs.readFileSync(`${args.n}.png`).toString('base64');
        }

        console.log(imageBin);

        const sql = `INSERT INTO products (barcode, url, qr) VALUES ('${args.b}', '${args.url}','${imageBin}')`;
        console.log('Connection established with the database.');
        conn.query(sql, (err) => {
          if (err) { throw err; }
          console.log('1 record inserted');
        });
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

async function handle() {
  await download();
  await handleSQL();
}
handle();
