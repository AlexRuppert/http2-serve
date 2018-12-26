import fs from 'fs'
export default {
  port: 8080,
  key: fs.readFileSync('cert/localhost.key'),
  cert: fs.readFileSync('cert/localhost.cert'),
  allowHTTP1: true,
}
