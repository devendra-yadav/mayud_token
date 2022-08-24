
const {loadFixture} = require('@nomicfoundation/hardhat-network-helpers');
const {ethers} = require('hardhat');
const {expect} = require('chai');

let humanReadableTokenAmount = (n) => {
    return ethers.utils.parseEther(n.toString());
}

let formatEther = (n) => {
    return ethers.utils.formatEther(n.toString());

}

describe('MayudToken', () => {
    async function contractDeployment(){
        const [deployer, holder1, holder2] = await ethers.getSigners();
        let MayudToken = await ethers.getContractFactory('MayudToken');
        let mayudToken = await MayudToken.deploy();
        await mayudToken.deployed();
        return{deployer, mayudToken, holder1, holder2};
    }    

    describe("Token Deployment", ()=>{
        it("should deploy a token", async ()=>{
            const {deployer, mayudToken} = await loadFixture(contractDeployment);
            console.log(`MayudToken deployed at: ${mayudToken.address}`);
            expect(mayudToken.address).to.be.properAddress;
        })
    })

    describe("Token functionality", () => {
        it("should have initial supply of 1 billion tokens", async () => {
            const {deployer, mayudToken} = await loadFixture(contractDeployment);

            let initialSupply = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Balance of deployer ${initialSupply}`);
            expect(initialSupply).to.be.equal('100000000000.0');
        })

        it("should be able to mint new tokens", async ()=>{
            const {deployer, mayudToken} = await loadFixture(contractDeployment);

            await mayudToken.mint(deployer.address, 100000);

            let currentSupply = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Current Supply ${currentSupply}`);
            expect(currentSupply).to.be.equal('100000100000.0');
        })

        it("should be able to transfer tokens from deployer to holders", async ()=> {
            const {deployer, mayudToken, holder1, holder2} = await loadFixture(contractDeployment);
            let deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance Before : ${deployerBalance}`);

            await mayudToken.transfer(holder1.address, humanReadableTokenAmount(1000000));

            let holder1Balance = formatEther(await mayudToken.balanceOf(holder1.address));
            console.log(`Holder1 Balance : ${holder1Balance}`);

            deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance after : ${deployerBalance}`);

            expect(deployerBalance).to.equal('99999000000.0');
            expect(holder1Balance).to.equal('1000000.0');

        })

        it("should be able to transfer tokens from holder1 to holder2", async ()=> {
            const {deployer, mayudToken, holder1, holder2} = await loadFixture(contractDeployment);
            let deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance Before : ${deployerBalance}`);

            //Deployer to send some balance to holder1 so that he can transfer.
            await mayudToken.transfer(holder1.address, humanReadableTokenAmount(1000000));


            //Holder1 to transfert to holder2
            await mayudToken.connect(holder1).transfer(holder2.address, humanReadableTokenAmount(50000));

            let holder1Balance = formatEther(await mayudToken.balanceOf(holder1.address));
            console.log(`Holder1 Balance : ${holder1Balance}`);

            let holder2Balance = formatEther(await mayudToken.balanceOf(holder2.address));
            console.log(`Holder2 Balance : ${holder2Balance}`);

            deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance after : ${deployerBalance}`);

            expect(deployerBalance).to.equal('99999000000.0');
            expect(holder1Balance).to.equal('950000.0');
            expect(holder2Balance).to.equal('50000.0');

        })
    })
})