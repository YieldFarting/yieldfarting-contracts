import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('FartToken', function () {
	before(async function () {
		let [_, masterchef, alice, bob, carol] = await ethers.getSigners();
		this.masterchef = masterchef;
		this.alice = alice;
		this.bob = bob;
		this.carol = carol;
	});

	beforeEach(async function () {
		let FartToken = await ethers.getContractFactory('FartToken');
		this.fart = await FartToken.deploy();
		await this.fart.deployed();

		// set masterchef address and connect it
		await this.fart.setMasterChef(this.masterchef.address);
		this.fart = await ethers.getContractAt('FartToken', this.fart.address, this.masterchef);
	});

	it('should have correct masterchef', async function () {
		expect(await this.fart.masterChef()).to.equal(this.masterchef.address);
	});

	it('should have correct name and symbol and decimal', async function () {
		const name = await this.fart.name();
		const symbol = await this.fart.symbol();
		const decimals = await this.fart.decimals();
		expect(name, 'FARTING');
		expect(symbol, 'FART');
		expect(decimals, '18');
	});

	it('should only allow masterchef to mint token', async function () {
		await this.fart.mint(this.alice.address, '100');
		await this.fart.mint(this.bob.address, '1000');
		await expect(this.fart.connect(this.alice).mint(this.carol.address, '1000')).to.be.revertedWith(
			'Caller is not the masterchef'
		);
		const totalSupply = await this.fart.totalSupply();
		const aliceBal = await this.fart.balanceOf(this.alice.address);
		const bobBal = await this.fart.balanceOf(this.bob.address);
		const carolBal = await this.fart.balanceOf(this.carol.address);
		expect(totalSupply).to.equal('1100');
		expect(aliceBal).to.equal('100');
		expect(bobBal).to.equal('1000');
		expect(carolBal).to.equal('0');
	});

	it('should supply token transfers properly', async function () {
		await this.fart.mint(this.alice.address, '100');
		await this.fart.mint(this.bob.address, '1000');
		await this.fart.connect(this.alice).transfer(this.carol.address, '10');
		await this.fart.connect(this.bob).transfer(this.carol.address, '100');
		const totalSupply = await this.fart.totalSupply();
		const aliceBal = await this.fart.balanceOf(this.alice.address);
		const bobBal = await this.fart.balanceOf(this.bob.address);
		const carolBal = await this.fart.balanceOf(this.carol.address);
		expect(totalSupply, '1100');
		expect(aliceBal, '90');
		expect(bobBal, '900');
		expect(carolBal, '110');
	});

	it('should fail if you try to do bad transfers', async function () {
		await this.fart.mint(this.alice.address, '100');
		await expect(this.fart.transfer(this.carol.address, '110')).to.be.revertedWith(
			'ERC20: transfer amount exceeds balance'
		);
		await expect(
			this.fart.connect(this.bob).transfer(this.carol.address, '1', { from: this.bob.address })
		).to.be.revertedWith('ERC20: transfer amount exceeds balance');
	});
});
