//импорт модулей
const fs = require('fs');
const path = require('path');
const readline = require('readline');

//создание нового WriteStream 
let stream = fs.createWriteStream(path.join(__dirname, 'text.txt'), {encoding: 'utf-8'});

//readline интерфейс
const { stdin: input, stdout: output, stdout } = require('process');
const rl = readline.createInterface({ input, output });

//приветственное сообщение
stdout.write('Привет, введи свое сообщение: \n');  

//считывание и запись
rl.on('line', (input) => {    
    if (input === 'exit'){        
        rl.close();  
    } else {           
        stream.write(input +"\r\n");                       
    }
});   

//закрытие readline
rl.on('close', () => {
    console.log(`Данные записаны :)`);
});



