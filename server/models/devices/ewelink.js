const ewelink = require('ewelink-api');
const Zeroconf = require('ewelink-api/src/classes/Zeroconf');


class Ewelink {

}
Ewelink.scanDevices = async (config) => {

    const connection = new ewelink({
        email: process.env.EWELINK_EMAIL,
        password: process.env.EWELINK_PASSWORD,
        region: process.env.EWELINK_REGION || 'us',
    });

    const devices = await connection.saveDevicesCache();
    const arp = await Zeroconf.saveArpTable({
        ip: process.env.LOCAL_NETWORK
    });

}
module.exports = Ewelink;