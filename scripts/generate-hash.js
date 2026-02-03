const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'teste123';
    const hash = await bcrypt.hash(password, 10);

    console.log('='.repeat(60));
    console.log('HASH GERADO PARA SENHA: teste123');
    console.log('='.repeat(60));
    console.log(hash);
    console.log('='.repeat(60));
    console.log('\nCopie este hash e use no SQL:');
    console.log(`'${hash}'`);
}

generateHash();
