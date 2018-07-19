# QR Code Generator
A simple QR code generator that using a free online API. You can save QR codes with any name and upload the generated QR codes to a specified database with their original link and barcode number.

You can use this tool to generate QR codes for your online shop with their barcode or product codes.

## Configuration
Edit `config.json` file with your own credentials if you want to use the database storage option. Table creation query is given in the `db-query.txt` file.

To change the attributes of the generated QR codes, take a loot at the `"apiExt" : "&qrsize=200&&t=p&e=m"` line and [here](http://qrickit.com/qrickit_apps/qrickit_api.php) for formatting.

For example, if you want to change the generated file's resolution, change `&qrsize=200`. Or if you want to change the foreground color of the QR code, add `&fgdcolor=0F0F0F` at the end of the line.

## Usage
Simple QR code generation that gives "qr.png" as output in the dir folder.

`> node qr.js -u www.example.com/product-21`

To specify output file's name, use -n. This usage will produce a file named "product.png" under the dir folder.

`> node qr.js -u www.example.com/product-21 -n product21`

To save the results in a MySQL database, use -b. But first configure the "config.json" file.

`> node qr.js -u www.example.com/product-21 -n product21 -b 000021`

## Thanks
[**QRickit**](http://qrickit.com/) for providing the free QR code generation API.
