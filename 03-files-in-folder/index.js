//импорт модулей
const fs = require('fs');
const path = require('path');

//путь до secret-folder
const secretDir = path.join(__dirname, 'secret-folder');

//чтение содержимого secret-folder
fs.readdir(secretDir, (err, files) => { 
    files.forEach(file => {

        //абсолютный путь до файла
        const fileDir = path.resolve(secretDir, file);
        
        fs.stat (fileDir, (err, stats) => { 
           
            //проверка на файл
            if (stats.isFile()) {
                //вывод информации о файлах
                console.log(path.parse(file).name + ' - ' + path.extname(file).split('.').pop() + ' - ' + stats.size + 'b');
            };

        });
    });
});




