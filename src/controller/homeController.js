import pool from '../config/connectDB';
import QRCode from 'qrcode';
import Jimp from 'jimp';
import fs from 'fs';
import QrCode from 'qrcode-reader';
import paypal from 'paypal-rest-sdk';
import puppeteer from 'puppeteer';

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Ad8Ulf7mdxOu5bfdburckWbPVz5qUXv01lurZEGt_u0hbxP4W1omPvM2ILnnwzwKzsdFTpquAEuEXA_o',
    'client_secret': 'EGGx4XMeiAl7VN0Jm3tuSz-bm8fVii1s2ONqp_1vZ1edZ_9FlpORG6w3NzjdbSx9ULCUiaP_V3JFsBc8'
});

let getHomePage = (req, res) => {
    return res.redirect('/client');
};
let verifyAccount = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM account');
    console.log('check data post', req.body.username, req.body.password);
    console.log('check database', rows.length);
    let check = false;
    for (let i = 0; i < rows.length; i++) {
        if (req.body.username == rows[i].username && req.body.password == rows[i].password) {
            check = true;
        }
    }
    if (check == true) {
        console.log('thanh cong');
        return res.redirect('/ad');
    }  else {
        console.log('khong thanh cong');
        return res.redirect('/');
    }

};
let createAccount = async (req, res) => {
    console.log('check data create post', req.body);
    const [rows, fields] = await pool.execute('SELECT * FROM account');
    console.log('check database to create', rows);
    await pool.execute(`INSERT INTO account (username, password, email) VALUES (?,?,?)`, [req.body.username, req.body.password, req.body.email]);
    return res.redirect('/');
};
let getQRCode = async (req, res) => {
    // let img='';
    // let qrImage = await QRCode.toDataURL('I am Cuamotcang!');
    // console.log(qrImage);
    // img = `<image src= " `+qrImage+ `" />`;
    // // console.log(img);


    // let date_ob = new Date();
    // // current date
    // // adjust 0 before single digit date
    // let date = ("0" + date_ob.getDate()).slice(-2);
    // // current month
    // let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // // current year
    // let year = date_ob.getFullYear();
    // // current hours
    // let hours = date_ob.getHours();
    // // current minutes
    // let minutes = date_ob.getMinutes();
    // // current seconds
    // let seconds = date_ob.getSeconds();
    // // prints date in YYYY-MM-DD format
    // console.log(year + "-" + month + "-" + date);
    // // prints date & time in YYYY-MM-DD HH:MM:SS format
    // let timenow = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    // // console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    // console.log(timenow);
    // // prints time in HH:MM format
    // // console.log(hours + ":" + minutes);
    // await QRCode.toFile('testqr01.png', 'I am Cuamotcanggggg!', function(err) {
    //     if (err) return console.log('error');
    // });
    var path = './src/public/img/QR/qr.png';
    var buffer = fs.readFileSync(path);
    let text = '';
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error(err);
            // TODO handle error
            return res.render('error.ejs');
        }
        var qr = new QrCode();
        qr.callback = function(err, value) {
            if (err) {
                console.error(err);
                // TODO handle error
                return res.render('error.ejs');
            }
            console.log(value.result);
            console.log(value);
            text = value.result;
            console.log('check text inside ', text);
            let id = text.slice(text.search('ID: ') + 4, text.search(' Tên'));
            let name = text.slice(text.search('món: ') + 4, text.search('Giá:'));
            let price = text.slice(text.search('Giá: ') + 4, text.search('Số'));
            let count = text.slice(text.search('lượng: ') + 7);
            console.log('check slice id text: ', id);
            console.log('check slice name text: ', name);
            console.log('check slice price text: ', price);
            console.log('check slice count text: ', count);
            return res.render('qr.ejs', {dataText: text, id: id, name: name, price: price, count: count});
        };
        qr.decode(image.bitmap);
        // console.log('check text ', qr.callback);
    });
    // await console.log('check text outside ', read);

    // const payerId = req.query.PayerID;
    // const paymentId = req.query.paymentId;

    // const execute_payment_json = {
    //     "payer_id": payerId,
    //     "transactions": [{
    //         "amount": {
    //             "currency": "USD",
    //             "total": `${req.body.price}`
    //         }
    //     }]
    // };
    // paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
    //     if (error) {
    //         console.log(error.response);
    //         throw error;
    //     } else {
    //         console.log(JSON.stringify(payment));
    //         res.send('Success (Mua hàng thành công)');
    //     }
    // });
    // console.log('check body ', req);
    // return res.render('qr.ejs');
};
let getQRCodeMul = (req, res) => {
    var path = './src/public/img/QR/qr.png';
    var buffer = fs.readFileSync(path);
    let text = '';
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error(err);
            // TODO handle error
            return res.render('error.ejs');
        }
        var qr = new QrCode();
        qr.callback = function(err, value) {
            if (err) {
                console.error(err);
                // TODO handle error
                return res.render('error.ejs');
            }
            console.log(value.result);
            console.log(value);
            text = value.result;
            console.log('check text inside ', text);
            return res.render('qrmul.ejs', {dataText: text});
        };
        qr.decode(image.bitmap);
        // console.log('check text ', qr.callback);
    });
};
let getCancelPage = (req, res) => {
    return res.render('cancel.ejs');
};

