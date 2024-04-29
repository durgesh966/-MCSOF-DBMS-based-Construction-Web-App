const { customAlphabet } = require('nanoid');
const alphabet = '0123456789';

const generateNumericId = customAlphabet(alphabet, 15);

const uniqueIdGenerator = () => {
    const randomId = generateNumericId();
    return randomId;
}

module.exports = uniqueIdGenerator;
