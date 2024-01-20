const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'localhost', port: 5001, protocol: 'http' }); 

async function add(data, path = '') {
  try {
    const result = await ipfs.add(data, { path });
    return result[0].path; // cid of the recent added content
  } catch (error) {
    console.error('IPFS add error:', error);
    throw error;
  }
}

async function get(cid) {
  try {
    const result = await ipfs.get(cid);
    return result.data;
  } catch (error) {
    console.error('IPFS get error:', error);
    throw error;
  }
}

async function getList(path) {
  try {
    const result = await ipfs.ls(path);
    return result.Objects.map((obj) => obj.Hash);
  } catch (error) {
    console.error('IPFS getList error:', error);
    throw error;
  }
}

async function append(path, data) {
  try {
    const result = await ipfs.files.write(`${path}/${data}`, '', { create: true });
    return result;
  } catch (error) {
    console.error('IPFS append error:', error);
    throw error;
  }
}

module.exports = { add, get, getList, append };