//client
let getClientHomePage = (req, res) => {
    return res.render('client/clientHome.ejs' ,{data: ""});
};
let getClientBook = async (req, res) => {

    const [rows, fields] = await pool.execute('SELECT * FROM menuday');
    console.log(rows.id);
    console.log(rows[0]);
    if (rows[0] == undefined) {
        console.log("undefined");
        // let data = [];
        // data[0] = '';
        // data[1] = '';
        // data[2] = '';
        return res.render('client/clientBook.ejs', {data:''}); 
    } else {
        console.log("have data");
        return res.render('client/clientBook.ejs', {data:rows});
    }

};
let postClientBook = (req, res) => {
    console.log(req.body);
    var total = 0;
    for (let i = 0; i < req.body.name.length; i++) {
        total += parseInt(req.body.price[i]) * parseInt(req.body.count[i]);
    }
    return res.render('client/clientCheckout.ejs', {data: req.body, total: total});
};
let getClientCheckout = (req, res) => {
    return res.render('client/clientCheckout.ejs');
};
let getClientMenuEdit = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM menuday');
    console.log(rows.id);
    console.log(rows[0]);
    if (rows[0] == undefined) {
        console.log("undefined");
        let data = [];
        data[0] = '';
        data[1] = '';
        data[2] = '';
        return res.render('client/clientHome.ejs', {data:data}); 
    } else {
        console.log("have data");
        return res.render('client/clientHome.ejs', {data:rows});
    }
    
};
let addSalesCount = async (req, res) => {
    console.log('check data post buy', req.body.name);
    const [rows, fields] = await pool.execute(`SELECT salescount FROM menuday WHERE name = '${req.body.name}'`);
    console.log('check database buy', rows[0]);
    let updatecount = parseInt(rows[0].salescount) + 1;
    await pool.execute(`UPDATE menuday SET salescount = '${updatecount}' WHERE name = '${req.body.name}'`);

    console.log('check date ', Date(Date.now()));
    let a = Date(Date.now());
    console.log(a);
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    // prints date in YYYY-MM-DD format
    let d = year + "-" + month + "-" + date;
    let dtime = year + "-" + month + "-" + date + " " + hours + "-" + minutes + "-" + seconds;
    console.log(dtime);
    console.log(year + "-" + month + "-" + date);
    var id = Date.now();
    await pool.execute(`INSERT INTO hoadon (id, createTime) VALUES (?, ?)`, [id, dtime]);
    // await pool.execute(`UPDATE hoadon SET createTime = '${dtime}' WHERE id = 1`);
    const [dt, fieldsd] = await pool.execute(`SELECT * FROM hoadon WHERE id = (?)`, [id]);
    console.log('check database dt ', dt);
    const [rowsid, fieldsid] = await pool.execute(`SELECT id FROM hoadon WHERE id = (?)`, [id]);
    console.log('check database id', rowsid[0]);

    QRCode.toFile(`./src/public/img/QR/qr.png`, `ID: ${id} Tên món: ${req.body.name} Giá: ${req.body.price} Số lượng: 1`, function(err) {
        if (err) return console.log(err);
    });
    //

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://cantin-nodejs.onrender.com/qr",
            "cancel_url": "https://cantin-nodejs.onrender.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": `${req.body.name}`,
                    "sku": "001",
                    "price": `${req.body.price}`,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": `${req.body.price}`
            },
            "description": `${req.body.name}`
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }

        }
    });
};
let addSalesCountBook = async (req, res) => {
    console.log('check data post buy book', req.body.name.length);
    for (let i = 0; i < req.body.name.length; i++) {
        const [rows, fields] = await pool.execute(`SELECT salescount FROM menuday WHERE name = '${req.body.name[i]}'`);
        console.log('check database buy book ', rows.length);
        let updatecount = parseInt(rows[0].salescount) + parseInt(req.body.salescount[i]);
        await pool.execute(`UPDATE menuday SET salescount = '${updatecount}' WHERE name = '${req.body.name[i]}'`);
    }
    let names = '';
    let price = 0;
    for (let i = 0; i < req.body.name.length; i++) {
        let price1 = 0;
        price1 += parseInt(req.body.price[i]) * parseInt(req.body.salescount[i]);
        names += `${req.body.name[i]} Số lượng: ${req.body.salescount[i]} - `;
        price += price1;
    }
    // let qrImage = await QRCode.toDataURL(`Tên món: ${req.body.name}\nGiá: ${req.body.price}\nSố lượng: 1`);
    // console.log(qrImage);
    // img = `<image src= " `+qrImage+ `" />`;

    console.log('check date ', Date(Date.now()));
    let a = Date(Date.now());
    console.log(a);
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    // prints date in YYYY-MM-DD format
    let d = year + "-" + month + "-" + date;
    let dtime = year + "-" + month + "-" + date + " " + hours + "-" + minutes + "-" + seconds;
    console.log(dtime);
    console.log(year + "-" + month + "-" + date);
    console.log(dt);
    var id = Date.now();
    await pool.execute(`INSERT INTO hoadon (id, createTime) VALUES (?, ?)`, [id, dtime]);
    // await pool.execute(`UPDATE hoadon SET createTime = '${dtime}' WHERE id = 1`);
    const [dt, fieldsd] = await pool.execute(`SELECT * FROM hoadon WHERE id = (?)`, [id]);
    console.log('check database dt ', dt);
    const [rowsid, fieldsid] = await pool.execute(`SELECT id FROM hoadon WHERE id = (?)`, [id]);
    console.log('check database id', rowsid[0]);

    QRCode.toFile(`/img/QR/qr.png`, `ID: ${id} Tên món: ${names} Tổng: ${price}`, function(err) {
        if (err) return console.log(err);
    });
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://cantin-nodejs.onrender.com/qrmul",
            "cancel_url": "https://cantin-nodejs.onrender.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": `${names}`,
                    "sku": "001",
                    "price": `${price}`,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": `${price}`
            },
            "description": `${names}`
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }

        }
    });
    // return res.redirect('/client/clientBook');
};

