const { v4: uuidv4 } = require('uuid')
const uid = uuidv4().replace(/-/g, '');

console.log(uid);