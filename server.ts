import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    const pathname = url.pathname; // パス部分のみを取得

    const filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
    const extname: string = path.extname(filePath);
    const contentType: { [key: string]: string } = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404: File Not Found');
            } else {
                res.writeHead(500);
                res.end('500: Internal Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType[extname] || 'application/octet-stream' });
            res.end(content);
        }
    });
});

const port: number = 3000;
server.listen(port, () => {
    console.log(`Server listening: http://localhost:${port}`);
});