//admin
let getAdHomePage = async (req, res) => {
    const [rowsMenu, fieldsMenu] = await pool.execute('SELECT * FROM menuday');
    // console.log(typeof rowsMenu[0]);
    if (typeof rowsMenu[0] == 'undefined') {
        console.log('check undefined');
        const [rows, fields] = await pool.execute('SELECT * FROM menu');
        return res.render('ad/adHome.ejs', {data: rows, files : ''});
    }
    fs.readdir('./src/public/img/QR', (err, files) => {
        if (err)
            console.log(err);
        else {
            console.log("\nCurrent directory filenames:");
            files.forEach(file => {
                console.log(file);
            })
        }
        console.log('check files ', files);
        return res.render('ad/adHome.ejs', { data: rowsMenu, files: files });
    })

    // return res.render('ad/adHome.ejs', { data: rowsMenu });
    // const [rows, fields] = await pool.execute('SELECT * FROM menu');
    // return res.render('ad/adHome.ejs', {data: rows});
};
let getAdMenuEdit = async (req, res) => {
    let data = [];
    const [rows, fields] = await pool.execute('SELECT * FROM menu');
    return res.render('ad/adMenuEdit.ejs', {data: rows});
};
let postAdMenuEdit = async (req, res) => {
    console.log('check data', req.body);
    return res.render('ad/adHome.ejs', {data: req.body});
};
let createData = async (req, res) => {
    console.log(req.body);
    // pool.connect(function(err) {
    //     if (err) throw err;
    //     var sql = "DROP TABLE IF EXISTS menuday";
    //     pool.query(sql, function (err, result) {
    //       if (err) throw err;
    //     //   console.log(result);
    //     });
    // });
    await pool.execute('DROP TABLE IF EXISTS menuday');
    console.log("Connected!");
    // var sql = "CREATE TABLE menuday (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price VARCHAR(255))";
    // await pool.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Table created");
    // });
    await pool.execute("CREATE TABLE menuday (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price VARCHAR(255), category VARCHAR(255), salescount VARCHAR(255), instock VARCHAR(255))");
    console.log('creating');
    // var sql = "INSERT INTO menuday (name, price) VALUES ?";
    // // var values2;
    // // for (let i = 0; i < req.body.test.length; i++) {
    // //     for (let j = 0; j < 2; j++) {
    // //         values2[i][0] = req.body.test[0];
    // //     }
    // // }
    // var values = [
    //     ['demian', 'demian@gmail.com'],
    //     ['john', 'john@gmail.com'],
    //     ['mark', 'mark@gmail.com'],
    //     ['pete', 'pete@gmail.com']
    // ];
    // // console.log(values2[0][0]);
    // await pool.execute(sql, [values], function(err) {
    //     if (err) throw err;
    //     pool.end();
    // });
    // let data = [];
    // pool.query(
    //     'SELECT * FROM `menuday` ',
    //     function (err, results, fields) {
    //         results.map((row) => {
    //             data.push({
    //                 id: row.id,
    //                 name: row.name,
    //                 price: row.price
    //             })

    //         });
    //         console.log(data);

    //     })
    console.log(req.body.name.length);
    for (let i = 0; i < req.body.name.length; i++) {
        await pool.execute(`INSERT INTO menuday (name, price, category, salescount, instock) VALUES (?,?,?,?,?)`, [req.body.name[i], req.body.price[i], req.body.category[i], '0', '0']);
    }
    const [rows, fields] = await pool.execute('SELECT * FROM menuday');
    fs.readdir('./src/public/img/QR', (err, files) => {
        if (err)
            console.log(err);
        else {
            console.log("\nCurrent directory filenames:");
            files.forEach(file => {
                console.log(file);
            })
        }
        console.log('check files ', files);
        return res.render('ad/adHome.ejs', { data: rows, files: files });
    })
    // return res.render('ad/adHome.ejs', { data: rows });

};
let getAdStock = async (req, res) => {
    const [rows, fields] = await pool.execute(`SELECT * FROM menuday`);
    const [rowsDrink, fieldsDrink] = await pool.execute(`SELECT * FROM menuday WHERE category = 'Drink'`);
    const [rowsDessert, fieldsDessert] = await pool.execute(`SELECT * FROM menuday WHERE category = 'Dessert'`);
    console.log('check database stock', rows);
    console.log('check database stock Drink', rowsDrink.length);
    console.log('check database stock Dessert', rowsDessert[0]);
    // console.log(rows[0]);
    if (rows[0] == undefined) {
        console.log("undefined");
        // let data = [];
        // data[0] = '';
        // data[1] = '';
        // data[2] = '';
        return res.render('ad/adStock.ejs', {data:'', dataDrink: '', dataDessert: ''}); 
    } else {
        console.log("have data");
        return res.render('ad/adStock.ejs', {data:rows, dataDrink: rowsDrink, dataDessert: rowsDessert});
    }
};
let importProducts = async (req, res) => {
    console.log('check data post stock ', req.body);
    for (let i = 0; i < req.body.count.length; i++) {
        await pool.execute(`UPDATE menuday SET instock = ${req.body.count[i]} WHERE name = '${req.body.name[i]}'`);
    }
    return res.redirect('/ad');
};
let getAdDayReport = async (req, res) => {
    const [rows, fields] = await pool.execute(`SELECT * FROM menuday`);
    console.log('check database day report', rows);
    const [rowsDrink, fieldsDrink] = await pool.execute(`SELECT * FROM menuday WHERE category = 'Drink'`);
    console.log('check database drink day report', rowsDrink);
    const [rowsDessert, fieldsDessert] = await pool.execute(`SELECT * FROM menuday WHERE category = 'Dessert'`);
    console.log('check database dessert day report', rowsDessert[0].price);
    let totalDayRevenue = 0;
    console.log('check map ', rowsDrink[0].salescount);
    console.log('check map ', rowsDrink.instock);
    for (let i = 0; i < rows.length; i++) {
        totalDayRevenue += parseInt(rows[i].price) * parseInt(rows[i].salescount);
    }
    return res.render('ad/adDayReport.ejs', {data: rows, dataDrink: rowsDrink, dataDessert: rowsDessert, 
        totalDayRevenue: totalDayRevenue});
};
let getDayReport = async (req, res) => {
    const [rows, fields] = await pool.execute(`SELECT * FROM menuday`);
    console.log('check database day report', rows);
    const [rowsDrink, fieldsDrink] = await pool.execute(`SELECT * FROM menuday WHERE category = 'Drink'`);
    console.log('check database drink day report', rowsDrink);
    const [rowsDessert, fieldsDessert] = await pool.execute(`SELECT * FROM menuday WHERE category = 'Dessert'`);
    console.log('check database dessert day report', rowsDessert[0].price);
    let totalDayRevenue = 0;
    console.log('check map ', rowsDrink[0].salescount);
    console.log('check map ', rowsDrink.instock);
    for (let i = 0; i < rows.length; i++) {
        totalDayRevenue += parseInt(rows[i].price) * parseInt(rows[i].salescount);
    }
    console.log('check post total day', req.body);
    await pool.execute(`INSERT INTO revenue (date, totalday) VALUES (?,?)`, [req.body.date, req.body.totalday]);
    return res.render('ad/adGetDayReport.ejs', {data: rows, dataDrink: rowsDrink, dataDessert: rowsDessert, 
        totalDayRevenue: totalDayRevenue, date: req.body.date});
};
let getAdMonthReport = async (req, res) => {
    
    return res.render('ad/adMonthReport.ejs', {dataDate: '', dateTotalDay: '', month: '', totalMonth: '',
                                                monthdata: '', totaldata: ''});
};
let addTotalDay = async (req, res) => {
    console.log('check post total day', req.body);
    await pool.execute(`INSERT INTO revenue (date, totalday) VALUES (?,?)`, [req.body.date, req.body.totalday]);
    return res.redirect('/ad');
};
let sendMonth = async (req, res) => {
    console.log('check data post month send ', req.body);
    const [rows, fields] = await pool.execute(`SELECT date FROM revenue WHERE (date > '2022-${req.body.month}-01' and date < '2022-${req.body.month}-31')`);
    const [rows1, fields1] = await pool.execute(`SELECT totalday FROM revenue WHERE (date > '2022-${req.body.month}-01' and date < '2022-${req.body.month}-31')`);
    console.log('check database date ',rows);
    console.log('check database month ',rows1[0]);
    let totalMonth = 0;
    for (let i = 0; i < rows1.length; i++) {
        totalMonth += rows1[i].totalday;
    }
    (async function() {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto('https://cantin-nodejs.onrender.com/', {
                waitUntil: 'networkidle0'
            })
        
            const pdf = await page.pdf({
                printBackground: true,
                format: 'Letter'
            })
        
            await browser.close()
        
            fs.writeFile("./report.pdf", pdf, {}, (err) => {
                if(err){
                    return console.error('error')
                }
        
                console.log('success!')
            })
        }
        catch(e) {
            console.log('error ', e);
        }
    })();
    return res.render('ad/adMonthReport.ejs', {dataDate: rows, dataTotalDay: rows1, 
        month: `Báo cáo tháng: ${req.body.month}`,
     totalMonth: `Tổng thu nhập tháng ${req.body.month}: ${totalMonth} VND`,
    monthdata: req.body.month,
    totaldata: totalMonth});
};
let getScanQR = (req, res) => {
    fs.readdir('./src/public/img/QR', (err, files) => {
        if (err)
            console.log(err);
        else {
            console.log("\nCurrent directory filenames:");
            files.forEach(file => {
                console.log(file);
            })
        }
        console.log('check files ', files);
        return res.render('ad/adScan.ejs', {files: files});
    })
};
let dropTable = async (req, res) => {
    await pool.execute(`drop table if exists hoadon`);
    await pool.execute(`create table hoadon(id varchar(255), createTime dateTime, doneTime dateTime)`);
    return res.redirect('/ad');
};
let adScan = async (req, res) => {
    var path = './src/public/img/QR/qr.png';
    var buffer = fs.readFileSync(path);
    let text = '';
    Jimp.read(buffer, async function(err, image) {
        if (err) {
            console.error(err);
            // TODO handle error
        }
        var qr = new QrCode();
        qr.callback = async function(err, value) {
            if (err) {
                console.error(err);
                // TODO handle error
            }
            console.log(value.result);
            console.log(value);
            text = value.result;
            console.log('check text inside ', text);
            let id = text.slice(text.search('ID: ') + 4, text.search(' Tên'));
            console.log('check id inside ', id);
            let date_ob = new Date();
            // current date
            // adjust 0 before single digit date
            let date = ("0" + date_ob.getDate()).slice(-2);
            // current month
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            // current year
            let year = date_ob.getFullYear();
            // current hours
            let hours = date_ob.getHours();
            // current minutes
            let minutes = date_ob.getMinutes();
            // current seconds
            let seconds = date_ob.getSeconds();
            // prints date in YYYY-MM-DD format
            let d = year + "-" + month + "-" + date;
            let dtime = year + "-" + month + "-" + date + " " + hours + "-" + minutes + "-" + seconds;
            console.log(dtime);
            console.log(year + "-" + month + "-" + date);
            await pool.execute(`UPDATE hoadon SET doneTime = '${dtime}' WHERE id = '${id}'`)
            return res.render('ad/adScan.ejs', {dataText: text});
        };
        qr.decode(image.bitmap);
        // console.log('check text ', qr.callback);
    });
};
let downloadQR = (req, res) => {
    res.download('./src/public/img/QR/qr.png');
};
let downloadDay = async (req, res) => {
    console.log('check post ', req.body.a);
    (async function() {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            var content = `
            <div class="">
                <div class="">
                    <div class="">${req.body.date}</div>
                    <table class="table table-bordered" style="width: 50%">
                        <thead>
                            <tr>
                                <th scope="col">Tên</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Số lượng bán</th>
                                <th scope="col">Số lượng nhập</th>
                                <th scope="col">Số lượng còn</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td scope="row">${req.body.name[10]}</td>
                                <td><%= data[i].price %></td>
                                <td><%= data[i].salescount %></td>
                                <td><%= data[i].instock %></td>
                                <td class="remain"><%= data[i].instock - data[i].salescount %></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>`;
            await page.setContent(content);
            await page.emulateMediaType('screen');
            await page.pdf({
                path: './report.pdf',
                format: 'A4',
                printBackground: true
            })
        
            console.log('success');

            await browser.close();
        }
        catch(e) {
            console.log('error ', e);
        }
    })();
    return res.redirect('/ad');
};
let getMonthReport = async (req, res) => {
    console.log('check data post month ', req.body);
    const [rows, fields] = await pool.execute(`SELECT date FROM revenue WHERE (date > '2022-${req.body.monthdata}-01' and date < '2022-${req.body.monthdata}-31')`);
    const [rows1, fields1] = await pool.execute(`SELECT totalday FROM revenue WHERE (date > '2022-${req.body.monthdata}-01' and date < '2022-${req.body.monthdata}-31')`);
    console.log('check database date report ',rows);
    console.log('check database month report ',rows1[0]);
    let totalMonth = 0;
    for (let i = 0; i < rows1.length; i++) {
        totalMonth += rows1[i].totalday;
    }
    return res.render('ad/adGetMonthReport.ejs', {dataDate: rows, dataTotalDay: rows1, 
                                                month: `Báo cáo tháng: ${req.body.month}`, 
                                                totalMonth: `Tổng thu nhập tháng ${req.body.month}: ${totalMonth} VND`,
                                                monthdata: req.body.monthdata,
                                                totaldata: req.body.totaldata});
};

module.exports = {
    getHomePage,verifyAccount,createAccount,getQRCode,getQRCodeMul,getCancelPage,downloadQR,downloadDay,
    getClientHomePage,getClientBook,getClientCheckout,postClientBook,getClientMenuEdit,addSalesCount,addSalesCountBook,
    getAdHomePage,getAdMenuEdit,postAdMenuEdit,getAdStock,importProducts,getAdDayReport,getAdMonthReport,addTotalDay,sendMonth,getScanQR,dropTable,adScan,getDayReport,getMonthReport,
    createData
}