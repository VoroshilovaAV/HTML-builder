//импорт модулей
const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const bundleDir = path.join(__dirname, 'project-dist');

fs.readdir(stylesDir, (err, files) => {   
       
    files.forEach(file => {

        //абсолютный путь до файла
        const fileDir = path.resolve(stylesDir, file);

        fs.stat (fileDir, async (err, stats) => { 
            
            //проверка на файл
            if (stats.isFile() && (path.extname(file).split('.').pop() == 'css')) {
                
                const writePromise = new Promise((resolve,reject) => {
                    let rStream = fs.ReadStream(path.join(stylesDir, file), {encoding: 'utf-8'});
                    let wStream = fs.createWriteStream(path.join(bundleDir, 'bundle.css'), {flags: 'a'}, {encoding: 'utf-8'});                    
                    rStream.pipe(wStream); //канал связи потока чтения и записи                   
                    rStream.on('end', () => resolve());
                });                 
                await writePromise;                 
            };
        });
    });
});