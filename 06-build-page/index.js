//импорт модулей
const fs = require('fs');
const path = require('path');

//создаем папку project-dist
const newDir = path.join(__dirname, 'project-dist');
fs.mkdir (newDir, (err) => {
    if (err) {if (err.code == 'EEXIST');} //игнорируем ошибку, если папка существует 
});

/*ДОБАВЛЯЕМ HTML*/
async function recordTemplate() {
    let templateContent = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf8'); //чтение из файла template.html и запись в templateContent 

    const tags = templateContent.match(/(?<=\{\{).+(?=\}\})/g); //нахождение всех имен тэгов в файле шаблона

    //замена шаблонных тегов содержимым файлов-компонентов
    for (let i = 0; i < tags.length; i++) {
        let component = await fs.promises.readFile(path.join(__dirname, 'components', tags[i] + '.html'), 'utf8');
        templateContent = templateContent.replace(`{{${tags[i]}}}`, component);    
    };

    //удаление файла (актуализация содержимого)
    fs.unlink(path.join(newDir, 'index.html'), err => {
        if (err) {if (err.code == 'EEXIST');} //игнорируем ошибку
    }); 

    await fs.promises.writeFile(path.join(newDir, 'index.html'), templateContent); //запись в файл index.html новой папки

};
recordTemplate();

/*ДОБАВЛЯЕМ СSS*/
const stylesDir = path.join(__dirname, 'styles');

//удаление файла (актуализация содержимого)
fs.unlink(path.join(newDir, 'style.css'), err => {
    if (err) {if (err.code == 'EEXIST');} //игнорируем ошибку
}); 

fs.readdir(stylesDir, (err, files) => {     

    files.forEach(file => {

        //абсолютный путь до файла
        const fileDir = path.resolve(stylesDir, file);

        fs.stat (fileDir, async (err, stats) => { 

                    const writePromise = new Promise((resolve,reject) => {
                    let rStream = fs.ReadStream(path.join(stylesDir, file), {encoding: 'utf-8'});
                    let wStream = fs.createWriteStream(path.join(newDir, 'style.css'), {flags: 'a'}, {encoding: 'utf-8'});                    
                    rStream.pipe(wStream); //канал связи потока чтения и записи                   
                    rStream.on('end', () => resolve());
                });                 
                await writePromise;   
        });
    });
}); 

/*КОПИРУЕМ ASSETS*/
const assetsOldDir = path.join(__dirname, 'assets');
const assetsNewDir = path.join(__dirname, 'project-dist/assets');

//создаем папку 
fs.mkdir (assetsNewDir, (err) => {
    if (err) {if (err.code == 'EEXIST'); //игнорируем ошибку, если папка существует
     
    //удаляем файлы в подпапках (актуализация содержимого)
    fs.readdir(assetsNewDir, (err, files) => {
        files.forEach(file => { 
            let assetsNewDirInner = path.join(__dirname, 'project-dist/assets', file);  
            let dir = file;                          
            fs.readdir (assetsNewDirInner, (err, files) => {         
                files.forEach(file => {           
                    fs.unlink(path.join(__dirname, 'project-dist/assets', dir, file), err => {
                        if (err) throw err;
                    });                            
                }); 
            });                  
        });
    });  

    //копируем папки
    fs.readdir(assetsOldDir, (err, files) => {
        files.forEach(file => { 
            let assetsNewDirInner = path.join(__dirname, 'project-dist/assets', file);
            let assetsOldDirInner = path.join(__dirname, 'assets', file);          
            fs.mkdir (assetsNewDirInner, (err) => {
                if (err) {if (err.code == 'EEXIST');} //игнорируем ошибку, если папка существует
                let dir = file;
                //копируем файлы внутри папок
                fs.readdir(assetsOldDirInner, (err, files) => { 
                    files.forEach(file => {           
                        fs.copyFile(path.join(__dirname, 'assets', dir, file), path.join(__dirname, 'project-dist/assets', dir, file), (err) => { 
                        if (err) {if (err.code == 'EEXIST');} //игнорируем ошибку
                        });      
                    }); 
                });   
            });
        });
    });               

    } else {         
        //копируем папки
        fs.readdir(assetsOldDir, (err, files) => {
            files.forEach(file => { 
                let assetsNewDirInner = path.join(__dirname, 'project-dist/assets', file);
                let assetsOldDirInner = path.join(__dirname, 'assets', file);          
                fs.mkdir (assetsNewDirInner, (err) => {
                    if (err) {if (err.code == 'EEXIST');} //игнорируем ошибку, если папка существует
                    let dir = file;
                    //копируем файлы внутри папок
                    fs.readdir(assetsOldDirInner, (err, files) => { 
                        files.forEach(file => {           
                            fs.copyFile(path.join(__dirname, 'assets', dir, file), path.join(__dirname, 'project-dist/assets', dir, file), (err) => { 
                            if (err) {if (err.code == 'EEXIST');} //игнорируем ошибку
                            });      
                        }); 
                    });   
                });
            });
        });   
    };     
});