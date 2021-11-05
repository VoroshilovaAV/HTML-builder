//импорт модулей
const fs = require('fs');
const path = require('path');

const oldDir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

//создаем папку 
fs.mkdir (newDir, (err) => {
        if (err) {if (err.code == 'EEXIST'); //игнорируем ошибку, если папка существует
        
        //удаляем файлы из files-copy
        
        fs.readdir(newDir, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(__dirname, 'files-copy', file), err => {
                if (err) throw err;
              });
            }
          });

        //копируем файлы
        fs.readdir(oldDir, (err, files) => { 
            files.forEach(file => {                
                              
                fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => { 
                    if (err) {if (err.code == 'EEXIST');} //игнорируем ошибку
                });      

            }); 
        });             
           
        } else {            

            fs.readdir(oldDir, (err, files) => { 
                files.forEach(file => {
                    
                    fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => { 
                        if (err) {if (err.code == 'EEXIST');} //игнорируем ошибку
                    }); 
                })
            });
        };     
});

