//модуль fs для чтения и модуль path для указания пути
const fs = require('fs');
const path = require('path');

//создание нового ReadStream из файла text.txt
let stream = new fs.ReadStream(path.join(__dirname, 'text.txt'), {encoding: 'utf-8'});

stream.on('readable', function() {
    var data = stream.read();    
    if (data) {
        console.log(data);
    }
});
