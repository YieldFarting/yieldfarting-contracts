import dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
	solidity: '0.8.10',
	networks: {
		hardhat: {
			loggingEnabled: false,
			accounts: { mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : undefined },
		},
		mainnet: {
			url: process.env.NETWORK_URL || '',
			accounts: { mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : undefined },
		},
	},
};

export default config;
